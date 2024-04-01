import Image from "next/image";
import { GameContext } from "../context/context";
import { useContext } from "react";
import { SHOP_ODDS, XP_NEEDED } from "../lib/definitions";
import React from "react";

export default function Dashboard() {
    return (
        <div className="flex flex-row h-full">
            <Level />
            <ShopPercentage />
            <Gold />
        </div>
    );
}

function Level() {
    const gameContext = useContext(GameContext);
    const xpNeededToLevel = XP_NEEDED[gameContext.level - 2];
    return(
        <div className="flex flex-row justify-between content-end bg-[#152023] border-[#785a28] border-x-2 border-t-2">
            <div className="text-white text-xl place-self-end mr-10">
                Lvl. {gameContext.level}
            </div>
            <div className="text-white text-base place-self-end">
                {gameContext.xp}/{xpNeededToLevel}
            </div>
        </div>
    );
}

function ShopPercentage() {
    const gameContext = useContext(GameContext);
    if(gameContext.level < 2) {
        gameContext.setLevel(2);
    } else if(gameContext.level > 10) {
        gameContext.setLevel(10);
    }
    const percentages: number[] = SHOP_ODDS[Math.min(10, Math.max(2, gameContext.level)) - 2]
    return(
        <div className="flex flex-row place-self-end bg-[#101512] h-[70%]">
            {percentages.map((odds, id) => {
                return <div className={`content-center font-semibold p-2 tier-${id + 1}-text`} key={`shop_odds_${id}`}>{odds}</div>
            })}
        </div>
    );
}

function Gold() {
    const gameContext = useContext(GameContext);
    return(
        <div className="flex flex-row bg-[#152023] border-[#785a28] border-x-2 border-t-2 ml-40">
            <div className="content-center pl-5">
                <Image alt="gold icon" width={16} height={16} src="/gold.png" />
            </div>
            <div className="text-white text-lg content-center pr-5">{gameContext.gold}</div>
        </div>
    );
}