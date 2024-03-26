"use client"
import { createContext } from "react";
import { GameContextType } from "../lib/definitions";

export const GameContext = createContext<GameContextType>({
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
    totalXP: 0,
    setTotalXP: () => {},
    gold: 50,
    setGold: () => {},
    gameActive: false,
    setGameActive: () => {},
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
