"use client";
import { InitializeChampionBag } from "../../scripts/actions";
import { RerollButton, XpButton } from "./components/buttons";
import { FetchShopBag, Shop } from "./components/shop";
import { useEffect, useState } from "react";
import { GameContext } from "./context/context";
import { Champion, ChampionBag } from "./lib/definitions";
import useSWRImmutable from "swr/immutable";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data } = useSWRImmutable<Champion[]>("/api", fetcher)

  const [championBag, setChampionBag] = useState<ChampionBag|undefined>(undefined);
  const [level, setLevel] = useState<number>(7);
  const [shopBag, setShopBag] = useState<(Champion|undefined)[]>(Array(5).fill(undefined));
  const [benchBag, setBenchBag] = useState<(Champion|undefined)[]>(Array(9).fill(undefined));
  const [totalXP, setTotalXP] = useState<number>(74);
  const [gold, setGold] = useState<number>(50); 
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [time, setTime] = useState<number>(50);
  const [xpKeybind, setXPKeybind] = useState<string>("f");
  const [rerollKeybind, setRerollKeybind] = useState<string>("d");
  const [sellKeybind, setSellKeybind] = useState<string>("e");
  const [arenaUrl, setArenaUrl] = useState<string>("public/arenas/Arena.jpg");

  if(undefined === championBag && data) {
    const initialChampionBag = InitializeChampionBag(data);
    setChampionBag(initialChampionBag);
  }
  

  // const { newChampionBag, newShopBag } = FetchShopBag();
  // setChampionBag(newChampionBag);
  // setShopBag(newShopBag);
 
  return (
    <GameContext.Provider value={{
      championBag, setChampionBag,
      level, setLevel,
      shopBag, setShopBag,
      benchBag, setBenchBag,
      totalXP, setTotalXP,
      gold, setGold,
      gameActive, setGameActive,
      time, setTime,
      xpKeybind, setXPKeybind,
      rerollKeybind, setRerollKeybind,
      sellKeybind, setSellKeybind,
      arenaUrl, setArenaUrl
    }}>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="upper-section">
          <div className="options">
            
          </div>
          <div className="active-traits">

          </div>

          <div className="board">

          </div>

          <div className="bench">

          </div>
        </div>

        <div className="lower-section bg-slate-300 fixed bottom-0 h-44 w-8/12">
          <div className="dashboard h-1/5">
          
          </div>
    
          <div className="shop-container flex h-4/5 w-full">
            <div className="buttons flex flex-col bg-slate-700 w-1/5">
              <XpButton />
              <RerollButton />
            </div>
            <div className="shop bg-slate-800 w-4/5">
              <Shop></Shop>
            </div>
            
          </div>
        </div>
      
      </main>
    </GameContext.Provider>
    
  );
}
