# PWA Icons

## Required Icon Sizes

Place the following icon files in this directory:

- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

## Quick Generation

You can use online tools to generate PWA icons from a single image:
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator

Or use CLI tools:
```bash
npx pwa-asset-generator logo.svg ./public/icons
```

## Temporary Placeholder

Until proper icons are created, you can use a simple SVG as base and convert it to PNG using:
```bash
# Using ImageMagick
convert -background none -size 512x512 icon.svg icon-512x512.png

# Using sharp-cli
npx sharp-cli resize 512 512 -i icon.svg -o icon-512x512.png
```
