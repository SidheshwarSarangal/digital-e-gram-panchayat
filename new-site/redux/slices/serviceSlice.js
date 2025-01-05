import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    list: [],
};

const serviceSlice = createSlice({
    name: "services",
    initialState,
    reducers: {
        setServices(state, action) {
            state.list = action.payload;
        },
    },
});

export const { setServices } = serviceSlice.actions;
export default serviceSlice.reducer;
