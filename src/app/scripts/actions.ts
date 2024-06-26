import { Active, Over } from "@dnd-kit/core";
import { ChampionCardProps } from "../components/champion";
import { BagSize, Champion, ChampionBag, ChampionDataModel, GameContextType, SHOP_ODDS, XP_NEEDED } from "../lib/definitions";

export function InitializeChampionBag(championsList?: ChampionDataModel[]) : ChampionBag {
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
                    let tempChamp : Champion = {
                        id: champion.id + `-${i}`,
                        name: champion.name,
                        tier: champion.tier,
                        imageurl: champion.imageurl,
                        origins: champion.origins,
                        classes: champion.classes,
                        starlevel: 1
                    };
                    championBag.Tier1Units.push(tempChamp)
                }
                break;
            case 2: 
            for(let i = 0; i < BagSize.Tier2; i++) {
                let tempChamp : Champion = {
                    id: champion.id + `-${i}`,
                    name: champion.name,
                    tier: champion.tier,
                    imageurl: champion.imageurl,
                    origins: champion.origins,
                    classes: champion.classes,
                    starlevel: 1
                };
                championBag.Tier2Units.push(tempChamp)
            }
                break;
            case 3:
                for(let i = 0; i < BagSize.Tier3; i++) {
                    let tempChamp : Champion = {
                        id: champion.id + `-${i}`,
                        name: champion.name,
                        tier: champion.tier,
                        imageurl: champion.imageurl,
                        origins: champion.origins,
                        classes: champion.classes,
                        starlevel: 1
                    };
                    championBag.Tier3Units.push(tempChamp)
                }
                break;
            case 4:
                for(let i = 0; i < BagSize.Tier4; i++) {
                    let tempChamp : Champion = {
                        id: champion.id + `-${i}`,
                        name: champion.name,
                        tier: champion.tier,
                        imageurl: champion.imageurl,
                        origins: champion.origins,
                        classes: champion.classes,
                        starlevel: 1
                    };
                    championBag.Tier4Units.push(tempChamp)
                }
                break;
            case 5:
                for(let i = 0; i < BagSize.Tier5; i++) {
                    let tempChamp : Champion = {
                        id: champion.id + `-${i}`,
                        name: champion.name,
                        tier: champion.tier,
                        imageurl: champion.imageurl,
                        origins: champion.origins,
                        classes: champion.classes,
                        starlevel: 1
                    };
                    championBag.Tier5Units.push(tempChamp)
                }
                break;
        }
    });
    return championBag;
}

