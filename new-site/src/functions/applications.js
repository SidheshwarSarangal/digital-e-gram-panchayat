import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, getDoc, updateDoc, query, where, doc, deleteDoc } from 'firebase/firestore'; // Import Firestore methods
import { format } from 'date-fns'; // Import date-fns to format dates

// Function to create a new application in Firestore
const createApplication = async (selectedService, applicantData, userDescription) => {
    try {
        const {
            id: serviceId,
            serviceName,
            officerName,
            gramMemberName,
            departmentName,
            description
        } = selectedService;

        const { email, name } = applicantData;

        // Validate required fields
        if (!serviceId || !serviceName || !email || !name) {
            console.error("Missing required fields");
            return { error: "All fields are required." };
        }

        // Format the current date as the application date and service starting date (yyyy-MM-dd)
        const applicationDate = format(new Date(), 'yyyy-MM-dd'); // Only the date, no time
        const serviceStartingDate = applicationDate; // Set service starting date to current date

        // Create application object
        const applicationData = {
            serviceId,
            serviceName,
            officerName: officerName || "N/A",
            gramMemberName: gramMemberName || "N/A",
            departmentName: departmentName || "N/A",
            description: description || "N/A",
            serviceStartingDate, // Set to current date
            applicantName: name,
            applicantemail: email,
            applicationDate,
            userDescription,
            status: "applied",
        };

        // Add the application data to the "applications" collection
        const docRef = await addDoc(collection(db, "applications"), applicationData);

        console.log("Application created with ID: ", docRef.id);
        return { success: "Application created successfully.", id: docRef.id };
    } catch (e) {
        console.error("Error creating application: ", e);
        return { error: "Error creating application." };
    }
};

// Other functions remain unchanged
const getAllApplications = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "applications"));
        const applicationsList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return { success: true, applications: applicationsList };
    } catch (e) {
        console.error("Error fetching applications: ", e);
        return { error: "An error occurred while fetching applications." };
    }
};

const getApplicationsByApplicant = async (applicantEmail, applicantName) => {
    try {
        const applicationsQuery = query(
            collection(db, "applications"),
            where("applicantemail", "==", applicantEmail),
            where("applicantName", "==", applicantName)
        );

        const querySnapshot = await getDocs(applicationsQuery);
        const applicationsList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return { success: true, applications: applicationsList };
    } catch (e) {
        console.error("Error fetching applications for the applicant: ", e);
        return { error: "An error occurred while fetching applications for the given applicant." };
    }
};

const editApplication = async (applicationId, updatedData) => {
    try {
        const appDocRef = doc(db, "applications", applicationId);
        const appSnapshot = await getDoc(appDocRef);

        if (!appSnapshot.exists()) {
            return { error: "Application not found." };
        }

        const currentApplication = appSnapshot.data();

        if (currentApplication.status !== "applied") {
            return { error: "This application is currently being processed and cannot be updated." };
        }

        await updateDoc(appDocRef, updatedData);

        console.log("Application updated successfully.");
        return { success: "Application updated successfully." };
    } catch (e) {
        console.error("Error editing application: ", e);
        return { error: "Error editing application." };
    }
};

const deleteApplication = async (applicationId) => {
    try {
        const appDocRef = doc(db, "applications", applicationId);
        await deleteDoc(appDocRef);

        console.log("Application deleted successfully.");
        return { success: "Application deleted successfully." };
    } catch (e) {
        console.error("Error deleting application: ", e);
        return { error: "Error deleting application." };
    }
};

const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
        // Check if the newStatus is either 'processing' or 'closed'
        if (newStatus !== "processing" && newStatus !== "closed") {
            console.error("Invalid status. Status must be either 'processing' or 'closed'.");
            return { error: "Invalid status. Status must be either 'processing' or 'closed'." };
        }

        // Get reference to the application document in Firestore
        const appDocRef = doc(db, "applications", applicationId);

        // Update the status field in Firestore
        await updateDoc(appDocRef, { status: newStatus });

        // Log success and show alert
        console.log(`Application status updated to ${newStatus} successfully.`);
        alert(`Application status updated to ${newStatus} successfully.`);

        return { success: `Application status updated to ${newStatus} successfully.` };
    } catch (e) {
        // Handle any errors
        console.error("Error updating application status: ", e);
        alert("Error updating application status.");
        return { error: "Error updating application status." };
    }
};


export { createApplication, getAllApplications, getApplicationsByApplicant, editApplication, deleteApplication, updateApplicationStatus };
