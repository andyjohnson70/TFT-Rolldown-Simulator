import { useContext } from "react";
import { GameContext } from "../context/context";
import { FetchShopBag } from "../scripts/actions";
import useSound from "use-sound";

export function XpButton() {
    return (
        <div className="bg-sky-600 h-1/2 m-2">
            <div>
                <div>Buy XP</div>
                <div>
                    <div>4</div>
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
        if (!gameContext.gameActive) {
            return
        }
        const { newChampionBag, newShopBag } = FetchShopBag(gameContext.championBag, gameContext.shopBag, gameContext.level);
        rerollSFX();
        gameContext.setChampionBag(newChampionBag);
        gameContext.setShopBag(newShopBag);
        gameContext.setGold(gameContext.gold.valueOf() - 2);
    }

    return (
        <div className="bg-yellow-400  h-1/2 m-2" onClick={rerollShop}>
            <div>
                <div>Reroll</div>
                <div>
                    <div>2</div>
                </div>
            </div>
        </div>
    );
}