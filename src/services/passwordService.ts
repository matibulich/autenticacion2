import bcrypt from "bcrypt";


export const hashedPass = async (password:string):Promise<string>=>{
return await bcrypt.hash(password, 10)
}

//comparar con el hash de la base de datos

export const comparePass= async (password:string, hash:string):Promise<boolean>=>{
    return await bcrypt.compare(password, hash)


}
