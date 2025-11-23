import mongoose, { Mongoose, Schema } from 'mongoose'
import { IMealItems } from '../utilities/interfaces/mealItems';
import { mealTypes } from '../utilities/enums/mealTypes';
import Food from './Food';
import { INutrients } from '../utilities/interfaces/nutrients';
import { units } from '../utilities/enums/units';


export interface IMeal extends Document{
    userId: mongoose.Types.ObjectId;
    eatenAt: Date,
    mealItems: Array<IMealItems>
    mealType: mealTypes,
    totalNutrient: INutrients
}


const MealSchema : Schema<IMeal> = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    eatenAt: {
        type: Date,
        required: true
    },
    mealItems: [
        {
            food: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            qty: {
                type: String,
                required: true
            },
            unit: {
                type: String,
                required: true,
                enum: Object.values(units),
                default: units.Gram
            }
        }
    ],
    mealType: {
        type: String,
        enum: Object.values(mealTypes),
        required: true
    },
    totalNutrient: {
        calories:{type: Number, default: 0},
        protein: {type: Number, default: 0},
        fat: {type: Number, default: 0},
        carbohydrate: {type: Number, default: 0},
        vitamins: {type: Number, default: 0},
        water: {type: Number, default: 0}
    }
},
{ timestamps: true }
);


export default mongoose.model<IMeal>("Meal", MealSchema);


