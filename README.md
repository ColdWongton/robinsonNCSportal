# Robinson Lab Group: Natural Climate Solutions Research Map

Welcome to the **Robinson Lab Group Natural Climate Solutions Web Portal**. This application provides an interactive, globally aware map to explore how various Natural Climate Solutions (NCS) pathways impact aspects of human well-being, biodiversity, and the environment.

Developed in close collaboration with **The Nature Conservancy**, **LexUnit**, **McGill University**, and **Pomona College**, this portal visualizes complex ecological and policy data.

## 🌟 Key Features

- **Interactive Global Map**: Zoom and pan across a custom-built Leaflet map.
- **Multi-Level Admin Boundaries**: Toggle between Admin Level 0 (national), Level 1 (provincial), and Level 2 (district) using the on-map control button.
- **Smart Tooltips**: Hovering over fragmented countries (like Canada or Indonesia) dynamically finds and anchors to the largest contiguous landmass, keeping the UI intuitive.
- **Responsive Data Visualization**: Click any nation/region to pull up a modal with distinct D3-powered Bar Plots and Pie Charts detailing their specific NCS metrics.
- **Cloud-Hosted Tiles**: High-definition satellite tiles for specific locales (e.g., New Zealand) are served from Cloudflare R2 on demand.
- **Topographic Layer**: Users can toggle an OpenTopoMap overlay for terrain context.

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-link>
   cd robinson-website
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the Development Server:**
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

4. **Build for Production:**
   ```bash
   npm run build
   ```

## 📂 Directory Overview

- **`/src`**: React UI components, page layouts, and application styling.
  - **`/src/components`**: Reusable components — map layer logic, charts, and modal. See [`/src/components/README.md`](./src/components/README.md).
  - **`/src/pages`**: Top-level route components. See [`/src/pages/README.md`](./src/pages/README.md).
- **`/public`**: Static assets served directly to the browser.
  - **`geojson/`**: Optimized GeoJSON files for Admin Levels 0, 1, and 2 (simplified from raw GADM data using `mapshaper`).
  - **`index.html` & `manifest.json`**: Core SPA framework files.

## ☁️ Cloud Infrastructure

- **Cloudflare R2** (`geographicdata` bucket): Hosts ~62,000 high-resolution satellite tiles for the New Zealand region (zoom levels 10–12). Tiles are loaded on-demand when a user clicks the New Zealand polygon and persist while exploring — they only disappear when zooming back out. Leaflet only fetches tiles visible in the current viewport, minimizing API calls.
  - Public URL: `https://pub-dab36e94618e48b58bcd65833956b5b8.r2.dev/`

## 🛠 Tech Stack
- **Frontend Framework**: React 19
- **Mapping & Geospatial**: React-Leaflet, Leaflet.js, GeoJSON
- **Data Visualization**: D3.js
- **Cloud Storage**: Cloudflare R2 (tile hosting)
- **Styling**: Vanilla CSS, Google Fonts (Outfit & Inter), Glassmorphism Patterns

## To Do
What is left to do is primarily the cloud components. 

1. Perform statistical analysis/processes on the points (by country/per admin level) and join them to the geopackage (polygons) so that one can call upon the data for the data visualizations/popups when one clicks on a country.
2. Admin Levels - The admin levels will need to be uploaded to the cloud service once it is set up. Afterwards, the website will have to be updated to grab the admin levels when necessary.
3. Raster Imagery of NCS - Once all the analysis of the study is completed, the points should be convereted into raster imagery, which will then be convereted into tiles. Once they are tiles, they should be uploaded to a cloud service for them to be called when someone clicks on a country.

## 🤝 Project Partners & Acknowledgements
- **The Nature Conservancy** 
- **LexUnit**
- **McGill University**
- **Pomona College**
