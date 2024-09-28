import { usuario } from "../modelo/userInterface";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "defaultSecret";

export const generateToken = (user: usuario): string => {
    return jwt.sign({ id:user.id, email:user.email }, JWT_SECRET, { expiresIn: '1h' });
}

