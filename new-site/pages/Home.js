import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/Home.css";
import GramInfo from "../components/GramInfo";

const images = [
    "https://www.karnataka.com/wp-content/uploads/2007/07/panchayat-raj.jpg",
    "https://live.staticflickr.com/7136/7514220330_e37a70a139_b.jpg",
    "https://img.jagranjosh.com/images/2021/October/5102021/gram%20panchayat.jpg",
    "https://wallpapercave.com/wp/wp6735981.png",
    "https://assets.thehansindia.com/hansindia-bucket/5797_Panchayat.jpg",
    "https://img.etimg.com/thumb/msid-99713649,width-1200,height-630,imgsize-476802,overlay-economictimes/photo.jpg"
];


const Home = () => {
    const [showGramInfo, setShowGramInfo] = useState(false);
    const [menuActive, setMenuActive] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                (prevIndex + 1) % images.length // Loop through images
            );
        }, 8000); // Change image every 8 seconds

        return () => clearInterval(interval); // Clean up the interval on unmount
    }, []);

    useEffect(() => {
        // Check for token in localStorage or another secure place
        const token = localStorage.getItem("token"); // Replace this with your token-checking logic
        setIsLoggedIn(!!token); // Set true if token exists, false otherwise
    }, []);

    const toggleGramInfo = () => {
        setShowGramInfo((prevShow) => !prevShow);
    };

    const toggleMenu = () => {
        setMenuActive((prev) => !prev);
    };

    return (
        <div className="home-container">
            <header className="top-bar">
                <div className="logo" >GRAM PANCHAYAT</div>
                <button className="menu-toggle" onClick={toggleMenu}>
                    ☰
                </button>
                <nav>
                    <ul className={`nav-list ${menuActive ? "active" : ""}`}>
                        <li><Link to="/services">Services</Link></li>

                        {isLoggedIn ? (
                            <>
                                <li><Link to="/applications">Applications</Link></li>

                                <li>
                                    <Link to="/profile">
                                        Profile
                                    </Link>
                                </li>
                                <li><Link to="/logout">Log Out</Link></li>
                            </>
                        ) : (
                            <li><Link to="/login">Log In</Link></li>
                        )}
                    </ul>
                </nav>
            </header>

            <div style={{
                marginTop: showGramInfo ? "15em" : "15em", 
                marginBottom: showGramInfo ? "0" : "5em"
            }}className="upper-section">
                <section className="about-section">
                    <div className="about-content">
                        <h2 className="logo">ABOUT GRAM PANCHAYAT</h2>
                        <p className="logo">
                            Learn about the Gram Panchayat initiatives and its role in improving community services.
                        </p>
                        <button id="gram-info-btn" onClick={toggleGramInfo}>
                            {showGramInfo ? "Hide Information" : "Gram Information"}
                        </button>
                    </div>
                    <div className="about-image-container">
                        <img
                            src={images[currentImageIndex]}
                            alt="Gram Panchayat"
                            className="about-image"
                            style={{
                                transition: "opacity 1s ease-in-out", // Smooth transition
                                opacity: 1
                            }}
                        />
                    </div>


                </section>

                {showGramInfo && <GramInfo />}
            </div>




            <footer className="footer">
                <p>Developer: <strong>Sidheshwar</strong></p>
                <p>Web app for managing Gram Panchayat services.</p>
            </footer>
        </div>
    );
};

export default Home;
