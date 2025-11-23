import { connectDB } from "./config/db";
import app from "./app";
import dotenv from "dotenv";
dotenv.config()


let port = process.env.PORT || "5010"

connectDB(process.env.MONGOURL || "").then(()=> {
    app.listen(port, () => {
        console.log(`app listening on port ${port}`)
    })
})