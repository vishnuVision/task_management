import mongoose,{ Schema, model } from "mongoose";
const { models } = mongoose; 

const todoSchema = new Schema({
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
    priority: {
        type: String,
        enum: ["LOW", "MEDIUM", "HIGH"],
        default: "LOW"
    },
    owner:[
        {
        type: Schema.Types.ObjectId,
        required: [true, "Owner is required"],
        ref: "User"}
    ],
    comments:[
        {
            type: Schema.Types.ObjectId,
            required: [true, "Comment is required"],
            ref: "Comment"
        }   
    ]
},{timestamps: true});

export const Todo = models.Todo || model("Todo", todoSchema);