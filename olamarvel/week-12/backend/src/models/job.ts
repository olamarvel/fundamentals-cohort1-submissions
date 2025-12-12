import {Schema,model} from "mongoose";

export interface JOB{
  title: string;
  description: string;
  status: string;
}

const Jobschema = new Schema({ 
  title: { type: String, maxlength: 150, required: true },
  description: { type: String, maxlength: 2000 },
  status: { type: String, enum: ["Queued", "Pending", "Finished"], default: "Queued" },
}, { timestamps: true });

const Job = model("Job", Jobschema);
export default Job