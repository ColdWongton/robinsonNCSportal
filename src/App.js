import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import MapPage from './pages/MapPage';

function App() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="app-container">
            <header className="menu" style={{ position: 'fixed', top: 0, left: 0, width: '100%' }}>
                <button className={`menu-toggle ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
                    <div className="bar1"></div>
                    <div className="bar2"></div>
                    <div className="bar3"></div>
                </button>

                <nav className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
                    <ul>
                        <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
                        <li><Link to="/about" onClick={toggleMenu}>About</Link></li>
                        <li><Link to="/map" onClick={toggleMenu}>Map View</Link></li>
                        <li><Link to="/contact" onClick={toggleMenu}>Contact</Link></li>
                    </ul>
                </nav>
            </header>

            <main className={`main-content ${isMenuOpen ? 'menu-open' : ''}`}> {/* Removed paddingTop */}
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/map" element={<MapPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                </Routes>
            </main>

            <footer className="footer">
                <p>&copy; {new Date().getFullYear()} Robinson Lab Group</p>
            </footer>
        </div>
    );
}

function AppWithRouter() {
    return (
        <Router>
            <App />
        </Router>
    )
}
export default AppWithRouter;