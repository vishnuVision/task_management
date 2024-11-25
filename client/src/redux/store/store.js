import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authReducer.js";
import notificationReducer from "../slices/notificationReducer.js";
import dialogReducer from "../slices/dialogReducer.js";

const store = configureStore({
    reducer:{
        authReducer,
        notificationReducer,
        dialogReducer
    }
})

export default store;