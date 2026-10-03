# Fit Monk Hero Video Asset Architecture

## Master Video (Local Machine Only)
- **File**: `fit-monk-hero-40s-4k.mp4` (~100 MB, 4K master)
- **Status**: Kept locally on the development machine.
- **Git & Deployment**: Excluded via `.gitignore`. Must **never** be committed to GitHub or deployed to Cloudflare Pages (Cloudflare Pages has a 25 MB single-asset limit).

## Production Web Asset Status
- **Web Video**: `fit-monk-hero-web.mp4` (~13.6 MB, 1080p, H.264, 24 fps, no audio, faststart enabled)
  - Compliant with Cloudflare Pages single-asset limit (< 25 MB).
  - Tracked in Git for direct deployment.
- **Poster Image**: `fit-monk-hero-poster.webp` (~123 KB, 1920x1080)
  - Extracted still frame for instantaneous rendering before video load.

## Active Implementation
`src/pages/index.astro` references `fit-monk-hero-web.mp4` with `fit-monk-hero-poster.webp` as the poster attribute, maintaining muted autoplay, loop, playsinline, and background color/gradient fallbacks.

