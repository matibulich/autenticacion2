import jwt from "jsonwebtoken";
import { JwtPayload } from "../modelo/jwt.interface";

const JWT_SECRET = process.env.JWT_SECRET || "defaultSecret";

export const generateToken = (user: JwtPayload): string => {
    return jwt.sign({ id:user.id, email:user.email }, JWT_SECRET, { expiresIn: '1h' });
}

