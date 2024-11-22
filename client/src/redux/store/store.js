import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authReducer.js"
import notificationReducer from "../slices/notificationReducer.js"

const store = configureStore({
    reducer:{
        authReducer,
        notificationReducer
    }
})

export default store;