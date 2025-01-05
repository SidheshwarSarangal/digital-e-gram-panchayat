import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'; // Import Firestore methods

const createService = async (serviceData) => {
    try {
        const { officerName, gramMemberName, departmentName, description, serviceName } = serviceData;

        // Validate required fields
        if (!officerName || !gramMemberName || !departmentName || !description || !serviceName) {
            console.error("Missing required fields");
            return { error: "All fields are required." };
        }

        // Create the document in Firestore without the serviceStartingDate field
        const docRef = await addDoc(collection(db, "services"), {
            officerName,
            gramMemberName,
            departmentName,
            description,
            serviceName,
        });

        console.log("Service created with ID: ", docRef.id);

        // Return the full service data with the ID included
        return {
            success: true,
            service: {
                id: docRef.id, // Add the Firestore document ID here
                officerName,
                gramMemberName,
                departmentName,
                description,
                serviceName,
            },
        };
    } catch (e) {
        console.error("Error creating service: ", e);
        return { error: "Error creating service." };
    }
};

const getAllServices = async () => {
    try {
        // Get all documents from the "services" collection
        const querySnapshot = await getDocs(collection(db, "services"));

        // Map the documents to an array of service data without any date fields
        const servicesList = querySnapshot.docs.map(doc => {
            const serviceData = doc.data();

            return {
                id: doc.id,
                ...serviceData,
            };
        });

        return { success: true, services: servicesList };
    } catch (e) {
        console.error("Error fetching services: ", e);
        return { error: "An error occurred while fetching services." };
    }
};

const updateService = async (serviceId, updatedData) => {
    try {
        const serviceRef = doc(db, "services", serviceId); // Get a reference to the service document

        // Update the service data
        await updateDoc(serviceRef, updatedData);

        console.log("Service updated with ID: ", serviceId);
        return { success: "Service updated successfully." };
    } catch (e) {
        console.error("Error updating service: ", e);
        return { error: "Error updating service." };
    }
};

// Function to delete a service from Firestore
const deleteService = async (serviceId) => {
    try {
        const serviceRef = doc(db, "services", serviceId); // Get a reference to the service document

        // Delete the service document
        await deleteDoc(serviceRef);

        console.log("Service deleted with ID: ", serviceId);
        return { success: "Service deleted successfully." };
    } catch (e) {
        console.error("Error deleting service: ", e);
        return { error: "Error deleting service." };
    }
};

export { createService, getAllServices, updateService, deleteService };