export function PurchaseChampion(boardBag : (Champion|undefined)[][], benchBag : (Champion|undefined)[], shopBag : (Champion|undefined)[], gold : number, championCardProps: ChampionCardProps) : { newBoardBag : (Champion|undefined)[][], newBenchBag : (Champion | undefined)[], newShopBag : (Champion | undefined)[], newGold : number, levelUpChampion : boolean } {
    if(!championCardProps.champion) {
        return {
            newBoardBag: boardBag,
            newBenchBag: benchBag,
            newShopBag: shopBag,
            newGold: gold,
            levelUpChampion: false
        }
    }

    const championToPurchase : Champion = championCardProps.champion;
    const shopIndex : number = championCardProps.shopIndex;

    const newBoardBag: (Champion|undefined)[][] = [...boardBag]
    const newBenchBag: (Champion|undefined)[] = [...benchBag];
    const newShopBag: (Champion|undefined)[] = [...shopBag];

    let flatBoardBag: (Champion|undefined)[] = boardBag.flat();
    let allPlayerChampions: (Champion|undefined)[] = [...flatBoardBag, ...newBenchBag] 

    let levelUpChampion: boolean = false;

    const levelTwoCheck: boolean = allPlayerChampions.filter(champion => 
        champion &&
        champion.name === championToPurchase.name &&
        champion.starlevel === 1
    ).length === 2;

    const levelTwoCheckFromShop: boolean = allPlayerChampions.filter(champion => 
        champion &&
        champion.name === championToPurchase.name &&
        champion.starlevel === 1
    ).length === 1 &&
    newShopBag.filter(champion => 
        champion &&
        champion.name === championToPurchase.name
    ).length === 2 &&
    !newBenchBag.some(slot => slot === undefined);

    if(levelTwoCheck || levelTwoCheckFromShop) {
        levelUpChampion = true;
        let tempChamp : Champion|undefined = undefined;
        newBoardBag.forEach((row, i) => {
            row.forEach((champion, j) => {
                if (champion && champion?.name === championToPurchase.name && !tempChamp && champion.starlevel === 1) {
                    tempChamp = {
                        id: champion.id,
                        name: champion.name,
                        tier: champion.tier,
                        imageurl: champion.imageurl,
                        origins: champion.origins,
                        classes: champion.classes,
                        starlevel: 2
                    };
                    newBoardBag[i][j] = tempChamp;
                } else if (champion && champion?.name === championToPurchase.name && tempChamp && champion.starlevel === 1) {
                    newBoardBag[i][j] = undefined;
                }
            })
        });

        newBenchBag.forEach((champion, i) => {
            if (champion && champion?.name === championToPurchase.name && !tempChamp && champion.starlevel === 1) {
                tempChamp = {
                    id: champion.id,
                    name: champion.name,
                    tier: champion.tier,
                    imageurl: champion.imageurl,
                    origins: champion.origins,
                    classes: champion.classes,
                    starlevel: 2
                };
                newBenchBag[i] = tempChamp;
            } else if (champion && champion?.name === championToPurchase.name && tempChamp && champion.starlevel === 1) {
                newBenchBag[i] = undefined;
            }
        });
    }

    // Check if creating a two star was enough to start a three star champion
    if(levelUpChampion) {
        flatBoardBag = newBoardBag.flat();
        allPlayerChampions = [...flatBoardBag, ...newBenchBag];
        const levelThreeCheck: boolean = allPlayerChampions.filter(champion => 
            champion &&
            champion.name === championToPurchase.name &&
            champion.starlevel === 2
        ).length === 3;

        if(levelThreeCheck) {
            let tempChamp : Champion|undefined = undefined;
            newBoardBag.forEach((row, i) => {
                row.forEach((champion, j) => {
                    if (champion && champion?.name === championToPurchase.name && !tempChamp && champion.starlevel === 2) {
                        tempChamp = {
                            id: champion.id,
                            name: champion.name,
                            tier: champion.tier,
                            imageurl: champion.imageurl,
                            origins: champion.origins,
                            classes: champion.classes,
                            starlevel: 3
                        };
                        newBoardBag[i][j] = tempChamp;
                    } else if (champion && champion?.name === championToPurchase.name && tempChamp && champion.starlevel === 2) {
                        newBoardBag[i][j] = undefined;
                    }
                })
            });

            newBenchBag.forEach((champion, i) => {
                if (champion && champion?.name === championToPurchase.name && !tempChamp && champion.starlevel === 2) {
                    tempChamp = {
                        id: champion.id,
                        name: champion.name,
                        tier: champion.tier,
                        imageurl: champion.imageurl,
                        origins: champion.origins,
                        classes: champion.classes,
                        starlevel: 3
                    };
                    newBenchBag[i] = tempChamp;
                } else if (champion && champion?.name === championToPurchase.name && tempChamp && champion.starlevel === 2) {
                    newBenchBag[i] = undefined;
                }
            });
        }
    }

    // If a champion was leveled up then we do not need to add the purchased champion to the bench since it was used in the level up
    if(!levelUpChampion) {
        for (let i = 0; i < benchBag.length; i++) {
            if(benchBag[i] === undefined) {
                newBenchBag[i] = championToPurchase;
                break;
            }
        }
    }

    if(levelTwoCheckFromShop) {
        let shopChampionsForLevelUp: number = 0;
        for (let i = 0; i < newShopBag.length; i++) {
            if(newShopBag[i] && newShopBag[i]?.name === championToPurchase.name && shopChampionsForLevelUp < 2) {
                newShopBag[i] = undefined;
                shopChampionsForLevelUp++;
            }
        }
    } else {
        newShopBag[shopIndex] = undefined;
    }
    const newGold = gold - championToPurchase.tier;

    return {
        newBoardBag: newBoardBag,
        newBenchBag: newBenchBag,
        newShopBag: newShopBag,
        newGold: newGold,
        levelUpChampion: levelUpChampion
    }
}

