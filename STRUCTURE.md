# Project structure

```
portfolio/
├── index.html          # Main page markup
├── css/
│   └── main.css        # Site styles (extracted from former inline <style>)
├── js/
│   ├── map-config.js   # Map constants: dimensions, meta, layout, links
│   ├── map.js          # SVG sketch map rendering and layout
│   ├── scroll-reveals.js  # IntersectionObserver scroll-in animations
│   ├── lightbox.js     # Image lightbox open/close behavior
│   └── main.js         # Boots map, reveals, and lightbox on load
└── STRUCTURE.md        # This file
```

Scripts load with `defer` in dependency order: config → map → reveals → lightbox → main.
