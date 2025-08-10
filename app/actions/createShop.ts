"use server"

import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export async function createShop (nom_boutique :string , admin: string, password:string){
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.boutique.create({
        data: {
            nom_boutique,
            admin,
            password : hashedPassword
        }
    })
}