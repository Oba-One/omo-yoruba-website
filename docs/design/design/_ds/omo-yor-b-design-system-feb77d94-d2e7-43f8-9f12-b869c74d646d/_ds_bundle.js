/* @ds-bundle: {"format":4,"namespace":"OmoYorBDesignSystem_feb77d","components":[{"name":"EventBand","sourcePath":"components/bands/EventBand.jsx"},{"name":"NewsletterBand","sourcePath":"components/bands/NewsletterBand.jsx"},{"name":"DoorCard","sourcePath":"components/cards/DoorCard.jsx"},{"name":"NewsCard","sourcePath":"components/cards/NewsCard.jsx"},{"name":"PathRow","sourcePath":"components/cards/PathRow.jsx"},{"name":"ProgramCard","sourcePath":"components/cards/ProgramCard.jsx"},{"name":"StatBlock","sourcePath":"components/cards/StatBlock.jsx"},{"name":"PartnerRow","sourcePath":"components/content/PartnerRow.jsx"},{"name":"PullQuote","sourcePath":"components/content/PullQuote.jsx"},{"name":"Timeline","sourcePath":"components/content/Timeline.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Divider","sourcePath":"components/core/Divider.jsx"},{"name":"Kicker","sourcePath":"components/core/Kicker.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"},{"name":"NewsletterSignup","sourcePath":"components/forms/NewsletterSignup.jsx"},{"name":"ImagePlaceholder","sourcePath":"components/media/ImagePlaceholder.jsx"},{"name":"SiteFooter","sourcePath":"components/navigation/SiteFooter.jsx"},{"name":"SiteNav","sourcePath":"components/navigation/SiteNav.jsx"},{"name":"GetInvolvedPage","sourcePath":"ui_kits/website/GetInvolvedPage.jsx"},{"name":"Homepage","sourcePath":"ui_kits/website/Homepage.jsx"},{"name":"OdundePage","sourcePath":"ui_kits/website/OdundePage.jsx"}],"sourceHashes":{"components/bands/EventBand.jsx":"6995e3d83335","components/bands/NewsletterBand.jsx":"b0dfbc345d1e","components/cards/DoorCard.jsx":"7198ab54e7b3","components/cards/NewsCard.jsx":"060c03db9d51","components/cards/PathRow.jsx":"b3ee727786d1","components/cards/ProgramCard.jsx":"873791493693","components/cards/StatBlock.jsx":"4eb06290f5e0","components/content/PartnerRow.jsx":"d06db2dbd563","components/content/PullQuote.jsx":"9314a5e98201","components/content/Timeline.jsx":"7082dde2c7a7","components/core/Button.jsx":"fcde658ba75f","components/core/Divider.jsx":"4a4964fbc829","components/core/Kicker.jsx":"bc0f30332f7e","components/forms/Field.jsx":"d757e8b3d66a","components/forms/NewsletterSignup.jsx":"3a9c522bc908","components/media/ImagePlaceholder.jsx":"b112dd054f88","components/navigation/SiteFooter.jsx":"b21a810fdcfe","components/navigation/SiteNav.jsx":"53e47322cc68","ui_kits/website/GetInvolvedPage.jsx":"ea58da1d66e7","ui_kits/website/Homepage.jsx":"ed55de5c5dc4","ui_kits/website/OdundePage.jsx":"8d2e7882fd61"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.OmoYorBDesignSystem_feb77d = window.OmoYorBDesignSystem_feb77d || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/cards/StatBlock.jsx
try { (() => {
function StatBlock({
  value,
  label,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "oy-stat",
    style: style
  }, /*#__PURE__*/React.createElement("b", null, value), /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { StatBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/StatBlock.jsx", error: String((e && e.message) || e) }); }

// components/content/PartnerRow.jsx
try { (() => {
function PartnerRow({
  partners = [],
  label,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: style
  }, label ? /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-caption)',
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '.12em',
      fontWeight: 600,
      marginBottom: 14
    }
  }, label) : null, /*#__PURE__*/React.createElement("div", {
    className: "oy-partners"
  }, partners.map(p => /*#__PURE__*/React.createElement("span", {
    className: "oy-partner",
    key: p
  }, p))));
}
Object.assign(__ds_scope, { PartnerRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/PartnerRow.jsx", error: String((e && e.message) || e) }); }

// components/content/Timeline.jsx
try { (() => {
function Timeline({
  items = [],
  style
}) {
  return /*#__PURE__*/React.createElement("ol", {
    className: "oy-timeline",
    style: style
  }, items.map((it, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    className: it.major ? 'oy-timeline-major' : undefined
  }, /*#__PURE__*/React.createElement("b", null, it.year, it.title ? ': ' + it.title : ''), /*#__PURE__*/React.createElement("p", null, it.text))));
}
Object.assign(__ds_scope, { Timeline });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Timeline.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function Button({
  variant = 'primary',
  size,
  href,
  disabled,
  arrow,
  type = 'button',
  onClick,
  children,
  style
}) {
  const cls = 'oy-btn oy-btn--' + variant + (size === 'sm' ? ' oy-btn--sm' : '');
  const arrowEl = arrow ? /*#__PURE__*/React.createElement("span", {
    className: "oy-btn-arrow",
    "aria-hidden": "true"
  }, "\u2192") : null;
  if (href != null) return /*#__PURE__*/React.createElement("a", {
    className: cls,
    href: disabled ? undefined : href,
    "aria-disabled": disabled || undefined,
    onClick: onClick,
    style: style
  }, children, arrowEl);
  return /*#__PURE__*/React.createElement("button", {
    className: cls,
    type: type,
    disabled: disabled,
    onClick: onClick,
    style: style
  }, children, arrowEl);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/bands/EventBand.jsx
try { (() => {
function EventBand({
  season = 'gala',
  title,
  meta,
  cta,
  href = '#',
  style
}) {
  const isGala = season === 'gala';
  const t = title || (isGala ? 'End-of-Year Gala 2026' : 'Odun De Festival 2027');
  const m = meta || (isGala ? 'Save the date • Date and venue announced soon' : 'Odún dé: the new year has arrived • Leimert Park Plaza • June 2027');
  const c = cta || (isGala ? 'Tables & Sponsorships' : 'Vendors & Sponsors');
  return /*#__PURE__*/React.createElement("div", {
    className: 'oy-band oy-dark ' + (isGala ? 'oy-band--gala' : 'oy-band--odunde') + ' oy-texture',
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: "oy-wrap oy-band-inner"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, t), /*#__PURE__*/React.createElement("p", null, m)), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    href: href,
    variant: isGala ? 'primary' : 'secondary',
    arrow: true,
    style: !isGala ? {
      background: 'var(--white)',
      color: 'var(--terra-600)',
      borderColor: 'var(--white)'
    } : undefined
  }, c)));
}
Object.assign(__ds_scope, { EventBand });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/bands/EventBand.jsx", error: String((e && e.message) || e) }); }

// components/cards/DoorCard.jsx
try { (() => {
function DoorCard({
  title,
  text,
  cta,
  href = '#',
  primary,
  style
}) {
  return /*#__PURE__*/React.createElement("article", {
    className: "oy-card oy-door",
    style: style
  }, /*#__PURE__*/React.createElement("h3", null, title), /*#__PURE__*/React.createElement("p", null, text), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: primary ? 'primary' : 'secondary',
    href: href
  }, cta));
}
Object.assign(__ds_scope, { DoorCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/DoorCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/NewsCard.jsx
try { (() => {
function NewsCard({
  date,
  title,
  teaser,
  href = '#',
  cta = 'Read more',
  style
}) {
  return /*#__PURE__*/React.createElement("article", {
    className: "oy-card",
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: "oy-card-body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "oy-card-date"
  }, date), /*#__PURE__*/React.createElement("h3", null, title), /*#__PURE__*/React.createElement("p", null, teaser), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "quiet",
    arrow: true,
    href: href,
    style: {
      padding: '10px 0'
    }
  }, cta)));
}
Object.assign(__ds_scope, { NewsCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/NewsCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/PathRow.jsx
try { (() => {
function PathRow({
  chip,
  title,
  text,
  cta,
  href = '#',
  primary,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "oy-path",
    style: style
  }, /*#__PURE__*/React.createElement("span", {
    className: "oy-path-chip"
  }, chip), /*#__PURE__*/React.createElement("div", {
    className: "oy-path-body"
  }, /*#__PURE__*/React.createElement("h3", null, title), /*#__PURE__*/React.createElement("p", null, text)), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: primary ? 'primary' : 'secondary',
    href: href
  }, cta));
}
Object.assign(__ds_scope, { PathRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/PathRow.jsx", error: String((e && e.message) || e) }); }

// components/core/Divider.jsx
try { (() => {
function Divider({
  variant = 'asoke',
  dots = 7,
  style
}) {
  if (variant === 'ayo') return /*#__PURE__*/React.createElement("div", {
    className: "oy-divider-ayo",
    role: "separator",
    style: style
  }, Array.from({
    length: dots
  }, (_, i) => /*#__PURE__*/React.createElement("i", {
    key: i
  })));
  return /*#__PURE__*/React.createElement("div", {
    className: variant === 'asoke-thin' ? 'oy-divider-asoke oy-divider-asoke--thin' : 'oy-divider-asoke',
    role: "separator",
    style: style
  });
}
Object.assign(__ds_scope, { Divider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Divider.jsx", error: String((e && e.message) || e) }); }

// components/content/PullQuote.jsx
try { (() => {
function PullQuote({
  quote,
  children,
  attribution,
  style
}) {
  return /*#__PURE__*/React.createElement("figure", {
    className: "oy-quote",
    style: style
  }, /*#__PURE__*/React.createElement(__ds_scope.Divider, {
    variant: "ayo",
    dots: 5,
    style: {
      justifyContent: 'flex-start',
      marginBottom: 18
    }
  }), /*#__PURE__*/React.createElement("blockquote", null, quote || children), attribution ? /*#__PURE__*/React.createElement("figcaption", null, attribution) : null);
}
Object.assign(__ds_scope, { PullQuote });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/PullQuote.jsx", error: String((e && e.message) || e) }); }

// components/core/Kicker.jsx
try { (() => {
function Kicker({
  yo,
  en,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "oy-kicker",
    style: style
  }, yo || children, yo && en ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "oy-kicker-dot",
    "aria-hidden": "true"
  }, "\u2022"), /*#__PURE__*/React.createElement("span", null, en)) : null);
}
Object.assign(__ds_scope, { Kicker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Kicker.jsx", error: String((e && e.message) || e) }); }

// components/forms/Field.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Field({
  label,
  id,
  type = 'text',
  placeholder,
  hint,
  error,
  disabled,
  required,
  textarea,
  value,
  defaultValue,
  onChange,
  style
}) {
  const errId = error ? id + '-error' : undefined;
  const hintId = hint ? id + '-hint' : undefined;
  const shared = {
    id,
    placeholder,
    disabled,
    required,
    value,
    defaultValue,
    onChange,
    className: 'oy-input',
    'aria-invalid': error ? true : undefined,
    'aria-describedby': [errId, hintId].filter(Boolean).join(' ') || undefined
  };
  return /*#__PURE__*/React.createElement("div", {
    className: 'oy-field' + (error ? ' oy-field--error' : ''),
    style: style
  }, /*#__PURE__*/React.createElement("label", {
    className: "oy-label",
    htmlFor: id
  }, label, required ? ' *' : ''), textarea ? /*#__PURE__*/React.createElement("textarea", shared) : /*#__PURE__*/React.createElement("input", _extends({
    type: type
  }, shared)), hint && !error ? /*#__PURE__*/React.createElement("span", {
    className: "oy-field-hint",
    id: hintId
  }, hint) : null, error ? /*#__PURE__*/React.createElement("span", {
    className: "oy-field-error",
    id: errId,
    role: "alert"
  }, error) : null);
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.jsx", error: String((e && e.message) || e) }); }

// components/forms/NewsletterSignup.jsx
try { (() => {
const {
  useState
} = React;
function NewsletterSignup({
  buttonLabel = 'Subscribe',
  successLabel = 'Ẹ ṣé! ✓',
  placeholder = 'Email address',
  onSubscribe,
  style
}) {
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState('');
  return /*#__PURE__*/React.createElement("form", {
    className: "oy-signup",
    style: style,
    onSubmit: e => {
      e.preventDefault();
      setDone(true);
      onSubscribe && onSubscribe(email);
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "oy-label",
    htmlFor: "oy-news-email",
    style: {
      position: 'absolute',
      width: 1,
      height: 1,
      overflow: 'hidden',
      clip: 'rect(0 0 0 0)'
    }
  }, "Email address"), /*#__PURE__*/React.createElement("input", {
    id: "oy-news-email",
    className: "oy-input",
    type: "email",
    required: true,
    placeholder: placeholder,
    value: email,
    onChange: e => {
      setEmail(e.target.value);
      setDone(false);
    },
    style: {
      minWidth: 220,
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "oy-btn oy-btn--primary",
    type: "submit",
    style: done ? {
      background: 'var(--gold-300)'
    } : undefined
  }, done ? successLabel : buttonLabel));
}
Object.assign(__ds_scope, { NewsletterSignup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/NewsletterSignup.jsx", error: String((e && e.message) || e) }); }

// components/bands/NewsletterBand.jsx
try { (() => {
function NewsletterBand({
  heading = 'Festival news and updates, in your inbox',
  sub = 'Once or twice a month. Save-the-dates, program news, and ways to help.',
  buttonLabel,
  onSubscribe,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "oy-newsletter oy-dark",
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: "oy-wrap oy-newsletter-inner"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 480
    }
  }, /*#__PURE__*/React.createElement("h2", null, heading), /*#__PURE__*/React.createElement("p", null, sub)), /*#__PURE__*/React.createElement(__ds_scope.NewsletterSignup, {
    buttonLabel: buttonLabel,
    onSubscribe: onSubscribe
  })));
}
Object.assign(__ds_scope, { NewsletterBand });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/bands/NewsletterBand.jsx", error: String((e && e.message) || e) }); }

// components/media/ImagePlaceholder.jsx
try { (() => {
function ImagePlaceholder({
  caption,
  tint = 'indigo',
  ratio,
  height,
  radius,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: 'oy-ph oy-ph--' + tint,
    role: "img",
    "aria-label": 'Placeholder for future photo: ' + caption,
    style: {
      aspectRatio: ratio,
      height,
      borderRadius: radius,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", null, "[ ", caption, " ]"));
}
Object.assign(__ds_scope, { ImagePlaceholder });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/media/ImagePlaceholder.jsx", error: String((e && e.message) || e) }); }

// components/cards/ProgramCard.jsx
try { (() => {
function ProgramCard({
  title,
  text,
  cta,
  href = '#',
  photo,
  tint = 'indigo',
  style
}) {
  return /*#__PURE__*/React.createElement("article", {
    className: "oy-card",
    style: style
  }, photo ? /*#__PURE__*/React.createElement(__ds_scope.ImagePlaceholder, {
    caption: photo,
    tint: tint,
    height: 170
  }) : null, /*#__PURE__*/React.createElement("div", {
    className: "oy-card-body"
  }, /*#__PURE__*/React.createElement("h3", null, title), /*#__PURE__*/React.createElement("p", null, text), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "quiet",
    arrow: true,
    href: href,
    style: {
      padding: '10px 0'
    }
  }, cta)));
}
Object.assign(__ds_scope, { ProgramCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/ProgramCard.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SiteFooter.jsx
try { (() => {
const takePart = [{
  label: 'Become a member',
  href: '#'
}, {
  label: 'Volunteer',
  href: '#'
}, {
  label: 'Vend at Ọjà Balógun',
  href: '#'
}, {
  label: 'Sponsor',
  href: '#'
}, {
  label: 'Donate',
  href: '#'
}];
const learnMore = [{
  label: 'Odun De Festival',
  href: '#'
}, {
  label: 'Our impact',
  href: '#'
}, {
  label: 'Board & history',
  href: '#'
}, {
  label: 'Contact',
  href: '#'
}];
function SiteFooter({
  ein = 'XX-XXXXXXX',
  email = 'info@omoyorubaofsocal.org',
  showNewsletter = true,
  fine,
  style
}) {
  return /*#__PURE__*/React.createElement("footer", {
    className: "oy-footer oy-dark",
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: "oy-wrap oy-footer-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Omo Yor\xF9b\xE1 of Southern California"), /*#__PURE__*/React.createElement("div", {
    className: "oy-footer-trust"
  }, "501(c)(3) nonprofit since 1997 \u2022 EIN ", ein, /*#__PURE__*/React.createElement("br", null), "Los Angeles, California \u2022 ", /*#__PURE__*/React.createElement("a", {
    href: 'mailto:' + email,
    style: {
      display: 'inline',
      margin: 0
    }
  }, email)), /*#__PURE__*/React.createElement("div", {
    className: "oy-socials"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    "aria-label": "Instagram"
  }, "IG"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    "aria-label": "Facebook"
  }, "FB"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    "aria-label": "LinkedIn"
  }, "LI"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    "aria-label": "YouTube"
  }, "YT")), showNewsletter ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 26,
      maxWidth: 420
    }
  }, /*#__PURE__*/React.createElement("h4", null, "Festival news and updates, in your inbox"), /*#__PURE__*/React.createElement(__ds_scope.NewsletterSignup, null)) : null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Take part"), takePart.map(l => /*#__PURE__*/React.createElement("a", {
    key: l.label,
    href: l.href
  }, l.label))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Learn more"), learnMore.map(l => /*#__PURE__*/React.createElement("a", {
    key: l.label,
    href: l.href
  }, l.label)))), /*#__PURE__*/React.createElement("div", {
    className: "oy-wrap oy-footer-fine"
  }, fine || 'Ẹ káàbọ̀ sí Ọjà Balógun, Àgbàlá Ọmọde àti Ẹgbẹ́ Ìbílẹ̀. Odún dé! Ẹ ṣeun.', " \"Many hands make the load light.\""));
}
Object.assign(__ds_scope, { SiteFooter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SiteFooter.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SiteNav.jsx
try { (() => {
const {
  useState
} = React;
const defaultLinks = [{
  label: 'Odun De Festival',
  href: '#odunde'
}, {
  label: 'Programs',
  href: '#programs'
}, {
  label: 'Get Involved',
  href: '#get-involved'
}, {
  label: 'Impact',
  href: '#impact'
}, {
  label: 'About',
  href: '#about'
}, {
  label: 'News & Events',
  href: '#news'
}];
function SiteNav({
  links = defaultLinks,
  active,
  donateHref = '#donate',
  style
}) {
  const [open, setOpen] = useState(false);
  return /*#__PURE__*/React.createElement("nav", {
    className: "oy-nav",
    style: style,
    "aria-label": "Main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "oy-wrap oy-nav-inner"
  }, /*#__PURE__*/React.createElement("a", {
    className: "oy-logo",
    href: "#top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "oy-logo-mark",
    "aria-hidden": "true"
  }, "OY"), "Omo Yor\xF9b\xE1\xA0", /*#__PURE__*/React.createElement("span", {
    className: "oy-logo-sub"
  }, "of SoCal")), /*#__PURE__*/React.createElement("div", {
    className: "oy-nav-links"
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l.label,
    href: l.href,
    "aria-current": active === l.label ? 'page' : undefined
  }, l.label))), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    href: donateHref,
    size: "sm",
    style: {
      flex: 'none'
    }
  }, "Donate"), /*#__PURE__*/React.createElement("button", {
    className: "oy-nav-burger",
    "aria-label": "Open menu",
    "aria-expanded": open,
    onClick: () => setOpen(true)
  }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null))), open ? /*#__PURE__*/React.createElement("div", {
    className: "oy-nav-menu oy-dark",
    role: "dialog",
    "aria-label": "Menu"
  }, /*#__PURE__*/React.createElement("button", {
    className: "oy-nav-close",
    "aria-label": "Close menu",
    onClick: () => setOpen(false)
  }, "\xD7"), links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l.label,
    href: l.href,
    onClick: () => setOpen(false)
  }, l.label)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    href: donateHref,
    onClick: () => setOpen(false)
  }, "Donate"))) : null);
}
Object.assign(__ds_scope, { SiteNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SiteNav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/GetInvolvedPage.jsx
try { (() => {
function GetInvolvedPage() {
  return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "Get Involved"
  }, /*#__PURE__*/React.createElement(__ds_scope.SiteNav, {
    active: "Get Involved"
  }), /*#__PURE__*/React.createElement("header", {
    className: "oy-section",
    style: {
      paddingBottom: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "oy-wrap"
  }, /*#__PURE__*/React.createElement(__ds_scope.Kicker, {
    yo: "\u1EB8 k\xE1\xE0b\u1ECD\u0300",
    en: "Welcome"
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--text-h2)',
      margin: '10px 0 8px'
    }
  }, "Get Involved"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 18,
      color: 'var(--text-muted)',
      maxWidth: 560
    }
  }, "Five ways in. Pick yours; each takes about two minutes."))), /*#__PURE__*/React.createElement("section", {
    style: {
      paddingBottom: 'var(--section-pad)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "oy-wrap",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.PathRow, {
    chip: "Member",
    title: "Join the community",
    text: "Dues, WhatsApp, votes, family.",
    cta: "Join us",
    primary: true
  }), /*#__PURE__*/React.createElement(__ds_scope.PathRow, {
    chip: "Volunteer",
    title: "Lend your hands",
    text: "Festival crews, language school, events, media.",
    cta: "Raise your hand"
  }), /*#__PURE__*/React.createElement(__ds_scope.PathRow, {
    chip: "Vendor",
    title: "Sell at our markets",
    text: "Sell at Odun De and YCC markets (\u1ECCj\xE0 Bal\xF3gun).",
    cta: "Apply for a booth"
  }), /*#__PURE__*/React.createElement(__ds_scope.PathRow, {
    chip: "Sponsor",
    title: "Back the culture",
    text: "Put your brand behind the culture. Tiers from $200.",
    cta: "See sponsor tiers"
  }), /*#__PURE__*/React.createElement(__ds_scope.PathRow, {
    chip: "Donor",
    title: "Give, fee-free",
    text: "Fee-free giving via Zeffy. One-time or monthly.",
    cta: "Donate",
    primary: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "oy-band oy-band--gala oy-dark oy-texture"
  }, /*#__PURE__*/React.createElement("div", {
    className: "oy-wrap oy-band-inner"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 560
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 24
    }
  }, "Already on WhatsApp? Stay close."), /*#__PURE__*/React.createElement("p", null, "The newsletter means you never miss a festival date or a grant win.")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary",
    href: "#"
  }, "WhatsApp"), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    href: "#"
  }, "Newsletter")))), /*#__PURE__*/React.createElement(__ds_scope.SiteFooter, null));
}
Object.assign(__ds_scope, { GetInvolvedPage });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/GetInvolvedPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Homepage.jsx
try { (() => {
function SecHead({
  kicker,
  title,
  link
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "oy-sec-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(__ds_scope.Kicker, null, kicker), /*#__PURE__*/React.createElement("h2", {
    style: {
      marginTop: 6
    }
  }, title)), link ? /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "quiet",
    arrow: true,
    href: "#",
    style: {
      marginLeft: 'auto'
    }
  }, link) : null);
}
function Homepage({
  season = 'gala'
}) {
  return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "Homepage"
  }, /*#__PURE__*/React.createElement(__ds_scope.SiteNav, null), /*#__PURE__*/React.createElement("header", {
    className: "oy-hero oy-dark"
  }, /*#__PURE__*/React.createElement("div", {
    className: "oy-wrap oy-hero-inner"
  }, /*#__PURE__*/React.createElement(__ds_scope.Kicker, {
    yo: "\u1EB8 k\xE1\xE0b\u1ECD\u0300",
    en: "Welcome"
  }), /*#__PURE__*/React.createElement("h1", null, "Celebrating and sustaining ", /*#__PURE__*/React.createElement("em", null, "Yoruba culture"), " in Southern California since 1997"), /*#__PURE__*/React.createElement("p", {
    className: "oy-hero-sub"
  }, "Language, festival, family. From the Yoruba Language School to the Odun De Festival at Leimert Park, we pass the culture to the next generation."), /*#__PURE__*/React.createElement("div", {
    className: "oy-hero-cta"
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    href: "#donate"
  }, "Donate"), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary",
    href: "#get-involved"
  }, "Get Involved")), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 44,
      fontSize: 12.5,
      color: 'var(--text-on-dark-faint)',
      letterSpacing: '.06em'
    }
  }, "[ Full-bleed background: 2026 crowd photo or 30-second recap loop, muted, poster frame ]"))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--white)',
      borderBottom: '1px solid var(--border-soft)'
    },
    id: "impact"
  }, /*#__PURE__*/React.createElement("div", {
    className: "oy-wrap oy-stat-strip"
  }, /*#__PURE__*/React.createElement(__ds_scope.StatBlock, {
    value: "29",
    label: "years serving Southern California"
  }), /*#__PURE__*/React.createElement(__ds_scope.StatBlock, {
    value: "3,000+",
    label: "Yoruba community members in SoCal"
  }), /*#__PURE__*/React.createElement(__ds_scope.StatBlock, {
    value: "5",
    label: "festival zones at Odun De 2026"
  }), /*#__PURE__*/React.createElement(__ds_scope.StatBlock, {
    value: "9",
    label: "hometown associations at the table"
  }))), /*#__PURE__*/React.createElement(__ds_scope.EventBand, {
    season: season
  }), /*#__PURE__*/React.createElement("section", {
    className: "oy-section",
    id: "programs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "oy-wrap"
  }, /*#__PURE__*/React.createElement(SecHead, {
    kicker: "What we do",
    title: "Our Programs",
    link: "All programs"
  }), /*#__PURE__*/React.createElement("div", {
    className: "oy-card-grid"
  }, /*#__PURE__*/React.createElement(__ds_scope.ProgramCard, {
    title: "Yoruba Language School",
    text: "Saturday classes in Los Angeles where kids and adults learn to speak, read, and carry the language forward.",
    cta: "Enroll a learner",
    photo: "Language School photo"
  }), /*#__PURE__*/React.createElement(__ds_scope.ProgramCard, {
    title: "Yoruba Cultural Collective",
    text: "Diaspora innovation with roots: the Solar Hub and Green Goods initiatives connect culture to sustainability.",
    cta: "Meet the Collective",
    photo: "Solar Hub / Green Goods photo",
    tint: "green"
  }), /*#__PURE__*/React.createElement(__ds_scope.ProgramCard, {
    title: "Kids & STEM",
    text: "\xC0gb\xE0l\xE1 \u1ECCm\u1ECDde and the STEM Hub give our children a memory of self-worth, from ayo boards to robotics.",
    cta: "See youth programs",
    photo: "Kids Zone / STEM photo",
    tint: "gold"
  })))), /*#__PURE__*/React.createElement("section", {
    className: "oy-section oy-section--alt",
    id: "news",
    style: {
      background: 'var(--paper)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "oy-wrap"
  }, /*#__PURE__*/React.createElement(SecHead, {
    kicker: "Stay close",
    title: "News & Events",
    link: "All news"
  }), /*#__PURE__*/React.createElement("div", {
    className: "oy-card-grid"
  }, /*#__PURE__*/React.createElement(__ds_scope.NewsCard, {
    date: "July 2026",
    title: "Odun De 2026: the recap",
    teaser: "Five zones, one village. Photos, video, and the numbers from our biggest festival yet at Leimert Park."
  }), /*#__PURE__*/React.createElement(__ds_scope.NewsCard, {
    date: "August 2026",
    title: "Language School fall term",
    teaser: "Registration opens for Saturday classes. New beginner track for parents learning alongside their kids."
  }), /*#__PURE__*/React.createElement(__ds_scope.NewsCard, {
    date: "November 2026",
    title: "End-of-Year Gala",
    teaser: "An evening of culture, community, and celebration. Tables and sponsorships available now."
  })))), /*#__PURE__*/React.createElement(__ds_scope.NewsletterBand, null), /*#__PURE__*/React.createElement(__ds_scope.SiteFooter, null));
}
Object.assign(__ds_scope, { Homepage });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Homepage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/OdundePage.jsx
try { (() => {
const zones = [{
  yo: 'Main Stage',
  en: 'Drumming, dance, masquerade'
}, {
  yo: 'Ọjà Balógun',
  en: 'The market: vendors and food'
}, {
  yo: 'Àgbàlá Ọmọde',
  en: 'The kids\u2019 zone'
}, {
  yo: 'Teacher\u2019s Tent',
  en: 'Language and history for all ages'
}, {
  yo: 'STEM Hub',
  en: 'With STEMnetics'
}];
function OdundePage() {
  return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "Odun De Festival"
  }, /*#__PURE__*/React.createElement(__ds_scope.SiteNav, {
    active: "Odun De Festival"
  }), /*#__PURE__*/React.createElement("header", {
    className: "oy-hero oy-dark oy-texture",
    style: {
      '--hero-texture-opacity': '.10'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "oy-wrap oy-hero-inner"
  }, /*#__PURE__*/React.createElement(__ds_scope.Kicker, {
    yo: "Od\xFAn d\xE9",
    en: "The new year has arrived"
  }), /*#__PURE__*/React.createElement("h1", null, "Odun De Festival"), /*#__PURE__*/React.createElement("p", {
    className: "oy-hero-sub"
  }, "The Yoruba New Year at Leimert Park \u2022 Next: June 2027"), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 480,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.NewsletterSignup, {
    buttonLabel: "Be first to hear"
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 16,
      fontSize: 13,
      color: 'var(--text-on-dark-faint)'
    }
  }, "RSVP opens on Eventbrite closer to the date."))), /*#__PURE__*/React.createElement("section", {
    className: "oy-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "oy-wrap",
    style: {
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr',
      gap: 44,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(__ds_scope.Kicker, null, "What is Odun De"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '10px 0 14px'
    }
  }, "A new year, ten millennia deep"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginBottom: 12
    }
  }, "Odun De marks the Yoruba New Year, Year 10,068 and counting of Yoruba timekeeping. It stands in the lineage of the Oshun Festival and Philadelphia's Odunde, celebrated since 1975."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginBottom: 22
    }
  }, "Our own arc runs from fifteen years at Citrus College to Leimert Park, the cultural heartbeat of Black Los Angeles."), /*#__PURE__*/React.createElement(__ds_scope.PullQuote, {
    quote: "Communities pause the world to celebrate who they are. Odun De gives our kids a memory of self-worth deeper than what they see on TV."
  })), /*#__PURE__*/React.createElement(__ds_scope.ImagePlaceholder, {
    caption: "elder teaching at the Teacher's Tent",
    tint: "adire",
    ratio: "4/5",
    radius: 14
  }))), /*#__PURE__*/React.createElement(__ds_scope.Divider, {
    variant: "asoke-thin"
  }), /*#__PURE__*/React.createElement("section", {
    className: "oy-section",
    style: {
      background: 'var(--paper)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "oy-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "oy-sec-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(__ds_scope.Kicker, null, "The village"), /*#__PURE__*/React.createElement("h2", {
    style: {
      marginTop: 6
    }
  }, "Five zones, one village"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
      gap: 16
    }
  }, zones.map(z => /*#__PURE__*/React.createElement("div", {
    className: "oy-card",
    key: z.yo
  }, /*#__PURE__*/React.createElement("div", {
    className: "oy-card-body"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 19
    }
  }, z.yo), /*#__PURE__*/React.createElement("p", null, z.en))))))), /*#__PURE__*/React.createElement("section", {
    className: "oy-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "oy-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "oy-sec-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(__ds_scope.Kicker, null, "Odun De 2026"), /*#__PURE__*/React.createElement("h2", {
    style: {
      marginTop: 6
    }
  }, "The recap"))), /*#__PURE__*/React.createElement(__ds_scope.ImagePlaceholder, {
    caption: "recap video embed, 30 seconds, muted, poster frame",
    ratio: "16/7",
    radius: 14
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 14,
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.ImagePlaceholder, {
    caption: "2026 crowd at Leimert Park, wide",
    ratio: "4/3",
    radius: 10
  }), /*#__PURE__*/React.createElement(__ds_scope.ImagePlaceholder, {
    caption: "drummers on Main Stage",
    tint: "terra",
    ratio: "4/3",
    radius: 10
  }), /*#__PURE__*/React.createElement(__ds_scope.ImagePlaceholder, {
    caption: "kids at \xC0gb\xE0l\xE1 \u1ECCm\u1ECDde",
    tint: "gold",
    ratio: "4/3",
    radius: 10
  }), /*#__PURE__*/React.createElement(__ds_scope.ImagePlaceholder, {
    caption: "\u1ECCj\xE0 Bal\xF3gun market stalls",
    tint: "adire",
    ratio: "4/3",
    radius: 10
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 18,
      fontWeight: 600,
      color: 'var(--indigo-700)'
    }
  }, "5 zones \u2022 9 hometown associations \u2022 [attendance] guests \u2022 [n] vendors"))), /*#__PURE__*/React.createElement("section", {
    className: "oy-section oy-dark oy-texture",
    style: {
      background: 'var(--indigo-900)'
    },
    id: "take-part"
  }, /*#__PURE__*/React.createElement("div", {
    className: "oy-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "oy-sec-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(__ds_scope.Kicker, null, "Od\xFAn d\xE9 2027"), /*#__PURE__*/React.createElement("h2", {
    style: {
      marginTop: 6
    }
  }, "Take part in 2027"))), /*#__PURE__*/React.createElement("div", {
    className: "oy-card-grid"
  }, /*#__PURE__*/React.createElement(__ds_scope.DoorCard, {
    title: "Vendors",
    text: "Sell in \u1ECCj\xE0 Bal\xF3gun. Booth info, fees, dates.",
    cta: "Apply now",
    primary: true,
    style: {
      background: 'var(--white)'
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.DoorCard, {
    title: "Sponsors",
    text: "Gold $2,000+ \u2022 Silver $1,000+ \u2022 Bronze $200+ \u2022 deck download.",
    cta: "Get the deck",
    style: {
      background: 'var(--white)'
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.DoorCard, {
    title: "Volunteers",
    text: "Many hands make the load light.",
    cta: "Raise your hand",
    style: {
      background: 'var(--white)'
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "oy-band oy-band--gala oy-dark",
    style: {
      background: 'var(--indigo-700)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "oy-wrap oy-band-inner"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 22
    }
  }, "Sponsorship conversations"), /*#__PURE__*/React.createElement("p", null, "sponsors@omoyorubaofsocal.org \u2022 book a call. Every form feeds the email list and a tracked pipeline.")), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    href: "#",
    variant: "secondary",
    arrow: true,
    style: {
      marginLeft: 'auto'
    }
  }, "Book a call"))), /*#__PURE__*/React.createElement(__ds_scope.SiteFooter, null));
}
Object.assign(__ds_scope, { OdundePage });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/OdundePage.jsx", error: String((e && e.message) || e) }); }

