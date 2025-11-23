import mongoose, {Schema} from "mongoose";

export interface IDevice{
    userId: mongoose.Types.ObjectId,
    provider: string,
    externalDeviceId: string,
    metadata: object
}

const deviceSchema: Schema<IDevice> = new mongoose.Schema({
    userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true 
    },
    provider:{
    type: String,
    required: true
    }, 
    externalDeviceId: {
    type: String,
    required: true
    },
    metadata: Object,
},
{timestamps: true}
);

export default mongoose.model<IDevice>("Device", deviceSchema);