import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDB } from './db/connectDB.js'
import {User} from './models/user.model.js'
import bycrptjs from 'bcryptjs'
import cookieParser from 'cookie-parser'

const PORT = 8000

dotenv.config() 
const app = express()

app.use(cors({origin:"http://localhost:5173", credentials:true}))
app.use(express.json())
app.use(cookieParser())

import authRouter from './routes/auth.js'
import adminRouter from './routes/admin.js'
import userRouter from './routes/user.js'

app.use(authRouter)
app.use(userRouter)
app.use('/admin',adminRouter)

app.listen(PORT,async ()=>{
  try {
    await connectDB();

    const user = await User.findOne({ username: "AnasAS" });

    if (!user) {
      const hashedPassword = await bycrptjs.hash("Fastapi@24", 12);

      const adminUser = new User({
        username: "AnasAS",
        email: "anasothman581@gmail.com",
        password: hashedPassword,
        isVerifide: true,
        role: "admin"
      });

      await adminUser.save();

      console.log("Admin user created");
    } else {
      console.log("Admin user already exists");
    }

    console.log("App running on port", PORT);
  } catch (error) {
    console.error("Error during app initialization:", error);
  }
})