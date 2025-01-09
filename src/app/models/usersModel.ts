import mongoose, { Schema, Model, model } from "mongoose";


export interface UserModel {
    email:string,
    password:string,
    token?:string,
    isDeleted?:boolean


}
const userSchema : Schema<UserModel> = new Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    token:{
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


const User :Model<UserModel> = mongoose.models.users || mongoose.model("users", userSchema);

export default User;