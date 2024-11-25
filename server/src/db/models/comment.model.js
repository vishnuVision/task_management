import mongoose,{ Schema, model } from "mongoose";
const { models } = mongoose; 

const commentSchema = new Schema({
    text:{
        type: String,
    },
    image:{
        type: String
    },
    owner:{
        type: Schema.Types.ObjectId,
        required: [true, "Owner is required"],
        ref: "User"
    },
    todo:{
        type: Schema.Types.ObjectId,
        required: [true, "Todo is required"], 
        ref: "Todo"
    },
    show:{
        type:Boolean,
        default: false
    }
},{timestamps: true});

export const Comment = models.Comment || model("Comment", commentSchema);