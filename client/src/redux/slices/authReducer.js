import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user:localStorage.getItem("userToken") || false,
    isMobile:false,
    users:[]
}

const authsSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        assignUser:(state,action)=>{
            state.user = action.payload
        },
        assignIsMobile:(state)=>{
            state.isMobile = !state.isMobile
        },
        assignAllUsers:(state,action)=>{
            state.users = action.payload
        }
    }
})

export const { assignUser,assignIsMobile,assignAllUsers } =  authsSlice.actions;
export default authsSlice.reducer