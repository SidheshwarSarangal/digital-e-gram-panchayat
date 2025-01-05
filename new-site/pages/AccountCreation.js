import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate for redirection
import { addUser } from '../src/functions/user'; // Import the addUser function
import "../css/AccountCreation.css";


const AccountCreation = () => {
  const [role, setRole] = useState("user"); // Default role is 'user'
  const [fullName, setFullName] = useState(""); // Store full name
  const [email, setEmail] = useState(""); // Store email
  const [password, setPassword] = useState(""); // Store password
  const [confirmPassword, setConfirmPassword] = useState(""); // Store confirm password
  const [error, setError] = useState(""); // Store error messages

  const navigate = useNavigate(); // Initialize navigation to redirect after success

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password and confirm password
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!fullName || !email || !password) {
      setError("Please fill in all the fields.");
      return;
    }

    // Prepare user data object
    const user = {
      name: fullName,
      email: email,
      password: password,
      role: role, // Add role to the user data
    };

    try {
      // Call addUser function to add data to Firestore
      await addUser(user);

      // Redirect to home page after successful account creation
      navigate("/login");
    } catch (e) {
      setError("Error creating account, please try again.");
    }
  };

  return (
    <div id="account-creation-page">
      <div className="account-creation-sidebar">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/services">Services</Link></li>
        </ul>
      </div>

      <div className="account-creation-container">
        <h1 id="account-creation-heading">Account Creation</h1>
        <p id="account-creation-description">
          Create an account to access all the features of the Gram Panchayat portal.
        </p>

        {/* Role Selection */}
        <div className="account-creation-role-selection">
          <h3>Select Role</h3>
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

        {/* Role Dropdown for Small Screens */}
        <div className="account-creation-role-selection-dropdown">
          <select
            id="account-creation-role-dropdown"
            value={role}
            onChange={handleRoleChange}
          >
            <option value="user">User</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {error && <p className="account-creation-error-message">{error}</p>} {/* Display error message */}
        <form className="account-creation-form" onSubmit={handleSubmit}>
          <label className="account-creation-form-label" id="account-creation-label-full-name">
            Full Name:
            <input
              type="text"
              name="fullName"
              className="account-creation-form-input"
              id="input-full-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)} // Update state on input change
            />
          </label>
          <br />
          <label className="account-creation-form-label" id="account-creation-label-email">
            Email Address:
            <input
              type="email"
              name="email"
              className="account-creation-form-input"
              id="account-creation-input-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update state on input change
            />
          </label>
          <br />
          <label className="account-creation-form-label" id="account-creation-label-password">
            Password:
            <input
              type="password"
              name="password"
              className="account-creation-form-input"
              id="account-creation-input-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update state on input change
            />
          </label>
          <br />
          <label className="account-creation-form-label" id="account-creation-label-confirm-password">
            Confirm Password:
            <input
              type="password"
              name="confirmPassword"
              className="account-creation-form-input"
              id="account-creation-input-confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} // Update state on input change
            />
          </label>
          <br />
          <button type="submit" className="account-creation-submit-button" id="account-creation-create-account-button">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountCreation;
