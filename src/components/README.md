# UI Components (`/src/components`)

This directory contains the modular, reusable React components and visualization logic that power the Natural Climate Solutions map portal.

## 🗺️ Mapping Components
- **`CountryLayer.js`**:
  The core rendering logic for the Leaflet global map. Fetches optimized GeoJSON data from `/public/geojson/` based on the selected admin level and draws interactive polygons.
  - **Multi-Admin Support**: Switches between Admin Level 0 (national boundaries), Level 1 (provinces/states), and Level 2 (districts) via the `adminLevel` prop.
  - **Tooltip Anchoring**: Custom algorithms override Leaflet's `getCenter()` on `MultiPolygon` shapes so tooltips anchor to the largest contiguous landmass, avoiding ocean placement for island nations.
  - **Tile Routing**: Emits events to `MapPage.js` to trigger the display of cloud-hosted satellite tiles (e.g., New Zealand via Cloudflare R2) when a specific polygon is clicked.

## 📊 Data Visualization Components
These D3.js components are decoupled from the map architecture, intended for reusability. They accept raw data arrays as React `props`.

- **`Barplot.js`**: A dynamically animated multi-category D3 bar chart with tooltips for specific climate solution pathways.
- **`PieChart.js`**: A responsive D3 donut/pie chart used for visual proportion metrics alongside the Bar Plot.

## 🪟 Interface Utilities
- **`Modal.js` & `Modal.css`**: A custom, draggable floating container. Instantiated when a map feature is clicked, it wraps the `Barplot` and `PieChart` children. Uses `backdrop-filter` for the Glassmorphism blur effect.
