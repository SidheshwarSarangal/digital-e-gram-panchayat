/*
import { db } from '../firebaseConfig';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import jwt from 'jsonwebtoken'; // Import jsonwebtoken to create the token
import process from 'process';
import crypto from 'crypto'; // Built-in Node.js module



const addUser = async (user) => {
    try {
        if (!user.name || !user.email || !user.password || !user.role) {
            console.error("Missing required fields");
            return;
        }

        const docRef = await addDoc(collection(db, "users"), {
            name: user.name,
            role: user.role,
            email: user.email,
            password: user.password
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};




const getUserByIdAndRole = async (email, role, password, SECRET_KEY) => {
    if (!SECRET_KEY) {
        throw new Error("SECRET_KEY is not defined");
    }

    try {
       
        const q = query(
            collection(db, "users"),
            where("email", "==", email),
            where("role", "==", role)
        );

        const querySnapshot = await getDocs(q);

        
        if (querySnapshot.empty) {
            console.log(email);
            console.log(role);
            console.log(querySnapshot);
            return { error: "User not found with this ID and role." };
        }

        
        const user = querySnapshot.docs[0].data();
        if (user.password === password) {
            
            console.log("secret key in back", user._id,SECRET_KEY);

            const token = jwt.sign(
                {id:user }, // Payload with user info
                SECRET_KEY, // Secret key to sign the token
                { expiresIn: "24h" } // Set token expiration (optional)
            );


            return { success: "Login successful.", token }; // Return success and token
        } else {
            return { error: "Incorrect password." };
        }

    } catch (e) {
        console.error("Error fetching user: ", e);
        return { error: "An error occurred." };
    }
};


export { addUser, getUserByIdAndRole };
*/

// src/firebase/firestoreFunctions.js

import { db } from '../firebaseConfig';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import crypto from 'crypto'; // Built-in Node.js module for token generation
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

// Access the secret key from .env or fallback
const SECRET_KEY = process.env.SECRET_KEY || 'your-default-secret-key';

// Utility function to convert base64 to base64url
const base64ToBase64Url = (base64) => {
    return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
};

// Utility function to create base64url string
const toBase64Url = (input) => {
    return base64ToBase64Url(Buffer.from(input).toString('base64'));
};

// Function to generate a token using crypto
const generateToken = (payload) => {
    const header = toBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const body = toBase64Url(JSON.stringify(payload));
    const signature = base64ToBase64Url(
        crypto.createHmac('sha256', SECRET_KEY).update(`${header}.${body}`).digest('base64')
    );

    return `${header}.${body}.${signature}`;
};

// Function to verify a token
const verifyToken = (token) => {
    const [header, body, signature] = token.split('.');
    const expectedSignature = base64ToBase64Url(
        crypto.createHmac('sha256', SECRET_KEY).update(`${header}.${body}`).digest('base64')
    );

    if (signature === expectedSignature) {
        const payload = JSON.parse(Buffer.from(body, 'base64').toString());
        return { valid: true, payload };
    } else {
        return { valid: false };
    }
};

// Function to add user data
const addUser = async (user) => {
    try {
        if (!user.name || !user.email || !user.password || !user.role) {
            console.error("Missing required fields");
            return { error: "Missing required fields." };
        }

        const docRef = await addDoc(collection(db, "users"), {
            name: user.name,
            role: user.role,
            email: user.email,
            password: user.password, // Ideally, hash the password before saving it
        });
        console.log("Document written with ID: ", docRef.id);
        return { success: "User added successfully.", id: docRef.id };
    } catch (e) {
        console.error("Error adding document: ", e);
        return { error: "Error adding document." };
    }
};

// Function to get user data by email, role, and password
const getUserByIdAndRole = async (email, role, password) => {
    if (!SECRET_KEY) {
        console.error("SECRET_KEY is not defined");
        return { error: "Internal server error. Secret key missing." };
    }
    console.log(SECRET_KEY);

    try {
        // Query to find user by email and role
        const q = query(
            collection(db, "users"),
            where("email", "==", email),
            where("role", "==", role)
        );

        const querySnapshot = await getDocs(q);

        // If no user is found
        if (querySnapshot.empty) {
            return { error: "User not found with this email and role." };
        }

        // User found, check password
        const user = querySnapshot.docs[0].data();

        if (user.password === password) {
            // Generate a token if the password is correct
            const payload = { email: user.email, role: user.role, timestamp: Date.now() };
            const token = generateToken(payload);

            return { success: "Login successful.", token };
        } else {
            return { error: "Incorrect password." };
        }
    } catch (e) {
        console.error("Error fetching user: ", e);
        return { error: "An error occurred." };
    }
};

const getUserRole = async (token) => {
    if (!token) {
        return { error: "Token is required." };
    }

    const verificationResult = verifyToken(token);

    if (!verificationResult.valid) {
        return { error: "Invalid token." };
    }

    const { email } = verificationResult.payload;

    if (!email) {
        return { error: "Token does not contain a valid email." };
    }

    try {
        // Query Firestore for the user's role
        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return { error: "User not found." };
        }

        const user = querySnapshot.docs[0].data();
        return { success: true, role: user.role };
    } catch (error) {
        console.error("Error fetching user role:", error);
        return { error: "Failed to retrieve user role." };
    }
};

const getUserData = async (token) => {
    if (!token) {
        return { error: "Token is required." };
    }

    const verificationResult = verifyToken(token);

    if (!verificationResult.valid) {
        return { error: "Invalid token." };
    }

    const { email } = verificationResult.payload;

    if (!email) {
        return { error: "Token does not contain a valid email." };
    }

    try {
        // Query Firestore for the user's role
        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return { error: "User not found." };
        }

        const user = querySnapshot.docs[0].data();
        return { success: true, userData: user };
    } catch (error) {
        console.error("Error fetching user role:", error);
        return { error: "Failed to retrieve user role." };
    }
};



export { addUser, getUserByIdAndRole, verifyToken, getUserRole, getUserData };
