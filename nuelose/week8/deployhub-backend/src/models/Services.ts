import mongoose, { Document, Schema } from "mongoose";

export interface IService extends Document {
  name: string;
  url: string;
  version: string;
  status: string;
  createdAt: Date;
}

const ServiceSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  version: { type: String, required: true },
  status: { type: String, default: "active" },
  createdAt: { type: Date, default: Date.now },
});

export const Service = mongoose.model<IService>("Service", ServiceSchema);
