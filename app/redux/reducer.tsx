import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    client: 
    {
        // sessionUser: {},
        // menuUser: {},
        // tokenUser: "",
        selectedComponent: "",
        selectedCourse: {}
    }
}

export const ReducerSlice = createSlice({
    name: "fungindustrias-app",
    initialState,
    reducers: {
        // setUser: (state, action) => {
        //     state.client.sessionUser = action.payload || {};
        // },
        // setMenu: (state, action) => {
        //     state.client.menuUser = action.payload || {};
        // },
        // setToken: (state, action) => {
        //     state.client.tokenUser = action.payload || "";
        // },
        setSelectedComponent: (state, action) => {
            state.client.selectedComponent = action.payload || "";
        },
        setSelectedCourse: (state, action ) => {
            state.client.selectedCourse = action.payload || {};
        }
    }
})

// export const { setUser, setMenu, setToken, setSelectedComponent, setSelectedCourse } = ReducerSlice.actions;
export const { setSelectedComponent, setSelectedCourse } = ReducerSlice.actions;

export default ReducerSlice.reducer;