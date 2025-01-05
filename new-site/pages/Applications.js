import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../css/Applications.css";
import { getUserRole, getUserData } from "../src/functions/user";
import { getAllApplications, getApplicationsByApplicant, editApplication, deleteApplication, updateApplicationStatus } from "../src/functions/applications";

const Applications = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState("");
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [popstate, setPopState] = useState("");
    const popupRef = useRef(null);
    const [selectedApplication, setSelectedApplication] = useState(null); // Store selected application
    const [updatedData, setUpdatedData] = useState({
        userDescription: "", // Initialize userDescription instead of description
    });

    // Format Firestore timestamp into a readable date
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return "";
        if (timestamp instanceof Date) {
            return timestamp.toLocaleDateString();  // If already a Date object
        } else if (timestamp.seconds && timestamp.nanoseconds) {
            return new Date(timestamp.seconds * 1000).toLocaleDateString();  // Convert Firestore timestamp to date
        }
        return "";  // Return empty string if not a valid timestamp
    };

    // Fetch User Data (including email, name, etc.)
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                const response = await getUserData(token);
                if (response.success) {
                    setUserData(response.userData);
                } else {
                    console.error(response.error);
                }
            }
        };
        fetchUserData();
    }, []);

    // Fetch User Role from Token
    useEffect(() => {
        const fetchUserRole = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                const response = await getUserRole(token);
                if (response.success) {
                    setUserRole(response.role);
                } else {
                    console.error(response.error);
                }
            }
        };
        fetchUserRole();
    }, []);

    // Handle Status Update (Placeholder)
    const handleStatusUpdate = async (newStatus) => {
        const result = await updateApplicationStatus(selectedApplication.id, newStatus);
        if (result.success) {
            console.log(result.success);
        } else {
            console.error(result.error);
        }
    };

    const handlePopState = (value, application) => {
        setPopState(value);
        setSelectedApplication(application); // Set the selected application to display in the popup
        setUpdatedData({
            userDescription: application.userDescription, // Set userDescription in updatedData
        }); // Set the initial data in updatedData
    };

    const openPopup = () => {
        setIsPopupVisible(true);
    };

    const closePopup = () => {
        setIsPopupVisible(false);
    };

    const handleClickOutside = (e) => {
        if (popupRef.current && !popupRef.current.contains(e.target)) {
            closePopup();
        }
    };

    useEffect(() => {
        if (isPopupVisible) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [isPopupVisible]);

    // Fetch Applications based on Role
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (userRole === "user" && userData) {
                    console.log("Fetching applications for user");
                    const result = await getApplicationsByApplicant(userData.email, userData.name);
                    if (result.success) {
                        console.log("xxxxxx", result.applications.applicationDate)

                        const formattedApplications = result.applications.map((application) => ({
                            ...application,
                            // applicationDate: formatTimestamp(application.applicationDate), // Format applicationDate
                            // serviceStartingDate: formatTimestamp(application.serviceStartingDate), // Format serviceStartingDate
                        }));
                        console.log("formatted", formattedApplications);
                        setApplications(formattedApplications);
                    } else {
                        setError(result.error);
                    }
                } else if (userRole === "admin" || userRole === "staff") {
                    console.log("Fetching applications for admin/staff");
                    const result = await getAllApplications();
                    if (result.success) {
                        const formattedApplications = result.applications.map((application) => ({
                            ...application,
                            //applicationDate: formatTimestamp(application.applicationDate), // Format applicationDate
                            //   serviceStartingDate: formatTimestamp(application.serviceStartingDate), // Format serviceStartingDate
                        }));
                        setApplications(formattedApplications);
                    } else {
                        setError(result.error);
                    }
                }
            } catch (error) {
                console.error("Error fetching applications:", error);
                setError("Failed to fetch applications");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userRole, userData, isPopupVisible]);

    // Check if the user is logged in
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    // Handle Application Delete
    const handleDelete = async () => {
        try {
            const result = await deleteApplication(selectedApplication.id);
            if (result.success) {
                alert("Application deleted successfully!");
                closePopup(); // Close the popup after deleting
                // Optionally, you can also update the applications state to reflect the deletion
                setApplications(applications.filter(application => application.id !== selectedApplication.id));
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error("Error deleting application:", error);
            alert("Error deleting application.");
        }
    };

    // Handle Application Update
    const handleUpdate = async (e) => {
        e.preventDefault();

        // Check if the application status is "applied"
        if (selectedApplication.status === "applied") {
            try {
                // Log updated data to confirm it's correct
                console.log("Updating application", updatedData);

                // Pass updatedData which contains userDescription
                const result = await editApplication(selectedApplication.id, updatedData);

                if (result.success) {
                    alert("Application updated successfully!");
                    closePopup(); // Close the popup after successful update
                } else {
                    alert("Failed to update application.");
                }
            } catch (error) {
                console.error("Error updating application:", error);
                alert("Error updating application.");
            }
        } else {
            alert("Changes cannot be updated because the application is not in 'applied' status.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData((prevData) => ({
            ...prevData,
            [name]: value,  // This will now update the userDescription field
        }));
    };

    // Loading and Error Handling
    if (loading) {
        return <div>Loading applications...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="applications-page">
            <div className="sidebar">
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/services">Services</Link>
                        </li>
                    </ul>
                </nav>
            </div>

            <div className="application-page-main-content">
                {isLoggedIn ? (
                    <div>
                        <p>You are logged in as: <strong>{userRole}</strong></p>

                        {/* Admin View */}
                        {userRole === "admin" && (
                            <div>
                                <h2>Admin Page</h2>
                                <h1>Applications List</h1>
                                {applications.length > 0 ? (
                                    <ul className="application-page-application-list">
                                        {applications.map((application) => (
                                            <li key={application.id} className="application-page-application-card" onClick={() => { handlePopState("adminside", application); openPopup(); }}>
                                                <h2>{application.serviceName}</h2>
                                                <p><strong>Applicant Name:</strong> {application.applicantName}</p>
                                                <p><strong>Email:</strong> {application.applicantemail}</p>
                                                <p><strong>Application Date:</strong> {application.applicationDate}</p>
                                                <p><strong>Department:</strong> {application.departmentName}</p>
                                                <p><strong>Officer Name:</strong> {application.officerName}</p>
                                                <p><strong>Gram Member Name:</strong> {application.gramMemberName}</p>
                                                <p><strong>User Description:</strong> {application.userDescription}</p>
                                                <p><strong>Description:</strong> {application.description}</p>
                                                <p><strong>Status:</strong> {application.status}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No applications available at the moment.</p>
                                )}
                            </div>
                        )}

                        {/* Staff View */}
                        {userRole === "staff" && (
                            <div>
                                <h2>Staff Page</h2>
                                <h1>Applications List</h1>
                                {applications.length > 0 ? (
                                    <ul className="application-page-application-list">
                                        {applications.map((application) => (
                                            <li key={application.id} className="application-page-application-card" onClick={() => { handlePopState("staffside", application); openPopup(); }}>
                                                <h2>{application.serviceName}</h2>
                                                <p><strong>Applicant Name:</strong> {application.applicantName}</p>
                                                <p><strong>Email:</strong> {application.applicantemail}</p>
                                                <p><strong>Application Date:</strong> {application.applicationDate}</p>
                                                <p><strong>Department:</strong> {application.departmentName}</p>
                                                <p><strong>Officer Name:</strong> {application.officerName}</p>
                                                <p><strong>Gram Member Name:</strong> {application.gramMemberName}</p>
                                                <p><strong>User Description:</strong> {application.userDescription}</p>
                                                <p><strong>Description:</strong> {application.description}</p>
                                                <p><strong>Status:</strong> {application.status}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No applications available at the moment.</p>
                                )}
                            </div>
                        )}

                        {/* User View */}
                        {userRole === "user" && (
                            <div>
                                <h2>User Page</h2>
                                <h1>Applications List</h1>
                                {applications.length > 0 ? (
                                    <ul className="application-page-application-list">
                                        {applications.map((application) => (
                                            <li key={application.id} className="application-page-application-card" onClick={() => { handlePopState("userside", application); openPopup(); }}>
                                                <h2>{application.serviceName}</h2>
                                                <p><strong>Applicant Name:</strong> {application.applicantName}</p>
                                                <p><strong>Email:</strong> {application.applicantemail}</p>
                                                <p><strong>Application Date:</strong> {application.applicationDate}</p>
                                                <p><strong>Department:</strong> {application.departmentName}</p>
                                                <p><strong>Officer Name:</strong> {application.officerName}</p>
                                                <p><strong>Gram Member Name:</strong> {application.gramMemberName}</p>
                                                <p><strong>Service Starting Date:</strong> {application.serviceStartingDate}</p>
                                                <p><strong>User Description:</strong> {application.userDescription}</p>
                                                <p><strong>Description:</strong> {application.description}</p>
                                                <p><strong>Status:</strong> {application.status}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No applications available at the moment.</p>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <p>You are not logged in. Please <Link to="/login">log in</Link>.</p>
                    </div>
                )}
            </div>

            {/* Popup */}
            {isPopupVisible && selectedApplication && (
                <div className="application-page-popup" ref={popupRef}>
                    <h2>{selectedApplication.serviceName}</h2>
                    <p><strong>Applicant Name:</strong> {selectedApplication.applicantName}</p>
                    <p><strong>Email:</strong> {selectedApplication.applicantemail}</p>
                    <p><strong>Application Date:</strong> {formatTimestamp(selectedApplication.applicationDate)}</p>
                    <p><strong>Status:</strong> {selectedApplication.status}</p>

                    {/* Conditional rendering of the update form */}
                    {popstate === "userside" && (
                        <div>
                            <h3>Update Application</h3>
                            <form onSubmit={handleUpdate}>
                                <div>
                                    <label>User Description:</label>
                                    <textarea
                                        name="userDescription"
                                        value={updatedData.userDescription}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <button type="submit">Update</button>
                                </div>
                            </form>
                            <div className="delete-button-container">
                                <button onClick={handleDelete} className="delete-button">Delete Application</button>
                            </div>
                        </div>

                    )}

                    {/* Conditional rendering of the delete button */}
                    {popstate === "adminside" && (
                        <div className="delete-button-container">
                            <button onClick={handleDelete} className="delete-button">Delete Application</button>
                        </div>
                    )}

                    {popstate === "staffside" && (
                        <div className="application-page-staffside">
                            <div>
                                Do you want to set the application as Processing or Closed?
                            </div>
                            <button onClick={() => handleStatusUpdate("processing")}>Accepted and Processing</button>
                            <button onClick={() => handleStatusUpdate("closed")}>Closed</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Applications;  