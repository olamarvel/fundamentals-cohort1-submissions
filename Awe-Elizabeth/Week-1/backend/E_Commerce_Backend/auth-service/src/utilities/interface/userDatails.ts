import mongoose from "mongoose";

export interface userDetails{
    id: mongoose.Types.ObjectId,
    firstName: string,
    lastName: string
}