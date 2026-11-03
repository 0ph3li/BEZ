# BEZ — everything comes without

**BEZ** is a concept website for a vegan kitchen in Žižkov, Prague, that doesn't exist.
*Bez* is Czech for **without**, and every dish is named after what it doesn't have: poke without tuna, guláš without beef, svíčková without the cow.

The menu is never the same. It's written on Monday, while the doors are shut, served Tuesday to Sunday, and then it's gone.

> Come hungry. Leave without.

Concept, design & code by **ghostly.grl** ♥ · case study 23 of martina.exe · 🎬 reel: [`reel/bez-reel.mp4`](reel/bez-reel.mp4)

---

## The idea

Most vegan restaurants apologise for what's missing. BEZ makes the missing part the whole brand:

- **Every dish is named by its absence.** *Svíčková [without the cow]*, *Smažák [without cheese]*, *Poke [without tuna]*.
- **The site crosses things out.** The loader strikes through *meat, milk, eggs, fish, guilt* while a counter runs to `100% plants`, then *Bez.* rises.
- **You can leave things out too.** Filter the menu by what *you* don't want, drag a stripe to swap beef for king oyster, vote for a past week to come back.
- **It changes every week.** Week numbers, dates and "new menu in N days" are computed live on Prague time.

### Art direction: collage editorial × two-colour posters

Every screen is one magazine spread or one poster, printed in **two inks**, and each one is rebuilt from a single reference in the `VIBES/` moodboard (30 food posters). No two screens share a layout.

| ink pair | where |
|---|---|
| tomato `#e8432a` / mint `#cdeee0` | hero, loader, footer |
| navy `#2e2b6e` / sky `#a9dce6` | the PLANTS ONLY diamond, typed note cards |
| orange `#ef5a1e` / butter `#f4ea9c` | nôm poster |
| red `#b5321f` / cream `#f3e6d0` | NO TUNA |
| blue `#1f2d6e` / yolk `#f6a81c` | guláš |
| leaf `#17652f` / pink `#f37fe7` | budbites, the dumpling poster |
| blood `#a10d0d` / blush `#f8e6da` | ŽIŽKOV |

