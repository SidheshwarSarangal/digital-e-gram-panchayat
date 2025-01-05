import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Applications from "../pages/Applications";
import Services from "../pages/Services";
import AccountCreation from "../pages/AccountCreation";
import ProfilePage from "../pages/ProfilePage";
import Login from "../pages/Login";
import Logout from "../pages/Logout";

// Firebase imports
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
require('dotenv').config();

console.log("procesenvkey",process.env)

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/services" element={<Services />} />
                <Route path="/account-creation" element={<AccountCreation />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
            </Routes>
        </Router>
    );
};

export default App;
