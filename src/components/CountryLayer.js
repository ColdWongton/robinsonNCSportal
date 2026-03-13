// src/CountryLayer.js — Renders interactive GeoJSON country/region polygons
// Supports Admin Level 0 (national), 1 (provincial), and 2 (district)
import React, { useState, useEffect } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';

/**
 * CountryLayer — Fetches and renders GeoJSON polygons on the map.
 *
 * Props:
 *  - openPopup(name)        : opens the data modal for a clicked region
 *  - toggleNzTiles(bool)    : shows/hides the NZ satellite tile overlay
 *  - setHiddenCountryName   : hides a polygon after it's been clicked
 *  - setReappearZoomLevel   : sets the zoom level at which the hidden polygon reappears
 *  - hiddenCountryName      : currently hidden polygon name (used for styling)
 *  - adminLevel             : 0, 1, or 2 — determines which GeoJSON file to fetch
 */
function CountryLayer({
    openPopup,
    toggleNzTiles,
    setHiddenCountryName,
    setReappearZoomLevel,
    hiddenCountryName,
    adminLevel,
}) {
    const [geoJsonData, setGeoJsonData] = useState(null);
    const [error, setError] = useState(null);
    const map = useMap();

    // ── Fetch GeoJSON when adminLevel changes ──────────────────────────
    useEffect(() => {
        setGeoJsonData(null); // Clear stale data immediately

        const fileNames = { 0: 'admin0.geojson', 1: 'admin1.geojson', 2: 'admin2.geojson' };
        const fetchUrl = `/geojson/${fileNames[adminLevel] || 'admin0.geojson'}`;

        axios.get(fetchUrl)
            .then(response => {
                if (response.data?.type === 'FeatureCollection' && Array.isArray(response.data.features)) {
                    setGeoJsonData(response.data);
                    setError(null);
                } else {
                    console.error('Invalid GeoJSON format received:', response.data);
                    setError('Invalid GeoJSON format received.');
                    setGeoJsonData(null);
                }
            })
            .catch(err => {
                console.error('Failed to fetch GeoJSON:', err.message);
                setError(`Failed to fetch GeoJSON: ${err.message}`);
                setGeoJsonData(null);
            });
    }, [adminLevel]);

    // ── Styles ─────────────────────────────────────────────────────────
    const countryStyle  = { fillColor: 'lightblue', fillOpacity: 0.5, color: 'white', weight: 1 };
    const highlightStyle = { fillColor: 'yellow', fillOpacity: 0.7, color: '#666', weight: 2 };
    const hiddenStyle    = { opacity: 0, fillOpacity: 0 };

    // ── Helper: extract the best display name for a feature ────────────
    const getFeatureName = (feature) =>
        feature?.properties?.[`NAME_${adminLevel}`] ||
        feature?.properties?.COUNTRY ||
        feature?.properties?.NAME_0 ||
        feature?.properties?.ADMIN ||
        feature?.properties?.NAME ||
        feature?.properties?.name ||
        'Unnamed Area';

    // ── Style function (hides the clicked polygon) ─────────────────────
    const styleFunction = (feature) => {
        return getFeatureName(feature) === hiddenCountryName ? hiddenStyle : countryStyle;
    };

    // ── Helper: find the largest polygon in a MultiPolygon ─────────────
    const getLargestPolygonBounds = (coordinates) => {
        let maxArea = 0;
        let bestBounds = null;

        coordinates.forEach(polygonCoords => {
            const outerRing = polygonCoords[0];
            const ringLatLngs = outerRing.map(coord => L.latLng(coord[1], coord[0]));
            const bounds = L.latLngBounds(ringLatLngs);

            const area = Math.abs(bounds.getNorth() - bounds.getSouth()) *
                         Math.abs(bounds.getEast() - bounds.getWest());

            if (area > maxArea) {
                maxArea = area;
                bestBounds = bounds;
            }
        });

        return bestBounds;
    };

    // ── onEachFeature — tooltips, hover, and click behaviour ───────────
    const onEachFeature = (feature, layer) => {
        const name = getFeatureName(feature);

        // Override getCenter for MultiPolygons to anchor tooltip on the largest part
        if (feature?.geometry?.type === 'MultiPolygon' && layer.getCenter) {
            const originalGetCenter = layer.getCenter.bind(layer);
            layer.getCenter = function () {
                try {
                    const best = getLargestPolygonBounds(feature.geometry.coordinates);
                    if (best) return best.getCenter();
                } catch (e) {
                    console.warn(`Error computing center for ${name}; falling back.`, e);
                }
                return originalGetCenter();
            };
        }

        layer.bindTooltip(name);

        layer.on({
            mouseover: (e) => {
                if (name !== hiddenCountryName) {
                    e.target.setStyle(highlightStyle).bringToFront();
                }
            },
            mouseout: () => {
                if (name !== hiddenCountryName && geoJsonData) {
                    layer.setStyle(styleFunction(feature));
                }
            },
            click: (e) => {
                const currentZoom = map.getZoom();

                // Hide the clicked polygon and set reappear threshold
                setHiddenCountryName?.(name);
                setReappearZoomLevel?.(currentZoom > 1 ? currentZoom - 2 : 0);

                // ── New Zealand: zoom to tile coverage area ────────────
                if (name === 'New Zealand') {
                    const nzCenter = L.latLng(-41.108998, 175.95703125);
                    map.setView(nzCenter, 10);
                    map.once('moveend zoomend', () => toggleNzTiles?.(true));
                } else {
                    toggleNzTiles?.(false);

                    // Zoom to the largest polygon for MultiPolygon features
                    try {
                        let bestBounds = e.target.getBounds();
                        const feat = e.target.feature;

                        if (feat?.geometry?.type === 'MultiPolygon') {
                            const largest = getLargestPolygonBounds(feat.geometry.coordinates);
                            if (largest) bestBounds = largest;
                        }

                        map.fitBounds(bestBounds);
                    } catch (err) {
                        console.error('Error fitting bounds:', err);
                    }
                }

                // Open the data modal
                openPopup?.(name);
            },
        });
    };

    // ── Render ──────────────────────────────────────────────────────────
    if (error) {
        return (
            <div style={{ position: 'absolute', top: 10, left: 50, zIndex: 1000,
                          background: 'yellow', padding: 10, border: '1px solid red' }}>
                Error: {error}
            </div>
        );
    }

    return geoJsonData ? (
        <GeoJSON
            key={`${adminLevel}-${hiddenCountryName}`}
            data={geoJsonData}
            style={styleFunction}
            onEachFeature={onEachFeature}
            zIndex={10}
        />
    ) : null;
}

export default CountryLayer;
