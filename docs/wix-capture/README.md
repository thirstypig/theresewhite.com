# Wix capture, 2026-10-18

The rendered text, images, links and text styles of every page on
www.theresewhite.com, captured in Chrome at 1,440 pixels wide on 2026-10-18.
This is the source for the near-exact copy of the site built in
`src/app/(site)/`. One JSON file per page, named after its Wix address.

Each file holds:

- `text`: the page's visible text, top to bottom, as a visitor reads it.
- `blocks`: each heading, paragraph and list item with its position and the
  font, size, color and weight reported for it. The reported font is
  sometimes the Wix theme default rather than the visible one; the style
  bible's Type chapter (`docs/style-bible/index.html`) is the reliable source
  for fonts.
- `imgs`: each image with its original Wix file address (the part before
  `/v1/`, which is the full-size original), its drawn size and position.
- `links`: every link and where it goes.

`faq.json` holds the twelve FAQ answers, which are collapsed on the live page
and had to be opened one at a time to read.

Full-page screenshots were taken at the same time and are not committed; the
style bible's `public/stylebible/img/` has the main ones.
