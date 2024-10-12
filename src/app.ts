
import dotenv from "dotenv";
dotenv.config()
import express from "express"
import authRoutes from "./routes/auth"
import userRoutes from "./routes/userRoutes"
import cookieParser from "cookie-parser"
const app = express()



// Middleware para servir archivos estáticos (como HTML, CSS)
app.use(express.static('public'));


app.use(express.json())
// Middleware para procesar los datos enviados por formularios HTML
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


//Rutas

app.use("/auth", authRoutes)
app.use("/users", userRoutes)



app.get('/', (req, res) => {
    res.redirect('/login.html');

  });

//user

export default app