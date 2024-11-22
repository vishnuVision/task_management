import mongoose,{ Schema, model } from "mongoose";
const { models } = mongoose; 

const notificationSchema = new Schema({
    text:{
        type: String,
    },
    image:{
        type: String
    },
    owner:{
        username:String,
        avatar:String,
        admin:Boolean
    },
    receiver:{
        type: Schema.Types.ObjectId,
        required: [true, "Receiver is required"],
        ref: "User"
    },
    show:{
        type:Boolean,
        default: false
    },
    message:{
        type: String
    }
},{timestamps: true});

export const Notification = models.Notification || model("Notification", notificationSchema);