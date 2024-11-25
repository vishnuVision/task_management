import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    show:false
}

const dialogsSlice = createSlice({
    name:"dialog",
    initialState,
    reducers:{
        showDialog:(state)=>{
            state.show = true;
        },
        hiddenDialog:(state)=>{
            state.show = false;
        }
    }
})

export const { showDialog, hiddenDialog } =  dialogsSlice.actions;
export default dialogsSlice.reducer