// src/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
// Assuming images are in src/assets/ - Adjust path if needed
import imageOne from '../assets/NC_Logo.png';
import imageTwo from '../assets/McGill_Logo.png';
import imageThree from '../assets/Pomona_Logo.png';
import imageFour from '../assets/Lexunit_Logo.jpg';
import middleImage1 from '../assets/UNNCS.jpg';

function HomePage() {
    const navigate = useNavigate();

    return (
        // 'page-content-animated' for animation
        <div className="home-page-content page-content-animated">

            {/* Main heading */}
            <h1 style={{ color: 'white' }}>Robinson Lab Group </h1>

            {/* Text Container */}
            <div className="home-text-container">
                <h2>
                    Natural Climate Solutions Research
                </h2>

                {/* Container for middle images */}
                <div className="middle-image-container">
                    <img
                        src={middleImage1}
                        alt="United Nations NCS infographic"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x200/CCCCCC/grey?text=Image+Error"; }}
                    />
                </div>

                <p style={{ textAlign: 'center' }}>
                    Natural Climate Solutions (NCS) are changes in land systems that primarily aim to mitigate climate change. NCS include a wide range of practices & actions that sometimes correlate with other things society cares about - like biodiversity conservation or human well-being. To better direct policy and guide action on where and how to implement NCS, and in close collaboration with The Nature Conservancy, this project asks: How do various NCS pathways impact aspects of human well-being, biodiversity, and the environment? <br />
                </p>

                {/* Container for action buttons - MOVED OUTSIDE aof the text container */}
                <div className="home-button-container">
                    {/* Button to About Page */}
                    <button onClick={() => navigate('/about')} className="map-button">
                        <span>Learn More</span>
                        <span className="button-icon">
                            &#10140;
                        </span>
                    </button>
                    {/* Button to Map Page */}
                    <button onClick={() => navigate('/map')} className="map-button">
                        <span>Explore the Data</span>
                        <span className="button-icon">
                            &#10140;
                        </span>
                    </button>
                </div>

                <h3>
                    <br /> In partnership with researchers from
                </h3>

                {/* Image Container for Logos */}
                <div className="home-image-container">
                    <img src={imageOne} alt="The Nature Conservancy Logo" />
                    <img src={imageFour} alt="Lexunit Logo" />
                    <img src={imageTwo} alt="McGill University Logo" />
                    <img src={imageThree} alt="Pomona College Logo" />
                </div>
            </div>


        </div>
    );
}

export default HomePage;