__ds_ns.EventBand = __ds_scope.EventBand;

__ds_ns.NewsletterBand = __ds_scope.NewsletterBand;

__ds_ns.DoorCard = __ds_scope.DoorCard;

__ds_ns.NewsCard = __ds_scope.NewsCard;

__ds_ns.PathRow = __ds_scope.PathRow;

__ds_ns.ProgramCard = __ds_scope.ProgramCard;

__ds_ns.StatBlock = __ds_scope.StatBlock;

__ds_ns.PartnerRow = __ds_scope.PartnerRow;

__ds_ns.PullQuote = __ds_scope.PullQuote;

__ds_ns.Timeline = __ds_scope.Timeline;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Divider = __ds_scope.Divider;

__ds_ns.Kicker = __ds_scope.Kicker;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.NewsletterSignup = __ds_scope.NewsletterSignup;

__ds_ns.ImagePlaceholder = __ds_scope.ImagePlaceholder;

__ds_ns.SiteFooter = __ds_scope.SiteFooter;

__ds_ns.SiteNav = __ds_scope.SiteNav;

__ds_ns.GetInvolvedPage = __ds_scope.GetInvolvedPage;

__ds_ns.Homepage = __ds_scope.Homepage;

__ds_ns.OdundePage = __ds_scope.OdundePage;

})();
