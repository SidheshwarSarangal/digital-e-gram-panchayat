import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom"; // Ensure React Router is used for navigation
import { getUserRole, getUserData } from '../src/functions/user'; // Adjust import paths as needed
import { getApplicationsByApplicant } from '../src/functions/applications';
import "../css/Profile.css";

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");


    useEffect(() => {
        // Fetch user role and data based on the token
        const fetchData = async () => {
            const roleResponse = await getUserRole(token);
            if (roleResponse.error) {
                setError(roleResponse.error);
                return;
            }

            const userResponse = await getUserData(token);
            if (userResponse.error) {
                setError(userResponse.error);
                return;
            }

            setUserRole(roleResponse.role);
            setUserData(userResponse.userData);

            // If userRole is "user", fetch the applications
            if (roleResponse.role === 'user') {
                const applicationsResponse = await getApplicationsByApplicant(
                    userResponse.userData.email,
                    userResponse.userData.name
                );
                if (applicationsResponse.error) {
                    setError(applicationsResponse.error);
                    return;
                }
                setApplications(applicationsResponse.applications);
            }
        };

        fetchData();
    }, [token]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-page">
             <div className="profile-page-sidebar">
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/services">Services</Link>
                    </li>
                </ul>
            </div>
            <h1>Profile Page</h1>
            <div className="profile-page--info">
                <h2>User Information</h2>
                <p><strong>Name:</strong> {userData.name}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Role:</strong> {userRole}</p>
            </div>

            {userRole === 'user' && applications.length > 0 && (
                <div className="profile-page-applications">
                    <h2>Your Applications</h2>
                    <ul>
                        {applications.map((application) => (
                            <li key={application.id}>
                                <div>
                                    <h3>Application in Department {application.departmentName}</h3>
                                    <p>Description: {application.userDescription}</p>
                                    <p>Date Applied: {new Date(application.serviceStartingDate).toLocaleDateString()}</p>
                                    <p>Status: {application.status}</p>

                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {userRole === 'user' && applications.length === 0 && (
                <div className="profile-page-no-applications">
                    <p>You have not applied for any jobs yet.</p>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
