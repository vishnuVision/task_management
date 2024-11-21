import mongoose,{ Schema, model } from "mongoose";
const { models } = mongoose; 

const SubTodoSchema = new Schema({
    title:{
        type: String,
        required: [true, "Text is required"],
    },
    description:{
        type: String,
        required: [true, "Description is required"],
    },
    status: {
        type: String,
        enum: ["INCOMPLETED", "INPROGRESS", "COMPLETED"],
        default: "INCOMPLETED"
    },
    owner:[
        {
        type: Schema.Types.ObjectId,
        required: [true, "Owner is required"],
        ref: "User"}
    ],
    todo:{
        type: Schema.Types.ObjectId,
        required: [true, "Todo is required"], 
        ref: "Todo"
    }
},{timestamps: true});

export const Subtodo = models.Subtodo || model("Subtodo", SubTodoSchema);