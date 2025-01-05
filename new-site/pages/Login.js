import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Ensure React Router is used for navigation
import { getUserByIdAndRole } from "../src/functions/user"; // Import the getUserByIdAndRole function
import "../css/Login.css";


const Login = () => {
    const [role, setRole] = useState("user"); // Default role is 'user'
    const [email, setemail] = useState(""); // Store user ID (email in this case)
    const [password, setPassword] = useState(""); // Store password
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [secret, setSecretKey] = useState("");
    const navigate = useNavigate(); // Navigation for redirection

    const fetchSecretData = () => {
        const secretKey = "grampanchayat1234";
        if (secretKey) {
            // Use the secret key for an API call, etc.
            setSecretKey(secretKey);
            console.log('Using secret key:', secretKey);
        } else {
            console.error('Secret key is not defined');
        }
    };

    
    const handleLogin = async (e) => {
        e.preventDefault();
        fetchSecretData();
        const secret="grampanchayat1234";
        console.log("frontend",secret);

        // Validate input fields
        if (!email || !password) {
            setErrorMessage("Please fill in all the fields.");
            return;
        }

        try {
            // Call the backend function
            const response = await getUserByIdAndRole(email, role, password);

            if (response.error) {
                setErrorMessage(response.error); // Display error message
                setSuccessMessage("");
            } else {
                setSuccessMessage("Login successful!");
                setErrorMessage("");
                // Save the token in localStorage
                localStorage.setItem("token", response.token);
                navigate("/"); // Redirect to home page
            }
        } catch (error) {
            console.error("Login error:", error);
            setErrorMessage("An error occurred during login.");
        }
    };

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    return (
        <div id="login-page">
            <div className="login-page-sidebar">
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/services">Services</Link>
                    </li>
                </ul>
            </div>

            <div className="login-page-container">
                <h1 id="login-page-heading">Log In</h1>

                {/* Role Selection */}
                <div className="login-page-role-selection">
                    <label>
                        <input
                            type="radio"
                            name="role"
                            value="admin"
                            checked={role === "admin"}
                            onChange={handleRoleChange}
                        />
                        Admin
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="role"
                            value="staff"
                            checked={role === "staff"}
                            onChange={handleRoleChange}
                        />
                        Staff
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="role"
                            value="user"
                            checked={role === "user"}
                            onChange={handleRoleChange}
                        />
                        User
                    </label>
                </div>

                <form className="login-page-login-form" id="ligin-page-login-form" onSubmit={handleLogin}>
                    <label className="login-page-form-label" id="login-page-label-email">
                        Email Address:
                        <br/>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setemail(e.target.value)}
                            required
                        />
                        
                    </label>
                    <br />
                    <label className="login-page-form-label" id="login-page-label-password">
                        Password:
                        <br/>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    <br />
                    <button type="submit" className="login-page-submit-button" id="login-page-login-button">Log In</button>
                </form>

                {errorMessage && <p className="login-page-error-message">{errorMessage}</p>}
                {successMessage && <p className="login-page-success-message">{successMessage}</p>}

                {/* Create Account Link */}
                <div className="login-page-create-account">
                    <p>Don't have an account? <Link to="/account-creation">Create One</Link>.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
