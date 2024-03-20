export type Champion = {
    id: string,
    name: string,
    tier: number,
    imageurl: string,
    origins: string[],
    classes: string[]
}

export type GameContextType = {
    championBag: ChampionBag|undefined,
    setChampionBag: React.Dispatch<React.SetStateAction<ChampionBag|undefined>>,
    shopBag: (Champion|undefined)[],
    setShopBag: React.Dispatch<React.SetStateAction<(Champion|undefined)[]>>,
    benchBag: (Champion|undefined)[],
    setBenchBag: React.Dispatch<React.SetStateAction<(Champion|undefined)[]>>,
    level: number,
    setLevel: React.Dispatch<React.SetStateAction<number>>,
    totalXP: number,
    setTotalXP: React.Dispatch<React.SetStateAction<number>>,
    gold: number,
    setGold: React.Dispatch<React.SetStateAction<number>>,
    gameActive: boolean,
    setGameActive: React.Dispatch<React.SetStateAction<boolean>>,
    time: number,
    setTime: React.Dispatch<React.SetStateAction<number>>,
    xpKeybind: string,
    setXPKeybind: React.Dispatch<React.SetStateAction<string>>,
    rerollKeybind: string,
    setRerollKeybind: React.Dispatch<React.SetStateAction<string>>,
    sellKeybind: string,
    setSellKeybind: React.Dispatch<React.SetStateAction<string>>
    arenaUrl: string,
    setArenaUrl: React.Dispatch<React.SetStateAction<string>>
}

export type ChampionBag = {
    Tier1Units: Champion[],
    Tier2Units: Champion[],
    Tier3Units: Champion[],
    Tier4Units: Champion[],
    Tier5Units: Champion[]
}

export enum BagSize {
    Tier1 = 22,
    Tier2 = 20,
    Tier3 = 17,
    Tier4 = 10,
    Tier5 = 9
}

export const SHOP_ODDS: number[][] = [[100, 0, 0, 0, 0],  //Level 2
                                        [75, 25, 0, 0, 0], //Level 3
                                        [55, 30, 15, 0, 0], //Level 4
                                        [45, 33, 20, 2, 0], //Level 5
                                        [30, 40, 25, 5, 0], //Level 6
                                        [19, 30, 40, 10, 1], //Level 7
                                        [18, 25, 32, 22, 3], //Level 8
                                        [10, 20, 25, 35, 10], //Level 9
                                        [5, 10, 20, 40, 25]] //Level 10

