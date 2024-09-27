import app from "./app"

const PORT= process.env.PORT;

app.listen(PORT, ()=>{
    console.log(`servidor corriendo en http://localhost:${PORT}`)
})