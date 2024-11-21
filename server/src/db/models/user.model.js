import mongoose,{ Schema,model } from "mongoose";
import bcrypt from "bcrypt";

const { models } =  mongoose;

const userSchema = Schema({
    username: {
        type: String,
        required: [true,"Username is required"],
        trim: true,
        unique: true
    },
    name:{
        type: String,
        required:[true,"Name is required"],
    },
    email: {
        type: String,
        required: [true,"Email is required"],
        trim: true,
        unique: [true,"Email is already registered"],
    },
    password: {
        type: String,
        required: [true,"Password is required"],
    },
    avatar:{
        type:String,
        required:[true,"Avatar is required"]
    },
    admin:{
        type: Boolean,
        default: false,
        required: [true,"Admin is required"]
    }
},{timestamps: true});

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
});

export const User =  models?.User || new model("User",userSchema);