import mongoose from "mongoose";

export interface IMealItems{
   food: mongoose.Types.ObjectId,
   qty: number,
   unit: string
}