import { CSSProperties, useContext } from "react";
import { GameContext } from "../context/context";
import { Champion, ChampionBag, GameContextType, SHOP_ODDS } from "../lib/definitions";
import { ChampionCard } from "./champion";
import { useDroppable } from "@dnd-kit/core";
import React from "react";

export function Shop() {
    const gameContext = useContext(GameContext);
    const {active, isOver, setNodeRef} = useDroppable({
        id : 'shop'
    });

    const style : CSSProperties = {
        outline: isOver && active && !active.id.toString().includes('card_') ? 'solid 2px rgb(8 145 178)' : undefined,
        outlineOffset: isOver && active && !active.id.toString().includes('card_') ? "-2px" : undefined
    };

    return(
        <div style={style} ref={setNodeRef} className="shop flex justify-between h-full">
            {active && !active.id.toString().includes('card_') ?
            <div className="text-4xl text-white text-center content-evenly w-full">Sell for {active.data.current?.tier}g</div>:
            gameContext.shopBag.map((champion, id) => {
                return <ChampionCard champion={champion} shopIndex={id} key={`shop_champion_${id}`} />
            })}
        </div>
    );
}

