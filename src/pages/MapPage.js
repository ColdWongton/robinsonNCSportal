// src/MapPage.js - Corrected TMS setting for NZ Tiles
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet'; // Ensure useMapEvents is imported
import 'leaflet/dist/leaflet.css';
import CountryLayer from '../components/CountryLayer';
import Modal from '../components/Modal';
import BarPlot from '../components/Barplot'; // Ensure filename matches
import PieChart from '../components/PieChart'; // Import the new pie chart
import L from 'leaflet';

// --- Leaflet Icon Fix ---
// eslint-disable-next-line @typescript-eslint/no-var-requires
const markerIcon2x = require('leaflet/dist/images/marker-icon-2x.png');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const markerIcon = require('leaflet/dist/images/marker-icon.png');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const markerShadow = require('leaflet/dist/images/marker-shadow.png');
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});
// --- End Icon Fix ---

// --- Constants ---
const worldBounds = L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180));
const topoRasterUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
const topoRasterAttribution = '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors';
// URL for your NZ tiles (ensure path/extension are correct and folder is public/tiles/TEST)
const nzTilesUrl = '/tiles/TEST/{z}/{x}/{y}.png';
const nzTilesAttribution = 'New Zealand Custom Tiles'; // Your attribution

// Placeholder data for the bar plot
const placeholderPlotData = {
    'Australia': [{ label: 'Agri', value: 75 }, { label: 'Forest', value: 40 }, { label: 'Industry', value: 65 }, { label: 'Service', value: 90 }],
    'Canada': [{ label: 'Agri', value: 30 }, { label: 'Forest', value: 80 }, { label: 'Industry', value: 55 }, { label: 'Service', value: 70 }],
    'Papua New Guinea': [{ label: 'Resource A', value: 60 }, { label: 'Resource B', value: 25 }, { label: 'Resource C', value: 85 }],
    'New Zealand': [{ label: 'Sheep', value: 95 }, { label: 'Tourism', value: 80 }, { label: 'Geothermal', value: 45 }],
    'Default': [{ label: 'Stat A', value: 20 }, { label: 'Stat B', value: 50 }, { label: 'Stat C', value: 35 }]
};
// --- End Constants ---

// Component to invalidate map size after fullscreen toggle
function InvalidateSizeComponent({ isFullscreen }) {
    const map = useMap();
    useEffect(() => {
        const timer = setTimeout(() => { if (map) map.invalidateSize(); }, 300);
        return () => clearTimeout(timer);
    }, [isFullscreen, map]);
    return null;
}

// --- MapEventsComponent Definition ---
// Handles zoom end event to hide NZ tiles when polygon reappears
function MapEventsComponent({ hiddenCountryName, reappearZoomLevel, setHiddenCountryName, setReappearZoomLevel, toggleNzTiles }) {
    const map = useMap();
    useEffect(() => {
        const handleZoomEnd = () => {
            const currentZoom = map.getZoom();
            // console.log(`[MapEvents] Zoom ended. Zoom: ${currentZoom}, Hidden: ${hiddenCountryName}, Reappear: ${reappearZoomLevel}`);
            if (hiddenCountryName && reappearZoomLevel !== null && currentZoom <= reappearZoomLevel) {
                // console.log(`[MapEvents] Reappearing country: ${hiddenCountryName}`);
                setHiddenCountryName(null); // Reset hidden country state
                setReappearZoomLevel(null); // Reset zoom threshold
                // Hide NZ tiles if the reappearing country was New Zealand (or hide for any reappear)
                if (typeof toggleNzTiles === 'function') {
                    // console.log("[MapEvents] Calling toggleNzTiles(false) on polygon reappear.");
                    toggleNzTiles(false);
                }
            }
        };
        map.on('zoomend', handleZoomEnd);
        return () => { map.off('zoomend', handleZoomEnd); };
    }, [map, hiddenCountryName, reappearZoomLevel, setHiddenCountryName, setReappearZoomLevel, toggleNzTiles]);
    return null;
}
// --- End MapEventsComponent ---