export function MoveChampion(boardBag : (Champion|undefined)[][], benchBag : (Champion|undefined)[], active : Active, over : Over, level : number) : { newBoardBag : (Champion|undefined)[][], newBenchBag : (Champion|undefined)[] } {
    if((!active.data.current || !over)) {
        return {
            newBoardBag: boardBag,
            newBenchBag: benchBag
        };
    }

    const currentPosition = active.data.current.currentPosition;
    const newPosition = over.id.toString();

    const championsOnBoard = boardBag.reduce((item, row) => {
        return item + row.reduce((innerItem, index) => innerItem + (index !== undefined ? 1 : 0), 0)
    }, 0);

    const newBoardBag : (Champion|undefined)[][] = [...boardBag];
    const newBenchBag : (Champion|undefined)[] = [...benchBag];
    let tempChampCurrent : Champion|undefined = IdenityPosition(currentPosition, newBoardBag, newBenchBag);
    let tempChampToSwap : Champion|undefined = IdenityPosition(newPosition, newBoardBag, newBenchBag);

    // If board does not have any more room, return
    if (newPosition.includes("-") && !currentPosition.includes("-") && championsOnBoard >= level && !tempChampToSwap) {
        return {
            newBoardBag: boardBag,
            newBenchBag: benchBag
        };
    }

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
 

export function SellChampion(boardBag : (Champion|undefined)[][], benchBag : (Champion|undefined)[], championBag: ChampionBag|undefined, gold : number, currentPosition : string) : { newBoardBag : (Champion|undefined)[][], newBenchBag : (Champion|undefined)[], newChampionBag : ChampionBag|undefined, newGold : number} {
    const newBoardBag : (Champion|undefined)[][] = [...boardBag];
    const newBenchBag : (Champion|undefined)[] = [...benchBag];
    let tempChamp : Champion|undefined = IdenityPosition(currentPosition, newBoardBag, newBenchBag);

    if(!tempChamp || !championBag) {
        return {
            newBoardBag: boardBag,
            newBenchBag: benchBag,
            newChampionBag: championBag,
            newGold: gold
        };
    }

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

    let championsToAddBack : Champion[] = []

    switch(tempChamp.starlevel) {
        case 1:
            championsToAddBack.push(tempChamp);
            break;
        case 2:
            for (let i = 0; i < 2; i++) {
                const tempChampCopy : Champion = {
                    id: tempChamp.id + `-${i}`,
                    name: tempChamp.name,
                    tier: tempChamp.tier,
                    imageurl: tempChamp.imageurl,
                    origins: tempChamp.origins,
                    classes: tempChamp.classes,
                    starlevel: 1
                }
                championsToAddBack.push(tempChampCopy);
            }
            championsToAddBack.push(tempChamp);
            break
        case 3:
            for (let i = 0; i < 8; i++) {
                const tempChampCopy : Champion = {
                    id: tempChamp.id + `-${i}`,
                    name: tempChamp.name,
                    tier: tempChamp.tier,
                    imageurl: tempChamp.imageurl,
                    origins: tempChamp.origins,
                    classes: tempChamp.classes,
                    starlevel: 1
                }
                championsToAddBack.push(tempChampCopy);
            }
            championsToAddBack.push(tempChamp);
            break;
    }

    //Return champion to game bag
    switch(tempChamp.tier) {
        case 1:
            championsToAddBack.forEach(champion => championBag.Tier1Units.push(champion));
            break;
        case 2: 
            championsToAddBack.forEach(champion => championBag.Tier2Units.push(champion));
            break;
        case 3:
            championsToAddBack.forEach(champion => championBag.Tier3Units.push(champion));
            break;
        case 4:
            championsToAddBack.forEach(champion => championBag.Tier4Units.push(champion));
            break;
        case 5:
            championsToAddBack.forEach(champion => championBag.Tier5Units.push(champion));
            break;
    }

    const newGold = gold + tempChamp.tier;
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

export function BuyXP(level: number, xp: number, gold: number) : { newLevel: number, newXP: number, newGold: number} {
    const xpNeededToLevel = XP_NEEDED[level - 2];
    const newGold = gold - 4;
    let newXP = xp + 4;
    let newLevel = level;

    if(newXP >= xpNeededToLevel) {
        newLevel++;
        newXP -= xpNeededToLevel;
    }

    return {
        newLevel: newLevel,
        newXP: newXP,
        newGold: newGold,
    };
}

export function FetchShopBag(championBag : ChampionBag|undefined, boardBag : (Champion|undefined)[][], benchBag : (Champion|undefined)[], shopBag : (Champion|undefined)[], level : number) : { newChampionBag : ChampionBag|undefined , newShopBag : Champion[] } {
    const shopOdds: number[] = SHOP_ODDS[level - 2];
    const currentShopTiers: number[] = [];
    const newShop: Champion[] = [];
    const flatBoardBag: (Champion|undefined)[] = boardBag.flat();
    const threeStarChampions: Champion[] = [];

    const threeStarCheck = flatBoardBag.filter(champion => 
        champion &&
        champion.starlevel === 3
    ).length > 0 ||
    benchBag.filter(champion => 
        champion &&
        champion.starlevel === 3
    ).length > 0;

    if(threeStarCheck) {
        flatBoardBag.forEach((champion) => {
            if(champion?.starlevel === 3) {
                threeStarChampions.push(champion);
            }
        })
    }
    
    //Check if champion bag has been set
    if (undefined === championBag) {
        return { 
            newChampionBag: championBag, 
            newShopBag: newShop
        };
    }

    //Refill champion bag with leftover shop units
    if (shopBag.length > 0) {
        for (var i = 0; i < 5; i++) {
            let tempChampion = shopBag.shift();
            if (tempChampion !== undefined) {
                switch(tempChampion?.tier) {
                    case 1:
                        championBag.Tier1Units.push(tempChampion);
                        break;
                    case 2:
                        championBag.Tier2Units.push(tempChampion);
                        break;
                    case 3:
                        championBag.Tier3Units.push(tempChampion);
                        break;
                    case 4:
                        championBag.Tier4Units.push(tempChampion);
                        break;
                    case 5:
                        championBag.Tier5Units.push(tempChampion);
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
            classes: [],
            starlevel: 1
        };

        let redoSelection = true;

        switch(currentShopTiers[index]) {
            case 1:
                while(redoSelection) {
                    redoSelection = false;
                    randomIndex = Math.floor(Math.random() * championBag.Tier1Units.length);
                    newChampion = championBag.Tier1Units[randomIndex];
                    if(threeStarCheck && threeStarChampions.some(champion => champion.name === newChampion.name)) {
                        redoSelection = true;
                    }
                }
                championBag.Tier1Units.splice(randomIndex, 1);
                newShop.push(newChampion);
                break;
            case 2:
                while(redoSelection) {
                    redoSelection = false;
                    randomIndex = Math.floor(Math.random() * championBag.Tier2Units.length);
                    newChampion = championBag.Tier2Units[randomIndex];
                    if(threeStarCheck && threeStarChampions.some(champion => champion.name === newChampion.name)) {
                        redoSelection = true;
                    }
                }
                championBag.Tier2Units.splice(randomIndex, 1);
                newShop.push(newChampion);
                break;
            case 3:
                while(redoSelection) {
                    redoSelection = false;
                    randomIndex = Math.floor(Math.random() * championBag.Tier3Units.length);
                    newChampion = championBag.Tier3Units[randomIndex];
                    if(threeStarCheck && threeStarChampions.some(champion => champion.name === newChampion.name)) {
                        redoSelection = true;
                    }
                }
                championBag.Tier3Units.splice(randomIndex, 1);
                newShop.push(newChampion);
                break;
            case 4:
                while(redoSelection) {
                    redoSelection = false;
                    randomIndex = Math.floor(Math.random() * championBag.Tier4Units.length);
                    newChampion = championBag.Tier4Units[randomIndex];
                    if(threeStarCheck && threeStarChampions.some(champion => champion.name === newChampion.name)) {
                        redoSelection = true;
                    }
                }
                championBag.Tier4Units.splice(randomIndex, 1);
                newShop.push(newChampion);
                break;
            case 5:
                while(redoSelection) {
                    redoSelection = false;
                    randomIndex = Math.floor(Math.random() * championBag.Tier5Units.length);
                    newChampion = championBag.Tier5Units[randomIndex];
                    if(threeStarCheck && threeStarChampions.some(champion => champion.name === newChampion.name)) {
                        redoSelection = true;
                    }
                }
                championBag.Tier5Units.splice(randomIndex, 1);
                newShop.push(newChampion);
                break;
        }
    }

    return { 
        newChampionBag : championBag, 
        newShopBag: newShop
    };
}


export function EndGame(gameContext : GameContextType) {
    gameContext.setShopBag(Array(5).fill(undefined));
    gameContext.setLevel(7);
    gameContext.setGold(50);
    gameContext.setTime(50);
    gameContext.setGameActive(false);
    gameContext.setGameEnded(true);
    return;
}