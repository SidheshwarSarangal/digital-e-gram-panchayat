import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import applicationReducer from "./slices/applicationSlice";
import serviceReducer from "./slices/serviceSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        applications: applicationReducer,
        services: serviceReducer,
    },
});

export default store;
