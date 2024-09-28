import { users } from "../modelo/userInterface";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "defaultSecret";

export const generateToken = (user: users): string => {
    return jwt.sign({ id:user.id, email:user.email }, JWT_SECRET, { expiresIn: '1h' });
}

