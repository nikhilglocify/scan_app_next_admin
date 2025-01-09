import mongoose, { Schema, Model, model } from "mongoose";

// Define the TypeScript interface for the Tip document
export interface TipModel {
  _id?:string
  description: string;
  image?: string;
  isDeleted?: boolean;
  isImageUploaded?: boolean;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the Mongoose schema
const TipSchema: Schema<TipModel> = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isImageUploaded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // Adds `createdAt` and `updatedAt` fields
);

// Define the Mongoose model
const Tip: Model<TipModel> =
  mongoose.models.Tip || model<TipModel>("Tip", TipSchema);

export default Tip;
