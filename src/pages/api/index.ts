import { Champion } from "@/app/lib/definitions";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient()

export default async function handler(
    _req: NextApiRequest,
    res: NextApiResponse<Champion[]>,) 
{
    console.log("fetchChampions");

    const champions: Champion[] = await prisma.champions.findMany();
    return res.status(200).json(champions);
}
