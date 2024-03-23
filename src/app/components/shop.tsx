import { useContext } from "react";
import { GameContext } from "../context/context";
import { Champion, ChampionBag, GameContextType, SHOP_ODDS } from "../lib/definitions";
import { ChampionCard } from "./champion";

export function Shop() {
    const gameContext = useContext(GameContext);
    return(
        <div className="shop flex justify-between h-full">
            {gameContext.shopBag.map((champion, id) => {
                return <ChampionCard champion={champion} shopIndex={id} key={`shop_champion_${id}`} />
            })}
        </div>
    );
}

