import express from "express"
import { Request, Response, NextFunction } from 'express'; //importamos Request, Response para usar los tipos de datos de express por typescript
import jwt from "jsonwebtoken"
import { putById, createUser, getAll, getById, deleteById } from "../controller/usersController";

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || "defaultSecret"

//MIDDLEWARE de jswtoken para ver autenticado 
const authenticateToken = (req:Request,res:Response, next:NextFunction)=>{
    const authHeader = req.headers['authorization']  //obtenemos el token del header, el token se manda a través del header
    const token = authHeader && authHeader.split(' ')[1]  //authHeader.split(' ')[1] nos da el token, el split es para separar el barerar del token y el 1 es para obtener el segundo elemento del array, el primero es el bearer
    if(!token){
        return res.status(401).json({error:"No esta autorizado"})
    }

    jwt.verify(token, JWT_SECRET, (err, decoded)=>{
        if(err) return res.status(403).json({error:"Token invalido"})
        next()
})}



router.post("/",authenticateToken, createUser) //crear un usuario
router.get("/",authenticateToken, getAll)//traer todos los usuarios
router.get("/:id",authenticateToken, getById)//traer un usuario por id
router.put("/:id",authenticateToken, putById)//actualizar un usuario por id
router.delete("/:id",authenticateToken, deleteById)

export default router