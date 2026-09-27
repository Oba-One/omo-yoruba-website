import type { Migration, Mutation, StoredDocument } from './core';

type Row = { way?: unknown };
type Tier = StoredDocument & { variant?: unknown; order?: unknown; event?: { _ref?: string } };

const layoutOf = (document: StoredDocument) => (document.layout ?? {}) as Record<string, unknown>;

/**
 * The way in Odunde's band put first: the stored `takepart` as the site read it, with the option's
 * first value, vendor, standing in for an empty or unknown one (`withLayoutDefaults`).
 */
const leadWay = (stored: unknown) => (stored === 'sponsor' ? 'sponsor' : 'vendor');

/** The program cards a highlight value leaned on while it also swapped the hero's gold button. */
const HIGHLIGHT_CARDS: Readonly<Record<string, string>> = {
  school: 'Language Lessons',
  collective: 'the Collective',
};

/**
 * The tiers the Gala page would reorder once `emphasis` stops putting the table tiers first, by
 * edition: an edition holding table and seat tiers where a seat tier's order does not come after every
 * table tier's (an equal or missing order leaves the page's order to chance). Past editions count too,
 * so nothing depends on the day the plan runs.
 */
function reorderedTiers(tiers: readonly Tier[]): string[] {
  const byEdition = new Map<string, Tier[]>();
  for (const tier of tiers) {
    const edition = tier.event?._ref ?? 'no edition';
    byEdition.set(edition, [...(byEdition.get(edition) ?? []), tier]);
  }
  return [...byEdition]
    .filter(([, list]) => {
      const tables = list.filter((tier) => tier.variant === 'enquiry');
      const seats = list.filter((tier) => tier.variant !== 'enquiry');
      if (tables.length === 0 || seats.length === 0) return false;
      const orders = [...tables, ...seats].map((tier) => tier.order);
      if (orders.some((order) => typeof order !== 'number')) return true;
      return (
        Math.max(...tables.map((tier) => tier.order as number)) >=
        Math.min(...seats.map((tier) => tier.order as number))
      );
    })
    .map(([edition]) =>
      edition === 'no edition' ? 'the tiers naming no edition' : `the tiers of ${edition}`,
    );
}

/**
 * One control per decision (ticket 15, S11, ADR 0042). Odunde's take-part band follows its rows' order:
 * a stored `takepart` moves the row it put first to the top, as the band drew it, then goes. The Gala's
 * tiers follow their order: `emphasis` goes, unless it put table tiers first that their order does not,
 * which waits for the owner. The homepage's event band follows the season option: an empty pick goes,
 * and a chosen one waits for the owner. Each page renders as before. A page holding no `takepart` has
 * been migrated already, or never held one, and its rows show in their own order. Draft tiers are not
 * read: a tier's order is the owner's to set before it is published. The hero's gold button is its own
 * whatever the highlight (the site's change, not this migration's): a note says so where the highlight
 * leans on a program.
 */
export const oneControlMigration: Migration = {
  name: 'one-control',
  description:
    "Retire the second control for three decisions: Odunde's take-part lead, the Gala's emphasis and the homepage's event pick.",
  // The pages by type, not id, so their drafts are read too.
  filter: '_type in ["festivalPage", "galaPage", "homepage", "ticketTier"]',
  plan: (documents) => {
    const mutations: Mutation[] = [];
    const conflicts: string[] = [];
    const notes: string[] = [];
    const tiers = documents.filter((document): document is Tier => document._type === 'ticketTier');
    for (const document of documents) {
      const { _id: id, _rev } = document;
      const layout = layoutOf(document);
      if (document._type === 'festivalPage' && 'takepart' in layout) {
        const lead = leadWay(layout.takepart);
        const rows = Array.isArray(document.takePart) ? (document.takePart as Row[]) : [];
        const at = rows.findIndex((row) => row?.way === lead);
        const set =
          at > 0 ? { takePart: [rows[at], ...rows.filter((_, index) => index !== at)] } : undefined;
        mutations.push({
          patch: { id, ifRevisionID: _rev, ...(set ? { set } : {}), unset: ['layout.takepart'] },
        });
      }
      if (document._type === 'galaPage' && 'emphasis' in layout) {
        const reordered = layout.emphasis === 'tables' ? reorderedTiers(tiers) : [];
        if (reordered.length > 0) {
          conflicts.push(
            `${id} puts the table tiers first (emphasis: tables), but ${reordered.join(' and ')} do not come in that order: give the table tiers the lowest order, then run again.`,
          );
        } else {
          mutations.push({ patch: { id, ifRevisionID: _rev, unset: ['layout.emphasis'] } });
        }
      }
      if (document._type === 'homepage') {
        if (document.leadEvent !== undefined) {
          const picked = (document.leadEvent as { _ref?: string } | null)?._ref;
          if (picked) {
            conflicts.push(
              `${id} picks its event band by hand (${picked}): choose the Leading event option instead, remove the pick, then run again.`,
            );
          } else {
            mutations.push({ patch: { id, ifRevisionID: _rev, unset: ['leadEvent'] } });
          }
        }
        const card = HIGHLIGHT_CARDS[String(layout.highlight)];
        if (card) {
          notes.push(
            `${id} highlights ${card}: the hero shows its own gold button now, no longer that card's action (ADR 0042).`,
          );
        }
      }
    }
    return { mutations, conflicts, notes };
  },
};
