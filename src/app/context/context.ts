"use client"
import { createContext } from "react";
import { GameContextType } from "../lib/definitions";

export const GameContext = createContext<GameContextType>({
    initialChampionList: [],
    setInitialChampionList: () => {},
    championBag: {
        Tier1Units: [],
        Tier2Units: [],
        Tier3Units: [],
        Tier4Units: [],
        Tier5Units: []
    },
    setChampionBag: () => {},
    level: 7,
    setLevel: () => {},
    shopBag: [],
    setShopBag: () => {},
    benchBag: [],
    setBenchBag: () => {},
    boardBag: [],
    setBoardBag: () => {},
    xp: 0,
    setXP: () => {},
    gold: 50,
    setGold: () => {},
    gameActive: false,
    setGameActive: () => {},
    gameEnded: false,
    setGameEnded: () => {},
    time: 50,
    setTime: () => {},
    xpKeybind: "f",
    setXPKeybind: () => {},
    rerollKeybind: "d",
    setRerollKeybind: () => {},
    sellKeybind: "e",
    setSellKeybind: () => {},
    arenaUrl: "public/arenas/Arena.jpg",
    setArenaUrl: () => {}
});
