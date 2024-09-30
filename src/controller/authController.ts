import { Request, Response } from "express";
import { hashedPass, comparePass } from "../services/passwordService";
import prisma from "../modelo/user"; // asegúrate de que PrismaClient esté correctamente exportado
import { generateToken } from "../services/jwtService";

const ERROR_MESSAGES = {
  MISSING_EMAIL: "El email es obligatorio",
  MISSING_PASSWORD: "El password es obligatorio",
  EMAIL_ALREADY_EXISTS: "El email ya existe",
  SERVER_ERROR: "Error en el servidor",
  PASSWORD_MISMATCH: "La contraseña no coincide",
  USER_NOT_FOUND: "Usuario no encontrado"
};

export const registro = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    if (!email) throw new Error(ERROR_MESSAGES.MISSING_EMAIL);
    if (!password) throw new Error(ERROR_MESSAGES.MISSING_PASSWORD);

    // Encriptar la contraseña
    const hashedPassword = await hashedPass(password);

    // Crear el usuario en la base de datos
    const user = await prisma.usuario.create({  // Cambiado a 'users'
      data: {
        email,
        password: hashedPassword
      }
    });

    // Generar el token
    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (error: any) {
    if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
      res.status(400).json({ error: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS });
    } else if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: ERROR_MESSAGES.SERVER_ERROR });
    }
    console.log(error);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Verificamos que los campos no estén vacíos
    if (!email) throw new Error(ERROR_MESSAGES.MISSING_EMAIL);
    if (!password) throw new Error(ERROR_MESSAGES.MISSING_PASSWORD);

    // Buscamos el usuario en la base de datos
    const user = await prisma.usuario.findUnique({ where: { email } });  // Cambiado a 'users'
    if (!user) throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);

    // Comparamos la contraseña
    const passwordMatch = await comparePass(password, user.password);
    if (!passwordMatch) throw new Error(ERROR_MESSAGES.PASSWORD_MISMATCH);

    // Generar el token
    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (error: any) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: ERROR_MESSAGES.SERVER_ERROR });
    }
  }
};
