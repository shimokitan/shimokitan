# signal. Subdomain — UI/UX Planning Doc

## Overview

`signal.` is a user-facing subdomain built to surface collective user feedback as clear, actionable issues. It lives within the main brand ecosystem but serves a fundamentally different purpose — prioritizing **clarity and urgency** over aesthetic immersion.

---

## Problem Statement

The main site carries a heavy dark theme with street-style branding — identity-forward and visually intense. `signal.` needs to communicate demanding issues from aggregated user feedback, which requires a clean, scannable, and trustworthy interface.

The risk: users moving between the two feel like they've left the product entirely.  
The goal: **same DNA, different mode.**

---

## Design Direction

### Guiding Principle
> "Same brand, different gear."

`signal.` should feel like the calm, operational counterpart to the main site's energy — not a foreign product.

### Mood
- Light or neutral background (can support a dark mode toggle)
- High contrast text for readability
- Minimal decoration — let the content lead
- Urgency communicated through typography and status indicators, not visual noise

---

## Brand Continuity Anchors

These elements must carry over from the main site to maintain cohesion:

| Element | Main Site | signal. |
|---|---|---|
| Logo | Full branded logo | Same logo, smaller lockup |
| Primary accent color | Brand color (e.g. street/neon tone) | Used sparingly — CTAs, status badges |
| Typography | Display / editorial typeface | Same family, functional weight |
| Tone of voice | Bold, identity-driven | Direct, clear — still *same brand* |
| Navigation | Full nav | Minimal — back link to main site |

---

## Layout Planning

### Key Pages / Views

#### 1. Signal Feed (Homepage)
- List of active issues sorted by severity or recency
- Each item shows: **title**, **affected users count**, **status badge**, **date**
- Filters: category, severity, status (open / in progress / resolved)
- No hero sections, no heavy imagery — straight to the list

#### 2. Signal Detail Page
- Full issue description
- Collective feedback summary (aggregated, not individual)
- Status timeline (reported → acknowledged → resolved)
- Optional: link back to relevant resource or update

#### 3. Status / Resolution Banner
- Sticky top bar for critical/live issues
- Uses accent color from main brand for visual tie-in

---

## UI Components

### Status Badges
```
● Critical    → red
● High        → orange
● Monitoring  → yellow
● Resolved    → green
```

### Typography Scale
- **Heading:** Bold, brand typeface — commanding but not decorative
- **Body:** Clean, readable — system font or brand sans-serif
- **Meta / Labels:** Uppercase, small, muted

### Spacing
- Generous whitespace between items
- Card or row layout for issue list
- Avoid dense tables — keep it scannable at a glance

---

## Navigation

```
[Brand Logo]                          [Back to main site ↗]

signal.  |  Open (12)  Resolved (40)  All
```

- No heavy nav bar — single line header
- "Back to [brand]" link in top right keeps ecosystem feeling connected
- Breadcrumb or tab system for filtering issue states

---

## Dark Mode Consideration

Since the main site defaults to dark, `signal.` should ideally support a **dark mode** that echoes the main site's palette — but defaults to light for readability of dense information.

```
Light (default) → clean, readable, operational
Dark (optional) → closer to main site, same accent colors
```

---

## What to Avoid

- ❌ Copy-pasting the main site's heavy textures or street graphics
- ❌ Making it so minimal it loses brand identity entirely
- ❌ No back-navigation to the main site (orphaned feel)
- ❌ Overloading with color — reserve accent color for urgency signals only

---

## Implementation Notes

- Consider a **shared design token file** (colors, fonts, spacing) used by both the main site and `signal.` — this enforces brand consistency at the code level
- If using a component library, create a `signal` theme variant rather than a separate system
- Keep `signal.` statically renderable where possible for fast load — users arriving here are often dealing with an issue already

---

## Next Steps

- [ ] Confirm brand color tokens to carry over
- [ ] Define issue categories and severity levels
- [ ] Wireframe signal feed and detail page
- [ ] Validate typeface legibility at small sizes for meta/label use
- [ ] Decide on dark mode — toggle or system-preference only
- [ ] Build shared design token layer between main site and `signal.`
