import mongoose, {Schema} from "mongoose";
import { INutrients } from "../utilities/interfaces/nutrients";

export interface IFood{
    foodName: string,
    nutrients: INutrients,
    unit: string
}

const foodSchema: Schema<IFood> = new mongoose.Schema({
    foodName: {
        type: String,
        required: true
    },
    nutrients:{
        calories:{type: Number},
        protein: {type: Number},
        fat: {type: Number},
        carbohydrate: {type: Number},
        vitamins: {type: Number},
        water: {type: Number}
    },
    unit: {
        type: String,
        required: true,
        default: "100g"
    }
},
{timestamps: true}
);

export default mongoose.model<IFood>("Food", foodSchema);