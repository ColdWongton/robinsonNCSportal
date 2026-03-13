# Page Layouts (`/src/pages`)

The `pages` directory houses the top-level route components for the Web Portal. These components act as "orchestrators"—stitching together smaller internal hooks, layout containers, and the UI elements housed in `/src/components`.

## 📍 `MapPage.js`
This is the application's most functionally dense component, responsible for the global map view state.
- **Admin Level Toggling**: Users cycle through Admin Level 0 (national), Level 1 (provincial), and Level 2 (district) via an on-map button. The selected level determines which GeoJSON file `CountryLayer` fetches.
- **Cloud Tile Integration**: NZ satellite tiles are served from Cloudflare R2 on demand — triggered only when the New Zealand polygon is clicked.
- **Layer Controls**: Toggle the OpenTopoMap topographic overlay and fullscreen mode from the top-right control panel.
- **Data Flow**: Acts as the parent container for the `Modal` (bar charts + pie charts) and passes state down to `CountryLayer` and `MapEventsComponent`.
- **Fullscreen Logic**: Programmatic overrides invalidate Leaflet's size boundaries upon fullscreen toggle, preventing gray-box rendering bugs.

## 🏠 `HomePage.js`
The landing dashboard of the application.
- Uses **Glassmorphism** styling via `App.css` to render content cards over the underlying background.
- Establishes the application's global **Google Fonts** typography: **Outfit** (branding headers) and **Inter** (body text).

## ℹ️ Content Pages
- **`AboutPage.js`**: Static information about the Robinson Lab Group's NCS research mission. Built for responsive viewing.
- **`ContactPage.js`**: Quick-reference page for reaching out to project administrators and researchers.
