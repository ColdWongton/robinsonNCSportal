# Robinson Lab Group: Natural Climate Solutions Research Map

Welcome to the **Robinson Lab Group Natural Climate Solutions Web Portal**. This application provides an interactive, globally aware map to explore how various Natural Climate Solutions (NCS) pathways impact aspects of human well-being, biodiversity, and the environment.

Developed in close collaboration with **The Nature Conservancy**, **LexUnit**, **McGill University**, and **Pomona College**, this portal visualizes complex ecological and policy data.

## 🌟 Key Features

- **Interactive Global Map**: Zoom and pan across a custom-built Leaflet map.
- **Smart Tooltips**: Hovering over fragmented countries (like Canada or Indonesia) dynamically finds and anchors to the largest contiguous landmass, keeping the UI intuitive.
- **Responsive Data Visualization**: Click any nation to pull up a modal with distinct D3-powered Bar Plots and Pie Charts detailing their specific NCS metrics.
- **Topographic & Custom Tiles**: Users can toggle OpenTopoMap layers and explore custom-rendered high-definition tiles for specific locales (e.g., New Zealand).

## 🚀 Getting Started

To run this project locally on your machine, follow these steps:

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
   *This installs React, Leaflet, D3, Recharts, and all necessary mapping extensions.*

3. **Start the Development Server:**
   ```bash
   npm start
   ```
   *This commands runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.*

4. **Build for Production:**
   ```bash
   npm run build
   ```
   *This builds the app for production to the `build` folder, optimizing the build for the best deployment performance.*

## 📂 Directory Overview

- **`/src`**: Contains the React UI components, page layouts, and application styling. (See `/src/README.md` for a deeper technical breakdown of the React architecture).
- **`/public`**: Houses all static assets that bypass the webpack bundler and are served directly to the browser.
  - **`countries.geojson`**: The master geometry data file used by Leaflet to render the interactive country polygons.
  - **`tiles/TEST/`**: A massive directory containing over 62,000 custom-rendered, high-resolution map tiles specifically for the New Zealand region.
  - **`index.html` & `manifest.json`**: The core framework files for the Single Page Application.
  - 
NOTE:
- for countries.json, this is only here temporarily as the website should later be built to call from a cloud service (cloudflare) so that we can call multiple gadm admin levels when needed. The sizes of these admin levels are too large to store in cpanel.
- for tiles/TEST/, this is only done for new zealand as this is also temporary. It should later be removed as the tiles will be stored in a cloud service (cloudflare) and later be called from it. 


## 🛠 Tech Stack
- **Frontend Framework**: React 19
- **Mapping & Geospatial**: React-Leaflet, Leaflet.js, GeoJSON
- **Data Visualization**: D3.js
- **Styling**: Vanilla CSS, Google Fonts (Outfit & Inter), Glassmorphism Patterns

## To Do
What is left to do is primarily the cloud components. 

1. Perform statistical analysis/processes on the points (by country) and join them to the geopackage (polygons) so that once can call upon the data for the data visualizations/popups when one clicks on a country.
2. Admin Levels - The admin levels will need to be uploaded to the cloud service once it is set up. Afterwards, the website will have to be updated to grab the admin levels when necessary.
3. Raster Imagery of NCS - Once all the analysis of the study is completed, the points should be convereted into raster imagery, which will then be convereted into tiles. Once they are tiles, they should be uploaded to a cloud service for them to be called when someone clicks on a country.
