import  express, { Request, Response }  from "express";
import cors from "cors";
import connectDb from "./config/db";
import {Event} from "./model/Event"
import redisClient from "./config/redis";
import { cache } from "./middleware/cache.mw";
import dotenv from "dotenv"

dotenv.config()


const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || ""

app.get("api/v1/events", cache("events:all"), async (req:Request, res: Response) => {
    try {
      const events = await Event.find().sort({ eventDate: 1 });

      await redisClient.set("events:all",  JSON.stringify(events), {
            EX: 60
        })

      return res.status(200).json({success: false, message: "success", result: events});
    } catch (error) {
        console.log(`error fetching events ${error}`)
      return res.status(500).json({ message: "Error fetching events", error });
    }
});

app.post("api/v1/createEvent", async (req:Request, res: Response) => {
    try {
        const {title, description, eventDate, location} = req.body
        if(!title || !description || !eventDate || !location){
            return res.status(400).json({success: false, message: "failed"})
        }

        const newEvent = await Event.create({
            title: title,
            description: description,
            eventDate: eventDate,
            location: location,
        });

        await redisClient.del("events:all");

        return res.status(201).json({
            success: true,
            message: "success",
            result: newEvent
        });
    } catch (error) {
        console.log(`unable to create event: ${error}`)
        return res.status(500).json({success: false, message: "an error has occured"})
    }  
})

connectDb(process.env.MONGO_URL || "").then( () => {
     app.listen(port, () => {
        console.log(`server currently running on port ${port}`)
    })
})