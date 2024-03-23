import { ChampionCardProps } from "../components/champion";
import { BagSize, Champion, ChampionBag, GameContextType, SHOP_ODDS } from "../lib/definitions";

export function InitializeChampionBag(championsList?: Champion[]) : ChampionBag {
    let championBag: ChampionBag = {
        Tier1Units: [],
        Tier2Units: [],
        Tier3Units: [],
        Tier4Units: [],
        Tier5Units: []
    };

    if(championsList === undefined || championsList.length === 0) {
        return championBag;
    }

    championsList?.forEach((champion) => {
        switch(champion.tier) {
            case 1:
                championBag.Tier1Units.push(...Array(BagSize.Tier1).fill(champion));
                break;
            case 2: 
                championBag.Tier2Units.push(...Array(BagSize.Tier2).fill(champion));
                break;
            case 3:
                championBag.Tier3Units.push(...Array(BagSize.Tier3).fill(champion));
                break;
            case 4:
                championBag.Tier4Units.push(...Array(BagSize.Tier4).fill(champion));
                break;
            case 5:
                championBag.Tier5Units.push(...Array(BagSize.Tier5).fill(champion));
                break;
        }
    });
    console.log("champion bag:", championBag);
    return championBag;
}

export function PurchaseChampion(gameContext : GameContextType, championCardProps: ChampionCardProps) : { newBenchBag : (Champion | undefined)[], newShopBag : (Champion | undefined)[]} {
    const newBenchBag: (Champion|undefined)[] = Array(9).fill(undefined);
    const newShopBag: (Champion|undefined)[] = Array(5).fill(undefined);
    for (let i = 0; i < gameContext.benchBag.length; i++) {
        if(gameContext.benchBag[i] === undefined) {
            newBenchBag[i] = championCardProps.champion;
            break;
        } else {
            newBenchBag[i] = gameContext.benchBag[i]
        }
    }

    for (let i = 0; i < gameContext.shopBag.length; i++) {
        if(i == championCardProps.shopIndex) {
            newShopBag[i] = undefined;
        } else {
            newShopBag[i] = gameContext.shopBag[i];
        }
    }

    return {
        newBenchBag: newBenchBag,
        newShopBag: newShopBag
    }
}


export function FetchShopBag(gameContext : GameContextType) : { newChampionBag : ChampionBag|undefined , newShopBag : Champion[] } {
    const shopOdds: number[] = SHOP_ODDS[gameContext.level - 2];
    const currentShopTiers: number[] = [];
    const newShop: Champion[] = [];

    //Check if champion bag has been set
    if (undefined === gameContext.championBag) {
        return { 
            newChampionBag: gameContext.championBag, 
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
