# Robinson Lab Group: Natural Climate Solutions Research Map

Welcome to the **Robinson Lab Group Natural Climate Solutions Web Portal**. This application provides an interactive, globally aware map to explore how various Natural Climate Solutions (NCS) pathways impact aspects of human well-being, biodiversity, and the environment.

Developed in close collaboration with **The Nature Conservancy**, **LexUnit**, **McGill University**, and **Pomona College**, this portal visualizes complex ecological and policy data.

## 🌟 Key Features

- **Interactive Global Map**: Zoom and pan across a custom-built Leaflet map.
- **Smart Tooltips**: Hovering over fragmented countries (like Canada or Indonesia) dynamically finds and anchors to the largest contiguous landmass, keeping the UI intuitive.
- **Responsive Data Visualization**: Click any nation to pull up a modal with distinct D3-powered Bar Plots and Pie Charts detailing their specific NCS metrics.
- **Premium Glassmorphism UI**: Uses a modern translucent design aesthetic that beautifully blends content cards over high-resolution imagery.
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

## 🛠 Tech Stack
- **Frontend Framework**: React 19
- **Mapping & Geospatial**: React-Leaflet, Leaflet.js, GeoJSON
- **Data Visualization**: D3.js
- **Styling**: Vanilla CSS, Google Fonts (Outfit & Inter), Glassmorphism Patterns

## 🤝 Project Partners & Acknowledgements
- **The Nature Conservancy** 
- **LexUnit**
- **McGill University**
- **Pomona College**

---
*Developed by the Robinson Lab Group Team.*