**Type**:
- [Fraunces](https://fonts.google.com/specimen/Fraunces) (SOFT 100, WONK 1, weight 900): the soft, wonky serif.
- [Archivo](https://fonts.google.com/specimen/Archivo), variable: from width 62 for condensed posters to width 125 for wide labels.
- [DM Mono](https://fonts.google.com/specimen/DM+Mono): typed notes and receipts.
- [Pinyon Script](https://fonts.google.com/specimen/Pinyon+Script): the signature.

---

## Pages

### `index.html` · home
| screen | ref | what happens |
|---|---|---|
| **Lazy nights** | LAZY NIGHTS spread | a vertical *Bez.* fitted to the full height of the panel, a small *without*, a PLANTS ONLY diamond, a full-bleed photo and a typed sky-blue card. The layers drift apart on scroll. |
| **nôm** | nôm, poster on a wall | a poster pasted on a dark wall: NO MEAT / NO MILK / NO EGGS tags, a giant *žižkov* sliding behind a photo window, a huge *bez*, and a dumpling on a taped side poster. |
| **NO / TU / NA.** | SYDORENKO | pinned: the poke plate rolls in, NO TU NA slams down, the ingredients rise, and a typed slip admits it's watermelon, smoked for six hours. |
| **guláš** | chow mein poster | *guláš / no beef* runs vertically, cropped by the page. A duotone halftone plate turns, the bowl rolls in, and a justified recipe in tiny caps reads *beef: 0 g*. |
| **without** | budbites | *without* in every language as stacked marquees behind a sticky soup bowl. |
| **anatomy** | ONION / MAYO / BACON grid | four macro tiles open one by one. BACON gets crossed out and becomes RICE PAPER. |
| **ŽIŽ / KOV** | NYC NYC® | the letters bounce down and a hand rises with a taco (*tacos without carne, tuesdays only*). |

### `menu.html` · this week's menu
| screen | ref | what happens |
|---|---|---|
| **The menu** | MISO LAB | a red block on black with an oval photo. *bez masa* sits upside down; hover or tap and it flips to *without meat*. Shows the live week number and dates. |
| **Pick what to leave out** | BÁNH BAO menu cards | nine dishes as printed cards in four two-colour skins. They're dealt in, tilt and catch a gloss under the cursor. The gluten / nuts / soy / spicy chips fade out the dishes that contain them, and the choice is remembered. |
| **Smoked chilli tofu** | MILD CHILLI TOFU packaging | the dish as a product: TOFU rows sliding behind the bowl, a NO MEAT blob, a "certified B" mark, a scannable barcode, and a **without facts** table that counts meat, milk, eggs and regret down to 0. |
| **Shoyu, bez kostí** | ZUKAE | ramen "without bones" on a dark photo, with a wavy title that keeps moving like steam (an animated SVG turbulence filter). |
| **No-crab curry club** | CRAB CURRY CLUB | Thursday nights: an inline-striped title with a fat italic *Curry* slapped across. |
| **Sweet sesame seitan noodles** | SWEET SESAME STEAK RAMEN | a breathing pink blob title, popping tick marks, and noodles twirled up on a fork. |

### `weeks.html` · every week
| screen | ref | what happens |
|---|---|---|
| **Week 44** | ramu NOODLES site | a framed page on blue opens like a browser window: the live ISO week number, *this week's nine*, the Tuesday–Sunday dates and a countdown to the next menu. |
| **Last weeks.™** | Plately | a carousel with one plate per past week (arrows, side plates or dots), and three cards with that week's dishes. **Bring it back** stores your vote. |
| **Sweet week** | Sugar Rush poster | next week's preview: wonky red type, pastries with a thick blue cut line, next week's dates on a badge, and *All your worries pause here.* |
| **The drop** | BITE ME site | a giant THE DROP over a photo, hours and address around a cutout, and a sign-up for the Monday-night menu email (a concept, so nothing is sent). |

### `taken-out.html` · taken out, put back
| screen | ref | what happens |
|---|---|---|
| **Taken out** | BASICS | giant yellow type behind a portrait, *Žižkov style* on the side, and a red PUT BACK label that slaps on with a wobble. |
| **The swaps** | three stacked macro textures | six full-width stripes: beef → king oyster, tuna → watermelon, cream → oat, eggs → chickpea water, cheese → cashew, bacon → rice paper. **Drag or hover across a stripe** to put the replacement back. The old word gets struck out and the new one appears with how it's made. |
| **Put back** | BIBIMBAP poster | four colour blocks slide in from four sides, and a full bowl spins up as you scroll. |
| **Never missed** | NEW ORLEANS "best bowls" cover | a magazine cover with the Žižkov masthead and four bowls in circles. *Never / missed* rides two SVG curves, with the offset tied to the scroll. |
| **Bez-time** | MIE-TIME | two stacked photos with white captions, and two guest quotes. |

### `kitchen.html` · the kitchen
| screen | ref | what happens |
|---|---|---|
| **The kitchen** | FOOD & RESTAURANT | dark red, with a cook pulling a rope of noodle dough across a ghost-red KITCHEN. The footer line says whether the stove is on right now in Prague. |
| **Made here** | THE TWIRL HOUSE | an exploded bowl grows on scroll, ringed by orange pills (*12-hour broth*, *hand-pulled*, *not-meatballs*…). Click a pill to find out how each part is made. |
| **By hand, daily** | green dumpling poster | giant pink type, a dumpling swinging in chopsticks, falling crumbs, and a counter of dumplings folded today (09:00–15:00, 600 a day). Click the dumpling to fold one more. |
| **A day** | banner design sheet | four loud banners: 07:00 dough, 10:00 broth, 12:00 doors open, 23:00 last guláš. The one happening right now in Prague gets a frame. |
| **The crew** | designer card sheet | four mini-poster cards that tilt in 3D. Click one to flip it and see what that cook works without. |
| **Book a table** | mango product cards | two rounded product cards: a table (people + time, remembered) and *Bez to go* (− / + bowls). |

---

## Details worth finding

- **Custom cursor**: a little pea with contextual labels (*flip it*, *drag*, *grab a taco*, *pleat it*…), plus magnetic buttons.
- **Live Prague clock**: these all run on `Europe/Prague` time:
  - opening hours and "kitchen: open / closed"
  - the banner happening right now
  - today's dumpling count
  - the week number
- **Tab title**: switch tabs and it reads *come back. nothing is missing. except you.*
- **Konami code** (↑ ↑ ↓ ↓ ← → ← → B A): the whole site *without photos*.
- **Typed words**: type `meat`, `cheese`, `bacon`, `milk`, `with`, `meow` or `ghostly` anywhere.
- **Console**: open devtools for the cat, then run `bez.help()`. `bez.missing()` lists any empty photo slot.
- **Reduced motion**: with `prefers-reduced-motion` on, every animation is skipped and the pages render in their final state.
- **Image slots**: until a photo is there, its slot shows a soft frame in the photo's tone, labelled with the filename and what to shoot. See [`img/README.md`](img/README.md).

---

## Built with

- Plain **HTML / CSS / JavaScript**: no framework, no build step.
- [**GSAP 3.12.5**](https://gsap.com) + **ScrollTrigger** for every entrance, pin and scrub.
- [**Lenis 1.1.13**](https://lenis.darkroom.engineering) for smooth scrolling.
- CSS container queries, vertical `writing-mode` type, SVG `textPath` and `feTurbulence`, and `clip-path` wipes.
- `localStorage` (prefix `bz-`) for the leave-out filter, the votes, the held table and the drop.

### Structure

```
BEZ/
├── index.html · menu.html · weeks.html · taken-out.html · kitchen.html
├── css/
│   ├── style.css        shared: tokens, type, header, loader, cursor, slots, footer
│   └── <page>.css       one per page
├── js/
│   ├── main.js          shared engine (window.BZ): loader, cursor, slots, fit, Prague clock, weeks, easter eggs
│   └── <page>.js        one per page
├── img/                 HOME · MENU · WEEKS · TAKEN · KITCHEN (+ _orig backups) · README.md
├── reel/bez-reel.mp4    the case-study reel (1080×1920, 30 fps)
├── VIBES/               the 30-poster moodboard every screen is built from
└── favicon.svg
```

### Run it locally

Any static server works:

```bash
python3 -m http.server 5640
```

Then open http://localhost:5640.

---

BEZ is a concept: the restaurant, the crew, the reviews and the address are made up. Photos are placeholders for a portfolio piece, and the moodboard refs in `VIBES/` belong to their authors.

<sub>concept, design & code by ghostly.grl ♥ · 2026</sub>
