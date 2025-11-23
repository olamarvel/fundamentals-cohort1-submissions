import mongoose from "mongoose"

export interface IUserCreated {
  event: string
  data: IData
}

interface IData{
    userId: mongoose.Types.ObjectId
}
