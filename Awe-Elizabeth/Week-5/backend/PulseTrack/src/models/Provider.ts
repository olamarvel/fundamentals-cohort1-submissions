import mongoose from "mongoose";

const providerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: String,
  phone: String,
  address: Object,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Provider", providerSchema);
