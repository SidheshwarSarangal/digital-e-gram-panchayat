import React from "react";
import "../css/GramInfo.css"; // Add specific styling if needed

const GramInfo = () => {
    return (
        <div className="gram-info-content logo">
            <h3>Gram Panchayat Information</h3>
            <p>
                The Gram Panchayat is the local self-government institution at the village level.
                It is responsible for the development and administration of the village,
                implementing government schemes, maintaining public infrastructure, and ensuring
                the well-being of its residents.
            </p>
            <p>Key functions of a Gram Panchayat include:</p>
            <ul>
                <li>Provision of basic amenities like water, sanitation, and roads.</li>
                <li>Implementation of welfare programs for the villagers.</li>
                <li>Development of local infrastructure and facilities.</li>
                <li>Management of local resources and funds.</li>
            </ul>
            <p>
                This web application aims to digitize and simplify the functioning of Gram Panchayat,
                making it easier for citizens to access services and applications.
            </p>
        </div>
    );
};

export default GramInfo;
