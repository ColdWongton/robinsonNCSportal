// src/AboutPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Re-import useNavigate

// Import your images
import ncsImage from '../assets/Project_AI.jpg';
import importanceImage from '../assets/Project_Importance.jpg';

function AboutPage() {
    const navigate = useNavigate(); // Re-initialize the navigate function

    return (
        // 'page-content-animated' for animation
        <div className="about-page-content page-content-animated">
            <h2>What are Natural Climate Solutions (NCS)?</h2>

            {/* First paragraph */}
            <p>Addressing global climate change is one of the most pressing challenges of our times. Natural Climate Solutions (NCS), sometimes referred to under the broader umbrella of nature-based solutions, focus on how to protect, restore, or manage lands in ways that mitigate greenhouse gas emissions <a href="https://www.pnas.org/doi/10.1073/pnas.1710465114" target="_blank" rel="noopener noreferrer">(Griscom et al 2017)</a>. If carried out fully, such actions could contribute to more than 1/3 of climate mitigation goals and as such are actions at the forefront of the agenda for many organizations.</p>

            {/* First Image Container */}
            <div className="about-image-container">
                <img
                    src={ncsImage}
                    alt="Diagram illustrating Natural Climate Solutions"
                    className="about-page-image"
                />
            </div>

            {/* Second paragraph */}
            <p>When implemented, NCS can also produce a wide range of co-benefits that contribute to human well-being (HWB), biodiversity, or general environmental conditions. The primary goal of this project is to better understand which HWB co-benefits might be expected with a given NCS action. We categorize NCS actions or 'pathways' following <a href="https://www.pnas.org/doi/10.1073/pnas.1710465114" target="_blank" rel="noopener noreferrer">Griscom et al (2017)</a>, and use categories of HWB presented in <a href="https://www.nature.com/articles/528185a" target="_blank" rel="noopener noreferrer">McKinnon et al (2018)</a>. This gives us a matrix of NCS pathways vs HWB co-benefits that we can begin to document and investigate.</p>

            {/* Container for the "Learn More" button */}
            <div className="home-button-container">
                <a
                    href="https://www.nature.org/en-us/what-we-do/our-insights/perspectives/natural-climate-solutions/"
                    className="map-button" // Reuse the same button style
                    target="_blank" // Open in a new tab
                    rel="noopener noreferrer" // Security best practice for external links
                >
                    <span>Learn More: The Nature Conservacy</span>
                    <span className="button-icon">
                        &#10140;
                    </span>
                </a>
            </div>

            {/* Second Heading */}
            <h2><br /> Why is this project important?</h2>

            {/* Third paragraph */}
            <p>Currently we know little about the co-benefits of NCS, yet these are crucial (and indeed sometimes more important) to decision-makers who will choose and implement NCS. This deficit of evidence hinders decision-making and policy action for where and how to implement NCS, who will likely benefit (or lose), and how. Our focus on the dominant NCS pathways and 11 possible human, biodiversity, and environmental co-benefits will develop evidence for policy action.</p>

            {/* Second Image Container */}
            <div className="about-image-container">
                <img
                    src={importanceImage}
                    alt="Graphic showing the importance of NCS co-benefits"
                    className="about-page-image"
                />
            </div>
            <div className="home-button-container">
                <button onClick={() => navigate('/map')} className="map-button">
                    <span>Explore the Data</span>
                    <span className="button-icon">
                        &#10140;
                    </span>
                </button>
            </div>

        </div>
    );
}

export default AboutPage;
