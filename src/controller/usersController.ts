import { Request, Response } from "express";
import { hashedPass } from "../services/passwordService";
import prisma from "../modelo/users";

const ERROR_MESSAGES = {
  MISSING_EMAIL: "El email es obligatorio",
  MISSING_PASSWORD: "El password es obligatorio",
  EMAIL_ALREADY_EXISTS: "El email ya existe",
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email) throw new Error(ERROR_MESSAGES.MISSING_EMAIL);
    if (!password) throw new Error(ERROR_MESSAGES.MISSING_PASSWORD);

    const hashedPassword = await hashedPass(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json(user); //201 es el codigo de estado para crear un recurso
  } catch (error: any) {
    if (error?.code === "P2002" && error?.meta?.target?.includes("email")) {
      //error de prisma
      res.status(400).json({ error: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS });
    }

    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }

    console.log(error);
  }
};

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users); //200 es el codigo de ok para obtener el recurso
  } catch (error: any) {
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.id);
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
      
    }
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ error: "Error en el servidor" });
  }
  
};


export const putById = async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.id);
  const { email, password } = req.body;
  try {
    let dataUpdate: any = { ...req.body };
    if (password) {
      const hashedPassword = await hashedPass(password);
      dataUpdate.password = hashedPassword;

      if (email) {
        dataUpdate.email = email;
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data: dataUpdate,
      });
      res.status(200).json(user);
    }
  } catch (error: any) {
    if (error?.code === "P2002" && error?.meta?.target?.includes("email")) {
      //error de prisma
      res.status(400).json({ error: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS });
    } else if (error?.code === "P2025") {
      res.status(404).json({ error: "Usuario no encontrado" });
    } else {
      res.status(500).json({ error: "Error en el servidor" });
    }
  }
};

export const deleteById = async (req: Request, res: Response): Promise<void> =>{
    const userId = parseInt(req.params.id);
    try {
        const user = await prisma.user.delete({
            where:{id:userId}
        })
        res.status(200).json({
            message:`${user.email} eliminado correctamente`
        }).end
    } catch (error:any) {
        if (error?.code === "P2025") {
            res.status(404).json({ error: "Usuario no encontrado" });
          } else {
            res.status(500).json({ error: "Error en el servidor" });
          }
    }
}
