import mongoose, { Schema, Mongoose, Types, Model, model } from "mongoose"


export interface JsonUploadModel {
    userId: Types.ObjectId,
    filePath: String,
    type: "json-url"
}


const JsonUploadSchema: Schema<JsonUploadModel> = new Schema({
    userId:
    {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },
    filePath: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default:"json-url"
    }

}, { timestamps: true })


const JsonUpload: Model<JsonUploadModel> = mongoose.models.JsonUpload || model<JsonUploadModel>("JsonUpload", JsonUploadSchema)
export default JsonUpload