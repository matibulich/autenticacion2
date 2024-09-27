import dotenv from "dotenv";
dotenv.config()
import express from "express"
import authRoutes from "./routes/auth"
import userRoutes from "./routes/userRoutes"
const app = express()

app.use(express.json())

//Rutas

app.use("/auth", authRoutes)
app.use("/users", userRoutes)

//autenticacion

//user

export default app