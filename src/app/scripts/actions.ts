import { Active, Over } from "@dnd-kit/core";
import { ChampionCardProps } from "../components/champion";
import { BagSize, Champion, ChampionBag, GameContextType, SHOP_ODDS } from "../lib/definitions";
import { act } from "react-dom/test-utils";
import { Goblin_One } from "next/font/google";

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
                for(let i = 0; i < BagSize.Tier1; i++) {
                    let tempChamp : Champion = {...champion};
                    tempChamp.id = tempChamp.id + `-${i}`
                    championBag.Tier1Units.push(tempChamp)
                }
                break;
            case 2: 
            for(let i = 0; i < BagSize.Tier2; i++) {
                let tempChamp : Champion = {...champion};
                tempChamp.id = tempChamp.id + `-${i}`
                championBag.Tier2Units.push(tempChamp)
            }
                break;
            case 3:
                for(let i = 0; i < BagSize.Tier3; i++) {
                    let tempChamp : Champion = {...champion};
                    tempChamp.id = tempChamp.id + `-${i}`
                    championBag.Tier3Units.push(tempChamp)
                }
                break;
            case 4:
                for(let i = 0; i < BagSize.Tier4; i++) {
                    let tempChamp : Champion = {...champion};
                    tempChamp.id = champion.id + `-${i}`
                    championBag.Tier4Units.push(tempChamp)
                }
                break;
            case 5:
                for(let i = 0; i < BagSize.Tier5; i++) {
                    let tempChamp : Champion = {...champion};
                    tempChamp.id = tempChamp.id + `-${i}`
                    championBag.Tier5Units.push(tempChamp)
                }
                break;
        }
    });
    console.log("champion bag:", championBag);
    return championBag;
}

export function PurchaseChampion(gameContext : GameContextType, championCardProps: ChampionCardProps) : { newBenchBag : (Champion | undefined)[], newShopBag : (Champion | undefined)[], newGold : number } {
    if(!championCardProps.champion) {
        return {
            newBenchBag: gameContext.benchBag,
            newShopBag: gameContext.shopBag,
            newGold: gameContext.gold
        }
    }

    const newBenchBag: (Champion|undefined)[] = [...gameContext.benchBag];
    const newShopBag: (Champion|undefined)[] = [...gameContext.shopBag];

    for (let i = 0; i < gameContext.benchBag.length; i++) {
        if(gameContext.benchBag[i] === undefined) {
            newBenchBag[i] = championCardProps.champion;
            break;
        }
    }

    newShopBag[championCardProps.shopIndex] = undefined;
    const newGold = gameContext.gold - championCardProps.champion?.tier;

    return {
        newBenchBag: newBenchBag,
        newShopBag: newShopBag,
        newGold: newGold,
    }
}

export function MoveChampion(boardBag : (Champion|undefined)[][], benchBag : (Champion|undefined)[], active : Active, over : Over) : { newBoardBag : (Champion|undefined)[][], newBenchBag : (Champion|undefined)[] } {
    if(!active.data.current || !over) {
        return {
            newBoardBag: boardBag,
            newBenchBag: benchBag
        };
    }

    const currentPosition = active.data.current.currentPosition;
    const newPosition = over.id.toString();

    const newBoardBag : (Champion|undefined)[][] = [...boardBag];
    const newBenchBag : (Champion|undefined)[] = [...benchBag];
    let tempChampCurrent : Champion|undefined = IdenityPosition(currentPosition, newBoardBag, newBenchBag);
    let tempChampToSwap : Champion|undefined = IdenityPosition(newPosition, newBoardBag, newBenchBag);

    // If the newPosition include a '-' then the champion is being moved to the board
    if(newPosition.includes("-")) {
        const location = newPosition.split("-");
        const rowLocation = Number(location[0]);
        const hexLocation = Number(location[1]);
        newBoardBag[rowLocation][hexLocation] = tempChampCurrent;
    } 
    // If it does not include a '-' then the champion is being moved to the bench
    else {
        const location = Number(newPosition);
        newBenchBag[location] = tempChampCurrent;
    }

    // If currrentPosition contians a '-' then it is being moved from the board
    if(currentPosition.includes("-")) {
        const location = currentPosition.split("-");
        const rowLocation = Number(location[0]);
        const hexLocation = Number(location[1]);
        newBoardBag[rowLocation][hexLocation] = tempChampToSwap;

    } 
    // If it does not contain a '-' it is being moved from the bench
    else {
        const location = Number(currentPosition);
        newBenchBag[location] = tempChampToSwap;
    }


    return {
        newBoardBag: newBoardBag,
        newBenchBag: newBenchBag
    }
}
 

export function SellChampion(boardBag : (Champion|undefined)[][], benchBag : (Champion|undefined)[], championBag: ChampionBag|undefined, gold : number, active : Active, over : Over) : { newBoardBag : (Champion|undefined)[][], newBenchBag : (Champion|undefined)[], newChampionBag : ChampionBag|undefined, newGold : number} {
    if(!active.data.current || !over || !championBag) {
        return {
            newBoardBag: boardBag,
            newBenchBag: benchBag,
            newChampionBag: championBag,
            newGold: gold
        };
    }

    const currentPosition = active.data.current.currentPosition;
    const championTier = active.data.current.tier;
    
    const newBoardBag : (Champion|undefined)[][] = [...boardBag];
    const newBenchBag : (Champion|undefined)[] = [...benchBag];
    let tempChamp : Champion|undefined = IdenityPosition(currentPosition, newBoardBag, newBenchBag);

    // If ChampionHex currrentPosition contians a '-' then it is being sold from the board
    if(currentPosition.includes("-")) {
        const location = currentPosition.split("-");
        const rowLocation = Number(location[0]);
        const hexLocation = Number(location[1]);
        newBoardBag[rowLocation][hexLocation] = undefined;
    } 
    // If it does not contain a '-' it is being sold from the bench
    else {
        const location = Number(currentPosition);
        newBenchBag[location] = undefined;
    }

    //Return champion to game bag
    switch(tempChamp?.tier) {
        case 1:
            championBag.Tier1Units.push(tempChamp)
            break;
        case 2: 
            championBag.Tier2Units.push(tempChamp)
            break;
        case 3:
            championBag.Tier3Units.push(tempChamp)
            break;
        case 4:
            championBag.Tier4Units.push(tempChamp)
            break;
        case 5:
            championBag.Tier5Units.push(tempChamp)
            break;
    }

    const newGold = gold + championTier;
    return {
        newBoardBag: newBoardBag,
        newBenchBag: newBenchBag,
        newChampionBag: championBag,
        newGold: newGold
    }
}

function IdenityPosition(position : string, boardBag : (Champion|undefined)[][], benchBag : (Champion|undefined)[]) :  Champion|undefined {
    let positionResident : Champion|undefined = undefined;

    // If currrentPosition contians a '-' then it is being moved from the board
    if(position.includes("-")) {
        const location = position.split("-");
        const rowLocation = Number(location[0]);
        const hexLocation = Number(location[1]);
        if(undefined !== boardBag[rowLocation][hexLocation]) {
            positionResident = boardBag[rowLocation][hexLocation];
        }
    } 
    // If it does not contain a '-' it is being moved from the bench
    else {
        const location = Number(position);
        positionResident = benchBag[location];
    }

    return positionResident;
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
