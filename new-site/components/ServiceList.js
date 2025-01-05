/*import React, { useEffect, useState } from "react";
import { getAllServices } from "../src/functions/services"; // Update with the correct path to your getAllServices function

const ServicesList = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            const result = await getAllServices();
            if (result.success) {
                const formattedServices = result.services.map(service => ({
                    ...service,
                    createdAt: service.createdAt?.seconds
                        ? new Date(service.createdAt.seconds * 1000).toLocaleString()
                        : "N/A"
                }));
                setServices(formattedServices);
            } else {
                setError(result.error);
            }
            setLoading(false);
        };

        fetchServices();
    }, []);

    if (loading) return <p>Loading services...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Our Services</h1>
            {services.length > 0 ? (
                <ul>
                    {services.map(service => (
                        <li key={service.id} style={{ marginBottom: "1rem" }}>
                            <h2>{service.serviceName}</h2>
                            <p><strong>Department:</strong> {service.departmentName}</p>
                            <p><strong>Officer Name:</strong> {service.officerName}</p>
                            <p><strong>Gram Member Name:</strong> {service.gramMemberName}</p>
                            <p><strong>Created At:</strong> {service.createdAt}</p>
                            <p><strong>Description:</strong> {service.description}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No services available at the moment.</p>
            )}
        </div>
    );
};

export default ServicesList;
*/

import React, { useEffect, useState } from "react";
import { getAllServices } from "../src/functions/services"; // Update with the correct path to your getAllServices function

const ServicesList = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            const result = await getAllServices();
            if (result.success) {
                const formattedServices = result.services.map(service => ({
                    ...service,
                    createdAt: service.createdAt?.seconds
                        ? new Date(service.createdAt.seconds * 1000).toLocaleString()
                        : "N/A"
                }));
                setServices(formattedServices);
            } else {
                setError(result.error);
            }
            setLoading(false);
        };

        fetchServices();
    }, []);

    if (loading) return <p>Loading services...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Our Services</h1>
            {services.length > 0 ? (
                <ul>
                    {services.map(service => (
                        <li key={service.id} style={{ marginBottom: "1rem" }}>
                            <h2>{service.serviceName}</h2>
                            <p><strong>Department:</strong> {service.departmentName}</p>
                            <p><strong>Officer Name:</strong> {service.officerName}</p>
                            <p><strong>Gram Member Name:</strong> {service.gramMemberName}</p>
                            <p><strong>Created At:</strong> {service.createdAt}</p>
                            <p><strong>Description:</strong> {service.description}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No services available at the moment.</p>
            )}
        </div>
    );
};

export default ServicesList;