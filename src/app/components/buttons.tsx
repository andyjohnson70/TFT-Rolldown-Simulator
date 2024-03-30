import { useContext } from "react";
import { GameContext } from "../context/context";
import { BuyXP, FetchShopBag } from "../scripts/actions";
import useSound from "use-sound";
import Image from "next/image";
import React from "react";

export function XpButton() {
    const [xpSFX] = useSound("/sounds/xp.mp3");
    const gameContext = useContext(GameContext);
    const buyXP = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        // if (!gameContext.gameActive || gameContext.gold < 4 || gameContext.level === 10) {
        //     return
        // }
        const { newLevel, newXP, newGold } = BuyXP(gameContext.level, gameContext.xp, gameContext.gold);
        gameContext.setLevel(newLevel);
        gameContext.setXP(newXP);
        gameContext.setGold(newGold);
    }
    return (
        <div className="bg-sky-600 grow flex flex-col justify-center m-2" onClick={buyXP}>
            <div className="flex flex-col pl-3">
                <div className=" text-white text-lg font-bold">Buy XP</div>
                <div className="flex flex-row">
                    <div className="content-center">
                        <Image alt="gold icon" width={12} height={12} src="/gold.png" />
                    </div>
                    
                    <div className="text-white text-md font-semibold">4</div>
                </div>
            </div>
        </div>
    );
}



export function RerollButton() {
    const [rerollSFX] = useSound("/sounds/reroll.mp3");
    const gameContext = useContext(GameContext);
    const rerollShop = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        // if (!gameContext.gameActive || gameContext.gold < 2) {
        //     return
        // }
        const { newChampionBag, newShopBag } = FetchShopBag(gameContext.championBag, gameContext.shopBag, gameContext.level);
        rerollSFX();
        gameContext.setChampionBag(newChampionBag);
        gameContext.setShopBag(newShopBag);
        gameContext.setGold(gameContext.gold.valueOf() - 2);
    }

    return (
        <div className="bg-yellow-400 grow flex flex-col justify-center mx-2 mb-2" onClick={rerollShop}>
            <div className="flex flex-col pl-3">
                <div className=" text-white text-lg font-bold">Reroll</div>
                <div className="flex flex-row">
                    <div className="content-center">
                        <Image alt="gold icon" width={12} height={12} src="/gold.png" />
                    </div>
                    
                    <div className="text-white text-md font-semibold">2</div>
                </div>
            </div>
        </div>
    );
}