import { ChampionDataModel } from "@/app/lib/definitions";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient()

export default async function handler(
    _req: NextApiRequest,
    res: NextApiResponse<ChampionDataModel[]>,) 
{
    console.log("fetchChampions");

    const champions: ChampionDataModel[] = await prisma.champions.findMany();
    return res.status(200).json(champions);
}
