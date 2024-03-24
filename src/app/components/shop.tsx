import { CSSProperties, useContext } from "react";
import { GameContext } from "../context/context";
import { Champion, ChampionBag, GameContextType, SHOP_ODDS } from "../lib/definitions";
import { ChampionCard } from "./champion";
import { useDroppable } from "@dnd-kit/core";

export function Shop() {
    const gameContext = useContext(GameContext);
    const {active, isOver, setNodeRef} = useDroppable({
        id : 'shop'
    });

    const style : CSSProperties = {
        outline: isOver ? 'solid 2px rgb(8 145 178)' : undefined,
        outlineOffset: isOver ? "-2px" : undefined
    };

    return(
        <div className="shop flex justify-between h-full">
            {active ?
            <div style={style} className="text-4xl text-white text-center content-evenly w-full">Sell for {active.data.current?.tier}g</div>:
            gameContext.shopBag.map((champion, id) => {
                return <ChampionCard champion={champion} shopIndex={id} key={`shop_champion_${id}`} />
            })}
        </div>
    );
}

