# UI Components (`/src/components`)

This directory contains the modular, reusable React components and visualization logic that power the Natural Climate Solutions map portal.

## 🗺️ Mapping Components
- **`CountryLayer.js`**:
  The core rendering logic for the Leaflet global map. It accepts GeoJSON data and draws interactive country polygons.
  - **Tooltip Anchoring**: It contains custom algorithms that override Leaflet's `getCenter()` on `MultiPolygon` shapes so that tooltips explicitly snap to the center of the country's *largest contiguous landmass*, avoiding ocean placement for island nations like Indonesia.
  - **Tile Routing**: Emits events up to `MapPage.js` to trigger the display of regional topographically detailed tiles (e.g., New Zealand) when explicitly clicked.

## 📊 Data Visualization Components
These D3.js components are entirely decoupled from the map architecture, intended for reusability. They accept raw data arrays as React `props`.

- **`Barplot.js`**: 
  A dynamically animated multi-category D3 bar chart with distinct tooltips for specific climate solution pathways.
- **`PieChart.js`**: 
  A responsive D3 donut/pie chart used for visual proportion metrics alongside the Bar Plot.

## 🪟 Interface Utilities
- **`Modal.js` & `Modal.css`**: 
  A custom, draggable floating container. This component is instantiated when a map feature is clicked, and it envelopes the `Barplot` and `PieChart` children. It uses `backdrop-filter` for the Glassmorphism blur effect and handles z-index ordering above the map canvas.
