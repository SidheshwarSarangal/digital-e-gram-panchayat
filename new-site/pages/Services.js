import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserRole, getUserData } from "../src/functions/user";
import {
    createService,
    updateService,
    deleteService,
    getAllServices,
} from "../src/functions/services";
import CreateServicePopup from "../components/CreateServicePopup";
import { createApplication } from "../src/functions/applications";
import "../css/Services.css";

const Services = () => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState("");
    const [formData, setFormData] = useState({
        serviceName: "",
        officerName: "",
        gramMemberName: "",
        departmentName: "",
        description: "",
    });
    const [popstate, setPopState] = useState("");
    const popupRef = useRef(null);

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [userData, setUserData] = useState(null);
    const [userDescription, setUserDescription] = useState("");

    useEffect(() => {
        const fetchServices = async () => {
            const result = await getAllServices();
            if (result.success) {
                const formattedServices = result.services
                    .filter((service) => service && service.id)
                    .map((service) => ({
                        ...service,
                        createdAt: service.createdAt?.seconds
                            ? new Date(service.createdAt.seconds * 1000) // <- This is the issue
                            : "N/A",
                        // Remove serviceStartingDate handling
                    }));
                setServices(formattedServices);
            } else {
                setError(result.error);
            }
            setLoading(false);
        };

        fetchServices();
    }, [isPopupVisible]);

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

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const openPopup = () => {
        setIsPopupVisible(true);
    };

    const closePopup = () => {
        setIsPopupVisible(false);
        setPopState("");
    };

    const handlePopState = (value) => {
        setPopState(value);
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCreateServiceSubmit = async (e) => {
        e.preventDefault();
        if (
            !formData.serviceName ||
            !formData.officerName ||
            !formData.gramMemberName ||
            !formData.departmentName ||
            !formData.description
        ) {
            alert("Please fill in all fields.");
            return;
        }


        // No serviceStartingDate being added here
        const newService = {
            ...formData,
        };

        const result = await createService(newService);
        if (result.success) {
            setServices((prevServices) => [...prevServices, result.service]);
            alert("Service created successfully!");
            closePopup();
        } else {
            alert("Error creating service.");
        }
    };

    const handleEditServiceSubmit = async (e) => {
        e.preventDefault();
        if (!selectedService || !selectedService.id) {
            alert("No service selected or missing ID.");
            return;
        }
        const result = await updateService(selectedService.id, selectedService);
        if (result.success) {
            setServices((prevServices) =>
                prevServices.map((service) =>
                    service.id === selectedService.id
                        ? { ...service, ...selectedService }
                        : service
                )
            );
            alert("Service updated successfully!");
            closePopup();
        } else {
            alert("Error updating service.");
        }
    };

    const handleDeleteService = async () => {
        if (!selectedService || !selectedService.id) return;
        const confirmDelete = window.confirm("Are you sure you want to delete this service?");
        if (confirmDelete) {
            const result = await deleteService(selectedService.id);
            if (result.success) {
                setServices((prevServices) =>
                    prevServices.filter((service) => service.id !== selectedService.id)
                );
                alert("Service deleted successfully!");
                closePopup();
            } else {
                alert("Error deleting service.");
            }
        }
    };

    const handleApplyYes = async () => {
        if (!selectedService || !selectedService.id) {
            alert("No service selected for application.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("You need to be logged in to apply for a service.");
            return;
        }

        const result = await createApplication(selectedService, userData, userDescription);
        if (result.success) {
            alert("Application submitted successfully!");
            closePopup();
        } else {
            alert(result.error || "Error submitting application.");
        }
    };

    const handleApplyNo = () => {
        closePopup();
        alert("Application process canceled.");
    };

    return (
        <div className="services-page">
            <div className="services-page-sidebar">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/applications">Applications</Link></li>
                </ul>
            </div>

            <div className="services-page-main-content">
                {isLoggedIn ? (
                    <div className="services-page-logged-in-content">
                        <h1>Welcome back!</h1>
                        <p>You are logged in.</p>
                        <p>{userRole}</p>

                        {(userRole === "admin" || userRole === "staff") && (
                            <div className="services-page-admin-content">
                                <h1>Our Services</h1>
                                {loading ? (
                                    <p>Loading services...</p>
                                ) : services.length > 0 ? (
                                    <ul>
                                        {services.map((service) => (
                                            <li
                                                key={service.id}
                                                onClick={() => {
                                                    setPopState("admineditservice");
                                                    setSelectedService(service);
                                                    openPopup();
                                                }}
                                            >
                                                <h2>{service.serviceName}</h2>
                                                <p><strong>Department:</strong> {service.departmentName}</p>
                                                <p><strong>Officer Name:</strong> {service.officerName}</p>
                                                <p><strong>Gram Member Name:</strong> {service.gramMemberName}</p>
                                                <p><strong>Description:</strong> {service.description}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No services available at the moment.</p>
                                )}
                                <div
                                    className="services-page-plus-icon"
                                    onClick={() => {
                                        setPopState("admincreateservice");
                                        openPopup();
                                    }}
                                >
                                    <span>+</span>
                                </div>
                            </div>
                        )}

                        {userRole === "user" && (
                            <div className="services-page-admin-content">
                                <h1>Our Services</h1>
                                {loading ? (
                                    <p>Loading services...</p>
                                ) : services.length > 0 ? (
                                    <ul>
                                        {services.map((service) => (
                                            <li
                                                key={service.id}
                                                onClick={() => {
                                                    setPopState("applyservice");
                                                    setSelectedService(service);
                                                    openPopup();
                                                }}
                                            >
                                                <h2>{service.serviceName}</h2>
                                                <p><strong>Department:</strong> {service.departmentName}</p>
                                                <p><strong>Officer Name:</strong> {service.officerName}</p>
                                                <p><strong>Gram Member Name:</strong> {service.gramMemberName}</p>
                                                <p><strong>Description:</strong> {service.description}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No services available at the moment.</p>
                                )}

                            </div>
                        )}

                        {isPopupVisible && popstate === "admincreateservice" && (
                            <CreateServicePopup
                                formData={formData}
                                handleInputChange={handleInputChange}
                                handleCreateServiceSubmit={handleCreateServiceSubmit}
                                closePopup={closePopup}
                                popupRef={popupRef}
                            />
                        )}

                        {isPopupVisible && popstate === "admineditservice" && selectedService && (
                            <div className="services-page-popup-overlay">
                                <div className="services-page-popup-box" ref={popupRef}>
                                    <button className="services-page-popup-close" onClick={closePopup}>X</button>
                                    <h2>Edit Service</h2>
                                    <form onSubmit={handleEditServiceSubmit}>
                                        <div>
                                            <label>Service Name</label>
                                            <input
                                                type="text"
                                                name="serviceName"
                                                value={selectedService.serviceName}
                                                onChange={(e) =>
                                                    setSelectedService({
                                                        ...selectedService,
                                                        serviceName: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <label>Officer Name</label>
                                            <input
                                                type="text"
                                                name="officerName"
                                                value={selectedService.officerName}
                                                onChange={(e) =>
                                                    setSelectedService({
                                                        ...selectedService,
                                                        officerName: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <label>Gram Member Name</label>
                                            <input
                                                type="text"
                                                name="gramMemberName"
                                                value={selectedService.gramMemberName}
                                                onChange={(e) =>
                                                    setSelectedService({
                                                        ...selectedService,
                                                        gramMemberName: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <label>Department Name</label>
                                            <input
                                                type="text"
                                                name="departmentName"
                                                value={selectedService.departmentName}
                                                onChange={(e) =>
                                                    setSelectedService({
                                                        ...selectedService,
                                                        departmentName: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <label>Description</label>
                                            <textarea
                                                name="description"
                                                value={selectedService.description}
                                                onChange={(e) =>
                                                    setSelectedService({
                                                        ...selectedService,
                                                        description: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="services-page-popup-actions">
                                            <button type="submit">Update Service</button>
                                            <button
                                                type="button"
                                                onClick={handleDeleteService}
                                                className="services-page-popup-delete"
                                            >
                                                Delete Service
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {isPopupVisible && popstate === "applyservice" && selectedService && (
                            <div className="services-page-popup-overlay">
                                <div className="services-page-popup-box" ref={popupRef}>
                                    <button className="services-page-popup-close" onClick={closePopup}>X</button>
                                    <h2>Apply for Service</h2>
                                    <p>Are you sure you want to apply for this service?</p>

                                    <div>
                                        <label>Description</label>
                                        <textarea
                                            name="userDescription"
                                            value={userDescription}
                                            onChange={(e) => setUserDescription(e.target.value)}
                                            placeholder="Enter any additional information or request."
                                        />
                                    </div>
                                    <div className="services-page-popup-actions">
                                        <button type="button" onClick={handleApplyYes}>
                                            Yes, Apply
                                        </button>
                                        <button type="button" onClick={handleApplyNo}>
                                            No, Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                ) : (
                    <div className="services-page-not-logged-in">
                        <h1>Please log in to view and apply for services</h1>
                        <Link to="/login">Login</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Services;
