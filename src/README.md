# 💻 Source Code Documentation

Welcome to the `/src` directory! This README is intended for developers, researchers, or anyone contributing code to the Robinson Lab Group Mapping platform. 

## 📂 Directory Structure

```text
src/
├── assets/          # Static assets (Logos, backgrounds, images)
├── components/      # Reusable React UI components (Charts, Modals, Map Layers)
├── pages/           # Top-level route components (Home, Map, About, Contact)
├── App.js           # Main Application wrapper and React Router setup
├── App.css          # Global styling, layout, Glassmorphism classes
└── index.js         # React DOM entry point
```

## 🗺️ Mapping Architecture

The mapping logic is housed primarily in `pages/MapPage.js` and `components/CountryLayer.js`.

### The `CountryLayer` Component
This is the workhorse of the interactive map. It parses the global `countries.geojson` file and renders interactive polygons. 

**Smart Tooltip Anchoring:**
A critical piece of logic inside `CountryLayer` involves overriding Leaflet's standard `layer.getCenter()` method. By default, Leaflet finds the mathematical average of a MultiPolygon, which often drops tooltips in the ocean (e.g., between the islands of Canada or Indonesia).
We calculate the area of the distinct polygon rings within the `MultiPolygon` and return the center of the largest contiguous shape. Thus, hovers behave perfectly intuitively.

***Custom Tile Layers (New Zealand):***
If a user clicks on New Zealand, standard base layers are supplemented with strict regional tiles. Logic in the `MapEventsComponent` binds to zoom levels to smoothly toggle these custom high-res assets in and out without overwhelming the canvas.

## 📊 Data Visualization

When a country polygon is clicked, a popup Modal is rendered containing D3 visualizations.
- `Barplot.js`
- `PieChart.js`

These components are designed to be responsive, resizing themselves when the custom Draggable `Modal.js` component is interacted with. 

## 🎨 UI / UX Styling Guidelines

The application does not use heavy CSS frameworks (like Tailwind or Bootstrap). Instead, it relies on strict, vanilla CSS governed in `App.css` and `index.css`.

**Key Aesthetic Principles to follow when extending the UI:**
1. **Glassmorphism**: Modals and cards should use `background: rgba(255, 255, 255, 0.65);` paired with `backdrop-filter: blur(12px)` and a subtle light border.
2. **Typography**:
   - `Outfit` (font-weights: 400, 600, 700) is reserved strictly for Headings (`h1`, `h2`, `h3`).
   - `Inter` is the workhorse font used for all body text, paragraphs, and lists.
3. **No 'Dead' Interactions**: Buttons should have CSS `:hover` states with scale micro-animations and smooth cubic-bezier transitions. Partner logos should be grayscale by default and shift to full-color with a subtle lift upward on hover.
