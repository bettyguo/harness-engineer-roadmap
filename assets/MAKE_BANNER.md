# Make the banner / social card

The launch screenshot is the **diagram itself**, captured from the live site at 1920×1080 in dark mode (see Phase 5 checklist). This file specifies the **social-card banner** that appears on GitHub OG previews, Twitter cards, and link unfurls — a separate, smaller, designed image.

## Output

- `assets/banner.png` — 1280×640 PNG (GitHub OG card dimensions).
- `assets/og-image.png` — copy of the same file (referenced by `<meta property="og:image">` in `site/index.html`).

## Visual spec

- **Aspect:** 2:1 (1280×640).
- **Background:** near-black, `#0a0a0f`, with a subtle 24px-spaced dot grid in `#1a1a22`.
- **Headline (left half, vertically centered):**
  - "**Harness Engineering Roadmap**" — Inter Display 700, ~72px, white `#f5f5f7`.
  - Subline: "The depth map for building reliable systems around LLMs." — Inter 400, ~28px, `#a0a0a8`.
  - Below subline: "bettyguo / harness-engineer-roadmap" — JetBrains Mono 500, ~22px, electric-mint accent `#5EEAD4`.
- **Right half:** a small, abstracted version of the node graph — five clusters (foundations, loop, tools, context, patterns) shown as labeled rectangles with edges between them. Same palette as the live site (violet, teal, amber, rose, cyan).
- **Bottom-right corner:** small "**CC-BY 4.0**" tag in `#404048`, 14px.

## How to produce it

1. **Easiest:** in Figma or Sketch, set up an artboard at 1280×640 and paint it by hand using the palette and typography from `site/src/styles/theme.css`. Export as PNG.
2. **From the live site:** open the site, take a 1280×640 screenshot of the upper-left area (where the title and a few clusters are visible), crop, lightly retouch for legibility. Acceptable but less polished.
3. **From a generator:** the spec is precise enough that an image-gen tool with typography support (or a designer with 30 minutes) can hit it from the description.

## What this is NOT

This is the **social card**, not the diagram screenshot. The diagram screenshot lives at `assets/diagram-screenshot.png` (1920×1080, captured from the live site, dark mode, slight zoom-out so 3–4 area clusters are visible with edges). That image is the one in the README and the launch X-thread. See Phase 5 checklist.

## Update cadence

Re-shoot when the taxonomy changes by more than ~5 nodes, when the aesthetic is tuned, or when the year rolls over.
