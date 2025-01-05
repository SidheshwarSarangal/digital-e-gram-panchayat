import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "../css/Logout.css";

const Logout = () => {
    const handleYes = () => {
        // Remove token from localStorage
        localStorage.removeItem("token");
    };

    return (
        <div id="logout-page">
            <div className="sidebar">
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/services">Services</Link>
                    </li>
                    <li>
                        <Link to="/applications">Applications</Link>
                    </li>
                </ul>
            </div>
            <h1 id="logout-page-heading">Log Out</h1>
            <p id="logout-page-message">Are you sure you want to log out?</p>
            <div id="logout-page-buttons">
                <Link to="/" onClick={handleYes}>
                    <button>Yes</button>
                </Link>
                <Link to="/">
                    <button>No</button>
                </Link>
            </div>
        </div>
    );
};

export default Logout;
