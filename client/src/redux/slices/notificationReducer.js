import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    comments:JSON.parse(localStorage.getItem("comments")) || [],
    subTodo:JSON.parse(localStorage.getItem("subTodo")) || [],
    notification:JSON.parse(localStorage.getItem("notification")) || [],    
}

const notificationSlice = createSlice({
    name:"notification",
    initialState,
    reducers:{
        assignComments:(state,action)=>{
            state.comments.push(action.payload);
            localStorage.setItem("comments",JSON.stringify(state.comments));
        },
        deassignComments:(state,action)=>{
            state.comments = state.comments.filter(({todo})=>todo!==action.payload);
            localStorage.setItem("comments",JSON.stringify(state.comments));
        },
        resetLocalData:()=>{
            localStorage.setItem("comments",JSON.stringify([]));
            localStorage.setItem("subTodo",JSON.stringify([]));
            localStorage.setItem("notification",JSON.stringify([]));
        },
        assignSubTask:(state,action)=>{            
            state.subTodo.push(action.payload);
            localStorage.setItem("subTodo",JSON.stringify(state.subTodo));
        },
        deassignSubTask:(state,action)=>{
            state.subTodo = state.subTodo.filter(({todo})=>todo!==action.payload);
            localStorage.setItem("subTodo",JSON.stringify(state.subTodo));
        },
        assignNotification:(state,action)=>{
            if(state.notification.length <= 0)
            {
                state.notification.push(action.payload);
                localStorage.setItem("notification",JSON.stringify(state.notification));
            }
            else
            {
                const isMatch = state.notification.filter(({_id})=>_id===action.payload._id).length;
                if(isMatch === 0)
                {
                    state.notification.push(action.payload);
                    localStorage.setItem("notification",JSON.stringify(state.notification));
                }
            }
        },
        deassignNotification:(state)=>{    
            state.notification = [];     
            localStorage.setItem("notification",JSON.stringify([]));
        }
    }
})

export const { deassignComments,assignComments,resetLocalData, assignSubTask, deassignSubTask, assignNotification, deassignNotification } = notificationSlice.actions;
export default notificationSlice.reducer