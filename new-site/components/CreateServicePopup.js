import React from "react";
import ReactDOM from "react-dom";

const CreateServicePopup = ({ formData, handleInputChange, handleCreateServiceSubmit, closePopup, popupRef }) => {
    return ReactDOM.createPortal(
        <div className="services-page-popup-overlay">
            <div className="services-page-popup-box" ref={popupRef}>
                <button className="services-page-popup-close" onClick={closePopup}>X</button>
                <h2>Create New Service</h2>
                <form onSubmit={handleCreateServiceSubmit}>
                    <div>
                        <label htmlFor="serviceName">Service Name</label>
                        <input
                            type="text"
                            id="services-page-serviceName"
                            name="serviceName"
                            value={formData.serviceName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="officerName">Officer Name</label>
                        <input
                            type="text"
                            id="services-page-officerName"
                            name="officerName"
                            value={formData.officerName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="gramMemberName">Gram Member Name</label>
                        <input
                            type="text"
                            id="services-page-gramMemberName"
                            name="gramMemberName"
                            value={formData.gramMemberName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="departmentName">Department Name</label>
                        <input
                            type="text"
                            id="services-page-departmentName"
                            name="departmentName"
                            value={formData.departmentName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="services-page-description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                        ></textarea>
                    </div>

                    <button type="submit">Create Service</button>
                </form>
            </div>
        </div>,
        document.body // Render in the root of the document
    );
};

export default CreateServicePopup;
