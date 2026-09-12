# 04: SiteFooter with the newsletter, the trust line and the socials

Labels: design
Status: open
Blocked by: 02

**What to build:** `SiteFooter` in `@oy/ui/navigation`: the indigo-700 band with the drifting
àdìrẹ dot field, the light lockup, the trust line reading "501(c)(3) nonprofit since 1997 • EIN
XX-XXXXXXX • Los Angeles, CA" until `siteSettings.ein` is filled, the mailing address and the
general email (Pending chips while empty), the social marks for whichever networks the settings
list (Pending when none), the two link columns from the prototype (Take part, Learn more, with
Contact opening the contact enquiry), the newsletter block with the title and blurb from the
settings and `NewsletterForm` inside, and the motif rule at the bottom.

- [ ] Stories: Default with empty settings (every Pending chip visible), Filled with the confirmed facts only, each newsletter state
- [ ] Vitest: the EIN placeholder appears while `ein` is empty and the real value when set, the social list renders one link per network with an accessible name, the Contact link is the contact trigger
- [ ] The footer renders once, last in the layout, and no page adds its own newsletter band
- [ ] The component map records that the prototype's SVG marks and two columns won over the routes table's initials and four columns
