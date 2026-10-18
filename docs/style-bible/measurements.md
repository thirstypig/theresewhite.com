# Raw measurements behind the style bible

`index.html` in this folder is the readable guide. This file keeps the raw
values a builder needs and the guide leaves out. The full computed styles for
each page are in `data/<page>-<desktop|mobile>.json`. Hover, pinned-header and
phone-menu behavior is in `data/interactions.json`, and card borders and
shadows are in `data/boxes.json`.

Measured on 2026-10-16 in headless Chromium (Playwright 1.58.2), at 1,440
pixels wide on desktop and 390 pixels wide on a phone. On phones the live site
declares a fixed 320-pixel layout, so phone values are in 320-pixel units and
appear 1.22 times larger on a 390-pixel screen.

## Wix theme variables (mostly overridden on the live pages)

These are the old teal-and-sand theme. They match the rebuild's main palette
exactly, but most visible elements on the live site do not use them.

- Named roles: text-primary #414141, title #414141, action #D8C7BD,
  bg-primary #FFFFFF, bg-secondary #E8E6E6, accent-1 #D8C7BD,
  accent-2 #22495A, accent-3 #F4EFEB, accent-4 #486573, line #999997.
- The theme's own button style (sand fill, white text) is not used by any
  visible button.
- Font variables: font_0 60px Caudex; font_1 16px din-next-w01-light;
  font_2 italic 50px Caudex; font_3 40px Caudex; font_4 30px Caudex;
  font_5 italic 26px Caudex; font_6 30px Forum; font_7 21px Caudex;
  font_8 18px Forum; font_9 16px Forum; font_10 12px din-next-w01-light.
  All use 1.4em line height.

Colors that are present in the computed styles but never visible, so they
should not be copied: #FE6161 (a 0px button border), #999997 at zero opacity
(FAQ dividers), and #FFDE5F at zero opacity (nav background).

## Image originals

All of these are under `https://static.wixstatic.com/media/`. Remove any
`/v1/...` suffix from a Wix address to get the original file.

| Use | File |
|---|---|
| Logo (2854 × 1242) | `1d1667_22e61df08fe64f6399a3ccf6f27b95c1~mv2.png` |
| Homepage portrait | `1d1667_190762470e274a2eabea3f712c1b4546~mv2.png` |
| Homepage video still | `807fad_c2b06430b28e4d7c97942b0f5f8b2ccaf000.jpg` |
| About photos | `2b690a_1323155b0b764979b645c7de94547ac5~mv2.jpeg`, `a3c153_3592f141741849e8b2cb99afa8e3a412~mv2.jpg`, `2b690a_26f045e4494f4093b37276d89c949868~mv2.jpg` |
| Endorsement photos | `1d1667_8ccb946cfa004d3ab222412815071a70~mv2.webp`, `1d1667_877c6375db7a4f5393ed879b88ee8062~mv2.png`, `1d1667_9443ad5a28ca4b16b43c760dc2015270~mv2.webp`, `1d1667_7d4862d20c2b4e6b803846e521551480~mv2.png` |
| Case-study video stills | `1d1667_0972b7e540fe46988459803729d30c1cf000.jpg`, `2b690a_f1740dd533dd43a28dd24b6a1907160af000.jpg` |
| Contact chalkboard | `1d1667_4132d7cd5ad94a26aabeccc7872c2636~mv2.png` |
| Blog author photo | `2b690a_b609aa27f2114a8cbab0ae81c376a7b6~mv2.png` |
| About gradient | `24a6a1da9e7704f98ed32ece62057c60.png` ("Center Gradient Transparent") |
| Panel Memberships gradient | `11062b_8480e50c…_s_4_2.png` ("Blue Gradient"; the full name is in `data/home-desktop.json`) |

The panel logos and icons have their full addresses in `data/home-desktop.json`.

On Wix, the logo is cropped to fill a 242 × 94 box, which is a 2.57 ratio.
The original file is 2.30. The rebuild already uses the original's ratio.

## Header geometry (desktop)

- Header: 85px tall, background #E8E6E6, 1px #D8C7BD line along the bottom,
  `position: sticky; top: 0`.
- Logo: drawn at 242 × 94, positioned at x103, y11. Its outer link box is
  248 × 100. Frame: 3px #1D2CF3, 6px radius, shadow `0 0 3px rgba(0,0,0,.5)`,
  plus a soft drop shadow beneath.
- The menu group is 849 × 45 at x354, outlined by a 1px dashed #D8C7BD line
  with a 100px radius.
- Menu items are 43px tall with widths 176, 173, 162, 87, 89 and 119. The
  color change on hover takes 0.08 seconds.

## Phone header and menu

- Header: 124px tall. Logo: 173 × 70 at x34. Menu icon: a 73 × 70 box at
  x219, three 22 × 2 bars in #414141, labeled "Open navigation menu".
- When open: a full-screen #F4EFEB overlay with a close "X" at the top right.
  Items are centered, Arial 21px #22495A, in 65px rows. The current item is
  #D8C7BD on a faint lighter band.

## Measured band spacing (distance from band edge to content, top / bottom)

Wix places every element at a fixed position, so these are measured
distances, not settings.

| Band | Top / bottom | Band height |
|---|---|---|
| Home hero | 0 / 28 | 925 |
| Where I Work | 41 / 49 | 210 |
| Calculator band | 58 / 107 | 412 |
| Video band | 41 / 49 | 1035 |
| Panel Memberships | 30 / 69 | 785 |
| 3 Reasons | 42 / 68 | 841 |
| Blueprint | 42 / 65 | 593 |
| Call-to-action bands | 11–48 / 23–36 | 151–200 |
| Case Studies hero | 36 / 32 | 235 |
| Endorsements hero | 47 / 60 | 304 |
| FAQ | 43 / 106 | n/a |
| Legal pages | 54–56 top | n/a |

## Card and frame details

- "3 Reasons" cards: white, 1px #0C4426 border, square corners, shadow
  `-0.52px 9.99px 50px -26px #22495A`, 325 × 590.
- Logo tiles and case panels use Wix's framed style: 2px radius, shadow
  `0 2px 5px rgba(0,0,0,.53)`, plus a white inner glow.
- Endorsements intro box: white, 10px radius, 862 × 215.
- Stat pills: #3D9BE9 rounded shapes, about 206 × 72 and 214 × 72
  (estimated from a screenshot).

## Pages in the Wix sitemap that are not in the menu

None of these were measured: /copy-of-newsletter, /frommeltdowntoresolution,
/case-study-extension, /tripletaketuesdays12092025, /finding-came-back,
/tripletaketuesdays09022025, /tripletaketuesdays09092025,
/tripletaketuesdays09162025, /cost-of-concflict-calculator (misspelled on Wix),
/challenges, /general-8, /newsletterontheway, /tripletaketuesdays12162025,
/newsletterarchive, /book-online, /the-medical-leave,
/tripletaketuesday12022025.
