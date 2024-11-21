import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authReducer.js"

const store = configureStore({
    reducer:{
        authReducer
    }
})

export default store;