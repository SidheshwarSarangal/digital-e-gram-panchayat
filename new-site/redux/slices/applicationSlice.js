import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    list: [],
};

const applicationSlice = createSlice({
    name: "applications",
    initialState,
    reducers: {
        setApplications(state, action) {
            state.list = action.payload;
        },
    },
});

export const { setApplications } = applicationSlice.actions;
export default applicationSlice.reducer;
