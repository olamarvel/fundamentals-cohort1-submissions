import { connectDB } from "./config/db";
import app from "./app";
import dotenv from "dotenv";
import Food from "./models/Food";
import { seedFoods } from "./scripts/seedfood";
dotenv.config()


let port = process.env.PORT || "5010"

connectDB(process.env.MONGOURL || "").then(async ()=> {

    const count = await Food.countDocuments();
    if (count === 0){
        await seedFoods()
    }

    app.listen(port, () => {
        console.log(`app listening on port ${port}`)
    })
})