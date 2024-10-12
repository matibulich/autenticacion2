import express from "express"
import { Request, Response, NextFunction } from 'express'; //importamos Request, Response para usar los tipos de datos de express por typescript
import jwt from "jsonwebtoken"
import { putById, createUser, getAll, getById, deleteById } from "../controller/usersController";

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || "defaultSecret"

//MIDDLEWARE de jswtoken para ver autenticado 
 export const authenticateToken = (req:Request,res:Response, next:NextFunction)=>{
    const token = req.cookies.token // Extraer el token de las cookies
   
    if(!token){
        return res.status(401).json({error:"No esta autorizado"})
    }

    jwt.verify(token, JWT_SECRET, ( err:jwt.VerifyErrors | null, decoded:any)=>{
        if(err) return res.status(403).json({error:"Token invalido"})
      
        next()
})}



router.post("/",authenticateToken, createUser) //crear un usuario
router.get("/",authenticateToken, getAll)//traer todos los usuarios
router.get("/:id",authenticateToken, getById)//traer un usuario por id
router.put("/:id",authenticateToken, putById)//actualizar un usuario por id
router.delete("/:id",authenticateToken, deleteById)

export default router