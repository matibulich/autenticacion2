import express from "express"
import { registro, login } from "../controller/authController"

const router = express.Router()


router.post("/registro",registro)
router.post("/login", login)



export default router