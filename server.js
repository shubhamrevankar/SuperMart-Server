import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import authRoute from "./routes/authRoute.js"
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from "./routes/productRoutes.js"
import cors from 'cors'

const app = express()
dotenv.config()



connectDB();

app.use(cors())

app.use(express.json());

app.use("/api/v1/auth",authRoute)
app.use("/api/v1/category",categoryRoutes)
app.use("/api/v1/product",productRoutes)


app.get("/",(req,res) => {
    res.send("<h1>Hello</h1>");
})

app.listen(process.env.PORT,() => {
    console.log(`Server Running on port ${process.env.PORT}`);
})