# Fit Monk Hero Video Asset Architecture

## Master Video (Local Machine Only)
- **File**: `fit-monk-hero-40s-4k.mp4` (~100 MB, 4K master)
- **Status**: Kept locally on the development machine.
- **Git & Deployment**: Excluded via `.gitignore`. Must **never** be committed to GitHub or deployed to Cloudflare Pages (Cloudflare Pages has a 25 MB single-asset limit).

## Production Web Asset Pipeline (Planned)
For production deployment, the hero video will be replaced by optimized web-ready assets or hosted via a streaming CDN:

1. **Web-Optimized Video Formats** (Target size: < 10 MB):
   - `fit-monk-hero.webm` (VP9 / AV1, 1080p, 24-30 fps, bitrate ~1.5–2 Mbps, no audio track)
   - `fit-monk-hero.mp4` (H.264 High Profile, 1080p, 24-30 fps, bitrate ~2 Mbps, muted)
   - `fit-monk-hero-mobile.mp4` (H.264, 720p, bitrate ~1 Mbps, for mobile screens)

2. **Poster Image / Fallback**:
   - `fit-monk-hero-poster.webp` (high-quality compressed poster frame loaded before video plays)

3. **Alternative Production Delivery**:
   - Cloudflare Stream or Cloudflare R2 + CDN delivery URL to offload large media bandwidth from static hosting.

## Current Temporary Implementation
`src/pages/index.astro` maintains the hero video container and `<source>` reference for local preview, while `.home-hero` and `.hero-overlay` retain solid brand fallbacks (`#1a1410` + gradient) ensuring visually robust presentation when video assets are not served.
