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

export function FetchShopBag(gameContext : GameContextType) : { newChampionBag : ChampionBag|undefined , newShopBag : Champion[] } {
    const shopOdds: number[] = SHOP_ODDS[gameContext.level - 2];
    const currentShopTiers: number[] = [];
    const newShop: Champion[] = [];

    //Check if champion bag has been set
    if (undefined === gameContext.championBag) {
        return { 
            newChampionBag : gameContext.championBag, 
            newShopBag: newShop
        };
    }

    //Refill champion bag with leftover shop units
    if (gameContext.shopBag.length > 0) {
        for (var i = 0; i < 5; i++) {
            let tempChampion = gameContext.shopBag.shift();
            if (tempChampion !== undefined) {
                switch(tempChampion?.tier) {
                    case 1:
                        gameContext.championBag.Tier1Units.push(tempChampion);
                        break;
                    case 2:
                        gameContext.championBag.Tier2Units.push(tempChampion);
                        break;
                    case 3:
                        gameContext.championBag.Tier3Units.push(tempChampion);
                        break;
                    case 4:
                        gameContext.championBag.Tier4Units.push(tempChampion);
                        break;
                    case 5:
                        gameContext.championBag.Tier5Units.push(tempChampion);
                        break;
                }
                
            }
        }
    }

    //Determine tiers of each shop slot
    for (var i = 0; i < 5; i++) {
        let randomNumber = Math.floor(Math.random() * (Math.ceil(100) - Math.floor(1) + 1));
        if (randomNumber < shopOdds[0]) {
            currentShopTiers.push(1);
        } else if(randomNumber < (shopOdds[0] + shopOdds[1])) {
            currentShopTiers.push(2);
        } else if (randomNumber < (shopOdds[0] + shopOdds[1] + shopOdds[2])) {
            currentShopTiers.push(3);
        } else if (randomNumber < (shopOdds[0] + shopOdds[1] + shopOdds[2] + shopOdds[3])) {
            currentShopTiers.push(4);
        } else {
            currentShopTiers.push(5);
        }
    }

    //Select random unit for each shop slot and remove them from the champion bag and put them in the new shop bag
    for (var index in currentShopTiers) {
        let randomIndex: number = 0;
        let newChampion: Champion = {
            id: "",
            name: "",
            tier: 0,
            imageurl: "",
            origins: [],
            classes: []
        };

        switch(currentShopTiers[index]) {
            case 1:
                randomIndex = Math.floor(Math.random() * gameContext.championBag.Tier1Units.length);
                newChampion = gameContext.championBag.Tier1Units[randomIndex];
                gameContext.championBag.Tier1Units.splice(randomIndex, 1);
                newShop.push(newChampion);
                break;
            case 2:
                randomIndex = Math.floor(Math.random() * gameContext.championBag.Tier2Units.length);
                newChampion = gameContext.championBag.Tier2Units[randomIndex];
                gameContext.championBag.Tier2Units.splice(randomIndex, 1);
                newShop.push(newChampion);
                break;
            case 3:
                randomIndex = Math.floor(Math.random() * gameContext.championBag.Tier3Units.length);
                newChampion = gameContext.championBag.Tier3Units[randomIndex];
                gameContext.championBag.Tier3Units.splice(randomIndex, 1);
                newShop.push(newChampion);
                break;
            case 4:
                randomIndex = Math.floor(Math.random() * gameContext.championBag.Tier4Units.length);
                newChampion = gameContext.championBag.Tier4Units[randomIndex];
                gameContext.championBag.Tier4Units.splice(randomIndex, 1);
                newShop.push(newChampion);
                break;
            case 5:
                randomIndex = Math.floor(Math.random() * gameContext.championBag.Tier5Units.length);
                newChampion = gameContext.championBag.Tier5Units[randomIndex];
                gameContext.championBag.Tier5Units.splice(randomIndex, 1);
                newShop.push(newChampion);
                break;
        }
    }

    console.log("FetchShop return value:", { 
        newChampionBag : gameContext.championBag, 
        newShopBag: newShop
    });

    return { 
        newChampionBag : gameContext.championBag, 
        newShopBag: newShop
    };
}