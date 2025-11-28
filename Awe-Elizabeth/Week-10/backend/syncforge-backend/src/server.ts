import app from './app'
import dotenv from 'dotenv'
import { connectDB } from './config/db'

dotenv.config()

const port = process.env.PORT || "3000"
connectDB(process.env.MONGO_URL || "").then(()=> {

  app.listen(port, () => {
    console.log(`server currently running on port ${port}`)
  });
})

