// src/CountryLayer.js - SetView for NZ, fitBounds for other countries
import React, { useState, useEffect } from 'react';
import { GeoJSON, useMap } from 'react-leaflet'; // useMapEvents is now in MapPage
import axios from 'axios';
import L from 'leaflet';

// Receive props from MapPage
function CountryLayer({ openPopup, toggleNzTiles, setHiddenCountryName, setReappearZoomLevel, hiddenCountryName }) {
    const [geoJsonData, setGeoJsonData] = useState(null);
    const [error, setError] = useState(null);
    const map = useMap();

    // useEffect for fetching GeoJSON data
    useEffect(() => {
        axios.get('/countries.geojson') // Changed to load the newly converted map data
            .then(response => {
                if (response.data && response.data.type === 'FeatureCollection' && Array.isArray(response.data.features)) {
                    setGeoJsonData(response.data); setError(null);
                } else {
                    console.error("Invalid GeoJSON format received:", response.data);
                    setError("Invalid GeoJSON format received.");
                    setGeoJsonData(null);
                }
            })
            .catch(fetchError => {
                console.error("Failed to fetch GeoJSON:", fetchError.message);
                setError(`Failed to fetch GeoJSON: ${fetchError.message}`);
                setGeoJsonData(null);
            });
    }, []);


    // --- Styles ---
    const countryStyle = { fillColor: 'lightblue', fillOpacity: 0.5, color: 'white', weight: 1 };
    const highlightStyle = { fillColor: 'yellow', fillOpacity: 0.7, color: '#666', weight: 2 };
    const hiddenStyle = { opacity: 0, fillOpacity: 0 };
    // --- End Styles ---

    const styleFunction = (feature) => {
        // Adjust properties check for GADM format
        const countryIdentifier = feature?.properties?.COUNTRY || feature?.properties?.NAME_0 || feature?.properties?.ADMIN || feature?.properties?.NAME || feature?.properties?.name || 'Unnamed Area';
        if (countryIdentifier === hiddenCountryName) {
            return hiddenStyle;
        }
        return countryStyle;
    };

    const onEachFeature = (feature, layer) => {
        const countryIdentifier = feature?.properties?.COUNTRY || feature?.properties?.NAME_0 || feature?.properties?.ADMIN || feature?.properties?.NAME || feature?.properties?.name || 'Unnamed Area';
        
        // Handle MultiPolygons specifically to fix tooltip anchoring
        if (feature?.geometry?.type === 'MultiPolygon' && layer.getCenter) {
            const originalGetCenter = layer.getCenter.bind(layer);
            
            // Override getCenter to return the center of the largest polygon
            layer.getCenter = function() {
                try {
                    let maxArea = 0;
                    let bestBounds = null;
                    const multiCoords = feature.geometry.coordinates;

                    // Iterate over each distinct polygon in the MultiPolygon
                    multiCoords.forEach(polygonCoords => {
                        // The first array represents the exterior ring
                        const outerRing = polygonCoords[0];
                        // Convert to L.latLng to calculate bounds
                        const ringLatLngs = outerRing.map(coord => L.latLng(coord[1], coord[0]));
                        const bounds = L.latLngBounds(ringLatLngs);

                        // Simple area approximation: height x width of bounding box
                        const latDiff = Math.abs(bounds.getNorth() - bounds.getSouth());
                        const lngDiff = Math.abs(bounds.getEast() - bounds.getWest());
                        const area = latDiff * lngDiff;

                        if (area > maxArea) {
                            maxArea = area;
                            bestBounds = bounds;
                        }
                    });

                    // If we successfully found the largest polygon, return its center
                    if (bestBounds) {
                        return bestBounds.getCenter();
                    }
                } catch (e) {
                    console.warn(`Error computing center for ${countryIdentifier}, falling back to default.`, e);
                }
                
                // Fallback to the original Leaflet behavior if anything goes wrong
                return originalGetCenter();
            };
        }

        layer.bindTooltip(countryIdentifier);

        layer.on({
            mouseover: (e) => {
                if (countryIdentifier !== hiddenCountryName) {
                    e.target.setStyle(highlightStyle).bringToFront();
                }
            },
            mouseout: (e) => {
                if (countryIdentifier !== hiddenCountryName && geoJsonData) {
                    layer.setStyle(styleFunction(feature));
                }
            },
            click: (e) => {
                const currentZoomForReappear = map.getZoom();

                // Call setters passed from MapPage to update parent state for hiding polygon
                if (typeof setHiddenCountryName === 'function') {
                    setHiddenCountryName(countryIdentifier);
                }
                if (typeof setReappearZoomLevel === 'function') {
                    setReappearZoomLevel(currentZoomForReappear > 1 ? currentZoomForReappear - 2 : 0);
                }

                // --- NZ Tiles & Map View Logic ---
                if (countryIdentifier === 'New Zealand') { // Verify this name matches your GeoJSON
                    // ===> TARGET COORDINATES FOR YOUR TILE Z=10, X=1000, Y_TMS=651 (Y_XYZ=372) <===
                    // This LatLng corresponds to the center of tile 10/1000/651 (TMS)
                    // or 10/1000/372 (XYZ)
                    const nzTileTargetCenter = L.latLng(-41.108998, 175.95703125);
                    const nzTargetZoom = 10; // Target zoom level for NZ tiles
                    // ===> END TARGET COORDINATES <===

                    map.setView(nzTileTargetCenter, nzTargetZoom);
                    // console.log(`[CountryLayer] Setting view to NZ. Center: ${nzTileTargetCenter.toString()}, Zoom: ${nzTargetZoom}`);

                    // Use a timeout or map event to ensure setView has completed before toggling tiles
                    map.once('moveend zoomend', () => {
                        // console.log('[CountryLayer] Map view set for NZ. Current map zoom:', map.getZoom());
                        if (typeof toggleNzTiles === 'function') {
                            toggleNzTiles(true); // Tell MapPage to show the NZ tiles layer
                        }
                    });

                } else {
                    if (typeof toggleNzTiles === 'function') {
                        toggleNzTiles(false); // Hide NZ tiles if other country clicked
                    }
                    // Zoom to other countries using fitBounds to largest polygon
                    try {
                        let bestBounds = e.target.getBounds();
                        const feature = e.target.feature;

                        // If the map feature is a MultiPolygon, we calculate bounds for each distinct polygon
                        if (feature && feature.geometry && feature.geometry.type === 'MultiPolygon') {
                            let maxArea = 0;
                            const multiCoords = feature.geometry.coordinates;

                            multiCoords.forEach(polygonCoords => {
                                // The first array is always the outer ring of the polygon
                                const outerRing = polygonCoords[0];
                                const ringLatLngs = outerRing.map(coord => L.latLng(coord[1], coord[0]));
                                const bounds = L.latLngBounds(ringLatLngs);

                                // Calculate approximate area of this polygon's bounding box
                                const latDiff = bounds.getNorth() - bounds.getSouth();
                                const lngDiff = bounds.getEast() - bounds.getWest();
                                const area = latDiff * lngDiff;

                                if (area > maxArea) {
                                    maxArea = area;
                                    bestBounds = bounds;
                                }
                            });
                        }

                        map.fitBounds(bestBounds);
                    } catch (boundsError) {
                        console.error("Error fitting bounds for other country:", boundsError);
                    }
                }
                // --- End NZ Tiles & Map View Logic ---

                // Open the data popup modal using the identifier
                if (typeof openPopup === 'function') {
                    openPopup(countryIdentifier);
                }
            }
        });
    };

    // This useEffect is now only for handling map interactions and styles, not data loading
    useEffect(() => {
        // The styles and onEachFeature function are defined outside this useEffect
        // and will be passed to the GeoJSON component.
        // No direct layer manipulation here as GeoJSON component handles it.
        // The dependency array ensures that if any of these props change,
        // the GeoJSON component (and thus its internal layers) will re-render.
    }, [map, openPopup, toggleNzTiles, setHiddenCountryName, setReappearZoomLevel, hiddenCountryName, geoJsonData]);


    // --- Rendering Logic ---
    if (error) {
        return <div style={{ position: 'absolute', top: '10px', left: '50px', zIndex: 1000, background: 'yellow', padding: '10px', border: '1px solid red' }}>Error: {error}</div>;
    }

    return (geoJsonData && typeof geoJsonData === 'object') ? (
        <GeoJSON
            key={hiddenCountryName}
            data={geoJsonData}
            style={styleFunction}
            onEachFeature={onEachFeature}
            zIndex={10}
        />
        // MapEventsComponent is now rendered in MapPage
    ) : null;
    // --- End Rendering ---
}

export default CountryLayer;
