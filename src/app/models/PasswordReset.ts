import mongoose, { Schema, Mongoose, Types, Model,model } from "mongoose"


export interface PasswordResetModel {
    userId: Types.ObjectId,
    expiresAt: Date,
    token: String,
    isTokenUsed?:boolean
}


const PasswordResetSchema: Schema<PasswordResetModel> = new Schema({
    userId:
    {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },
    token: {
        type: String,
        required: true
    },

    expiresAt: {
        type: Date,
        required: true
    },
    isTokenUsed:{
        type:Boolean,
        default:false

    }

}, { timestamps: true } )


 const PasswordReset:Model<PasswordResetModel>=mongoose.models.PasswordReset || model<PasswordResetModel>("PasswordReset",PasswordResetSchema)
 export default PasswordReset