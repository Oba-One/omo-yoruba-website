#!/usr/bin/env bash
# The dataset guard refuses a dataset that is not private, in the Vercel build (packages/web's
# build:vercel, which vercel.json runs) and in the setup wizard's stage 3, which then pushes
# nothing to Vercel. Each refusal has a passing control, so neither assertion is vacuous.
# Runs offline: fixtures/fake-sanity-datasets.mjs answers the datasets API.
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
fake_fetch="$root/scripts/tests/fixtures/fake-sanity-datasets.mjs"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT
failures=0

pass() { printf 'ok   %s\n' "$1"; }
fail() { printf 'FAIL %s\n' "$1"; failures=$((failures + 1)); }

public_dev='[{"name":"production","aclMode":"private"},{"name":"development","aclMode":"public"}]'
private_dev='[{"name":"production","aclMode":"private"},{"name":"development","aclMode":"private"}]'
token="tok-$RANDOM-secret"

# guard DATASETS_JSON [STATUS] [DATASET]: runs the guard alone, output in $work/guard.out.
guard() {
  FAKE_SANITY_DATASETS="$1" FAKE_SANITY_STATUS="${2:-200}" NODE_OPTIONS="--import=$fake_fetch" \
    PUBLIC_SANITY_PROJECT_ID=abc123 PUBLIC_SANITY_DATASET="${3:-development}" SANITY_API_READ_TOKEN="$token" \
    node "$root/scripts/check-dataset-private.mjs" >"$work/guard.out" 2>&1
}

if guard "$private_dev"; then pass "guard passes a private dataset"; else fail "guard refused a private dataset: $(cat "$work/guard.out")"; fi
if guard "$public_dev"; then fail "guard passed a public dataset"; else pass "guard refuses a public dataset"; fi
if grep -q "$token" "$work/guard.out"; then fail "guard printed the token"; else pass "guard never prints the token"; fi
if guard '[{"name":"development","aclMode":"custom"}]'; then fail "guard passed a custom ACL"; else pass "guard refuses a custom ACL"; fi
if guard "$private_dev" 200 staging; then fail "guard passed a missing dataset"; else pass "guard refuses a dataset the project lacks"; fi
if guard '{"error":"Unauthorized"}' 401; then fail "guard passed on HTTP 401"; else pass "guard fails closed on an API error"; fi
if FAKE_SANITY_DATASETS="$private_dev" NODE_OPTIONS="--import=$fake_fetch" PUBLIC_SANITY_PROJECT_ID=abc123 \
  PUBLIC_SANITY_DATASET=development SANITY_API_READ_TOKEN='' node "$root/scripts/check-dataset-private.mjs" >/dev/null 2>&1; then
  fail "guard passed without a token"
else
  pass "guard fails closed without a token"
fi

# The Vercel build: vercel.json runs build:vercel, which must run the guard before astro.
build_command=$(node -e 'console.log(require(process.argv[1]).buildCommand)' "$root/packages/web/vercel.json")
build_script=$(node -e 'console.log(require(process.argv[1]).scripts["build:vercel"])' "$root/packages/web/package.json")
if [[ "$build_command" == *"run build:vercel" ]]; then pass "vercel.json builds through build:vercel"; else fail "vercel.json buildCommand is: $build_command"; fi

mkdir -p "$work/bin"
printf '#!/usr/bin/env bash\ntouch "%s/astro-ran"\n' "$work" >"$work/bin/astro"
chmod +x "$work/bin/astro"
vercel_build() {
  rm -f "$work/astro-ran"
  (cd "$root/packages/web" && PATH="$work/bin:$PATH" FAKE_SANITY_DATASETS="$1" NODE_OPTIONS="--import=$fake_fetch" \
    PUBLIC_SANITY_PROJECT_ID=abc123 PUBLIC_SANITY_DATASET=development SANITY_API_READ_TOKEN="$token" \
    bash -c "$build_script" >/dev/null 2>&1)
}
if vercel_build "$private_dev" && [[ -f "$work/astro-ran" ]]; then pass "Vercel build runs astro on a private dataset"; else fail "Vercel build did not reach astro on a private dataset"; fi
if ! vercel_build "$public_dev" && [[ ! -f "$work/astro-ran" ]]; then pass "Vercel build refuses a public dataset before astro"; else fail "Vercel build went ahead on a public dataset"; fi

# The wizard, run end to end in a copy of the tree with fake vercel, gh and browser openers.
wizard_run() {
  local tree="$work/tree-$1"
  mkdir -p "$tree/scripts" "$tree/packages/web/.vercel" "$tree/packages/content" "$tree/fakebin"
  cp "$root/scripts/setup-wizard.sh" "$root/scripts/check-dataset-private.mjs" "$tree/scripts/"
  echo '{}' >"$tree/packages/web/.vercel/project.json"
  cat >"$tree/fakebin/vercel" <<FAKE
#!/usr/bin/env bash
if [[ "\$1 \$2" == "env add" ]]; then printf '%s|%s\n' "\$*" "\$(cat)" >>"$tree/vercel.log"; else echo "\$*" >>"$tree/vercel.log"; fi
FAKE
  printf '#!/usr/bin/env bash\nexit 1\n' >"$tree/fakebin/gh"
  printf '#!/usr/bin/env bash\nexit 0\n' >"$tree/fakebin/xdg-open"
  chmod +x "$tree/fakebin/"*
  touch "$tree/vercel.log"
  # Answers: banner, project ID, dataset (Enter takes the default), stage 1 pause, two tokens,
  # stage 2 pause, then yes to stage 3's push. Later stages read end of input as no.
  printf '\nabc123\n\n\n%s\nwrite-token\n\ny\n\n' "$token" |
    PATH="$tree/fakebin:$PATH" FAKE_SANITY_DATASETS="$2" NODE_OPTIONS="--import=$fake_fetch" \
      bash "$tree/scripts/setup-wizard.sh" >"$tree/out" 2>&1
  echo "$tree"
}

tree=$(wizard_run private "$private_dev")
if grep -q '^PUBLIC_SANITY_DATASET=development$' "$tree/packages/web/.env"; then pass "wizard defaults the local dataset to development"; else fail "wizard wrote: $(grep DATASET "$tree/packages/web/.env" || true)"; fi
for scope in production preview development; do
  if grep -q "^env add PUBLIC_SANITY_DATASET $scope|development$" "$tree/vercel.log"; then
    pass "wizard stage 3 pushes the private dataset to $scope"
  else
    fail "wizard stage 3 did not push development to $scope"
  fi
done
if grep -q 'PUBLIC_SANITY_DATASET [a-z]*|production' "$tree/vercel.log"; then fail "wizard stage 3 wrote production"; else pass "wizard stage 3 writes no production dataset"; fi

tree=$(wizard_run public "$public_dev")
if grep -q '^env add' "$tree/vercel.log"; then fail "wizard stage 3 pushed to Vercel with a public dataset"; else pass "wizard stage 3 pushes nothing with a public dataset"; fi
if grep -q 'dataset development is not private' "$tree/out"; then pass "wizard says why it pushed nothing"; else fail "wizard gave no reason"; fi

if ((failures)); then
  echo "$failures failure(s)"
  exit 1
fi
echo "all passed"