// Main Map Page Component
function MapPage() {
    // --- State ---
    const initialPosition = [20, 0];
    const initialZoom = 2;
    const [activeRasterUrl, setActiveRasterUrl] = useState(null); // For optional topo layer
    const [showNzTiles, setShowNzTiles] = useState(false);       // State for NZ Tiles visibility
    const [isPopupOpen, setIsPopupOpen] = useState(false);       // State for modal visibility
    const [popupTitle, setPopupTitle] = useState('');            // State for modal title
    const [popupData, setPopupData] = useState([]);              // State for modal bar plot data
    const [isFullscreen, setIsFullscreen] = useState(false);     // State for fullscreen mode
    // State for managing hidden polygon (needed by CountryLayer style and MapEventsComponent)
    const [hiddenCountryName, setHiddenCountryName] = useState(null);
    const [reappearZoomLevel, setReappearZoomLevel] = useState(null);
    // --- End State ---

    // --- Handlers ---
    const toggleRasterLayer = () => { setActiveRasterUrl(prev => prev === topoRasterUrl ? null : topoRasterUrl); };

    // Function passed down to CountryLayer/MapEventsComponent to show/hide NZ tiles
    const toggleNzTiles = (show) => {
        // console.log(`[MapPage] toggleNzTiles called with: ${show}. Current showNzTiles: ${showNzTiles}`);
        if (show !== showNzTiles) { // Prevent unnecessary updates
            setShowNzTiles(show);
            // console.log(`[MapPage] Setting showNzTiles state to: ${show}`);
        }
    };

    const openPopup = (countryName) => {
        const dataForPlot = placeholderPlotData[countryName] || placeholderPlotData['Default'];
        setPopupTitle(`${countryName} Data`);
        setPopupData(dataForPlot);
        setIsPopupOpen(true);
    };
    const closePopup = () => {
        setIsPopupOpen(false); setPopupTitle(''); setPopupData([]);
        toggleNzTiles(false); // Hide NZ tiles when popup closes
    };
    const toggleFullscreen = () => { setIsFullscreen(!isFullscreen); };
    // --- End Handlers ---

    // --- SVG Icons ---
    const fullscreenEnterIcon = (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="map-control-icon"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" /></svg>);
    const fullscreenExitIcon = (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="map-control-icon"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" /></svg>);
    const layersIcon = (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="map-control-icon"><path d="M8.328 1.078a.5.5 0 0 0-.656 0L3.5 4.445v8.11l4.527 3.396a.5.5 0 0 0 .656 0L12.5 12.555v-8.11L8.328 1.078zM12 12.14L8 15.03 4 12.14V4.86L8 1.97l4 2.89v7.28z" /><path d="M3.707 4.293 8 1.406l4.293 2.887c.39.262.39.858 0 1.12l-4 2.667a.5.5 0 0 1-.586 0l-4-2.667a.68.68 0 0 1 0-1.12z" /></svg>);
    // --- End SVG Icons ---


    // --- Render ---
    return (
        <div className={`map-wrapper ${isFullscreen ? 'map-fullscreen' : ''}`}>
            <MapContainer
                center={initialPosition}
                zoom={initialZoom}
                scrollWheelZoom={true}
                className="map-container"
                worldCopyJump={false}
                maxBounds={worldBounds}
                maxBoundsViscosity={1.0}
                zoomControl={false}
                attributionControl={true}
            >
                {/* Base Layer */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    noWrap={true}
                    zIndex={1}
                />

                {/* Optional Topographic Layer */}
                {activeRasterUrl && (
                    <TileLayer
                        url={activeRasterUrl}
                        attribution={topoRasterAttribution}
                        zIndex={5} // Below countries
                        key={activeRasterUrl}
                    />
                )}

                {/* Conditionally Rendered New Zealand Tile Layer */}
                {showNzTiles && typeof nzTilesUrl === 'string' && nzTilesUrl.length > 0 && (
                    <TileLayer
                        url={nzTilesUrl}
                        attribution={nzTilesAttribution}
                        zIndex={4} // Below Topo, Above Base
                        key="nz-tiles"
                        tms={false}  // <--- CHANGED TO FALSE (or remove this line)
                        minZoom={10} // Only request tiles for zoom 10
                        maxZoom={12} // Up to zoom 12
                    />
                )}

                {/* Interactive Country Polygons */}
                <CountryLayer
                    openPopup={openPopup}
                    toggleNzTiles={toggleNzTiles} // Pass the toggle function
                    setHiddenCountryName={setHiddenCountryName} // Pass setter for hiding
                    setReappearZoomLevel={setReappearZoomLevel} // Pass setter for hiding
                    hiddenCountryName={hiddenCountryName} // Pass state for styling
                />

                {/* Component to fix map size after fullscreen change */}
                <InvalidateSizeComponent isFullscreen={isFullscreen} />

                {/* Map Events Listener Component */}
                <MapEventsComponent
                    hiddenCountryName={hiddenCountryName}
                    reappearZoomLevel={reappearZoomLevel}
                    setHiddenCountryName={setHiddenCountryName}
                    setReappearZoomLevel={setReappearZoomLevel}
                    toggleNzTiles={toggleNzTiles} // Pass toggle function
                />

            </MapContainer>

            {/* Custom Controls Container (Top Right) */}
            <div className="custom-map-controls">
                {/* Buttons... */}
                <button onClick={toggleRasterLayer} className="map-control-button" title={activeRasterUrl ? 'Hide Topo Map' : 'Show Topo Map'}>{layersIcon}</button>
                <button onClick={toggleFullscreen} className="map-control-button" title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}>{isFullscreen ? fullscreenExitIcon : fullscreenEnterIcon}</button>
            </div>


            {/* Draggable Modal for Data Plots */}
            <Modal isOpen={isPopupOpen} onClose={closePopup} title={popupTitle}>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', gap: '10px' }}>
                    <BarPlot data={popupData} />
                    <PieChart data={popupData} />
                </div>
            </Modal>
        </div>
    );
    // --- End Render ---
}

export default MapPage;
