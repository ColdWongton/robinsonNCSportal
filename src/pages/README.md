# Page Layouts (`/src/pages`)

The `pages` directory houses the top-level route components for the Web Portal. These components act as "orchestrators"—stitching together smaller internal hooks, layout containers, and the UI elements housed in `/src/components`.

## 📍 `MapPage.js`
This is the application's most functionally dense component, responsible for the global map view state.
- **State Management**: Controls the display toggles between the standard OpenStreetMap layer, the `OpenTopoMap` topographic overlay, and custom regional rendering logic.
- **Data Flow**: Acts as the parent container for the `Modal` and passes the parsed geometry down to the `CountryLayer`.
- **Fullscreen Logic**: Features programmatic overrides that invalidate the Leaflet size boundaries upon fullscreen toggle, preventing gray-box rendering bugs.

## 🏠 `HomePage.js`
The landing dashboard of the application.
- Uses strict **Glassmorphism** styling via `App.css` to render content cards cleanly over the underlying `websitebackground.png`.
- Establishes the application's global `Google Fonts` typography: **Outfit** (for large branding headers) and **Inter** (for high-readability body descriptions).

## ℹ️ Content Pages
- **`AboutPage.js`**: Contains static information breaking down the core mission of the Robinson Lab Group's Natural Climate Solutions research. Built for responsive viewing.
- **`ContactPage.js`**: Quick-reference static page for reaching out to project administrators and researchers. Does not maintain meaningful transient state.
