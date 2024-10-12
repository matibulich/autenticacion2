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

    // Verificar si el email ya está registrado
    const existingUser = await prisma.usuario.findUnique({ where: { email } });
    if (existingUser) throw new Error(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);

    // Encriptar la contraseña
    const hashedPassword = await hashedPass(password);

    // Crear el usuario en la base de datos
    const user = await prisma.usuario.create({
      data: {
        email,
        password: hashedPassword
      }
    });

    // Generar el token
    const token = generateToken(user);

 // almacenar el token en una cookie para autenticación
    res.cookie("token", token, { 
      httpOnly: true,
      maxAge:7200000,//2hs
      sameSite:"lax" });

    // Redirigir al login o página de contenido después del registro
    res.redirect('/registro.html?registered=true');
  } catch (error: any) {
    if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) { //error de prisma
      res.status(400).json({ error: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS });
    } else if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: ERROR_MESSAGES.SERVER_ERROR });
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    if (!email) throw new Error(ERROR_MESSAGES.MISSING_EMAIL);
    if (!password) throw new Error(ERROR_MESSAGES.MISSING_PASSWORD);

    // Buscar el usuario en la base de datos
    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user) throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);

    // Verificar la contraseña
    const passwordMatch = await comparePass(password, user.password);
    if (!passwordMatch) throw new Error(ERROR_MESSAGES.PASSWORD_MISMATCH);

    // Generar el token
    const token = generateToken(user);

    // Guardar el token en una cookie para autenticación
    res.cookie("token", token, { 
      httpOnly: true,
      maxAge:7200000, //2hs
      sameSite:"lax" });

    // Redirigir al contenido protegido
    res.redirect("/contenido.html");
  } catch (error: any) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: ERROR_MESSAGES.SERVER_ERROR });
    }
  }
};