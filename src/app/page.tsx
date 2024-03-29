"use client";
import { InitializeChampionBag, MoveChampion, SellChampion } from "./scripts/actions";
import { RerollButton, XpButton } from "./components/buttons";
import { Shop } from "./components/shop";
import { GameContext } from "./context/context";
import { Champion, ChampionBag, ChampionDataModel } from "./lib/definitions";
import useSWRImmutable from "swr/immutable";
import Board from "./components/board";
import Bench from "./components/bench";
import { useState } from "react";
import { DndContext, DragEndEvent, Over } from "@dnd-kit/core";
import GameMenu from "./components/gamemenu";
import { Timer } from "./components/timer";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data } = useSWRImmutable<ChampionDataModel[]>("/api", fetcher)

  const [initialChampionList, setInitialChampionList] = useState<ChampionDataModel[]|undefined>(undefined);
  const [championBag, setChampionBag] = useState<ChampionBag|undefined>(undefined);
  const [level, setLevel] = useState<number>(7);
  const [shopBag, setShopBag] = useState<(Champion|undefined)[]>(Array(5).fill(undefined));
  const [benchBag, setBenchBag] = useState<(Champion|undefined)[]>(Array(9).fill(undefined));
  const [boardBag, setBoardBag] = useState<(Champion|undefined)[][]>(Array.from(Array(4), () => new Array(7).fill(undefined)));
  const [totalXP, setTotalXP] = useState<number>(74);
  const [gold, setGold] = useState<number>(50); 
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [time, setTime] = useState<number>(50);
  const [xpKeybind, setXPKeybind] = useState<string>("f");
  const [rerollKeybind, setRerollKeybind] = useState<string>("d");
  const [sellKeybind, setSellKeybind] = useState<string>("e");
  const [arenaUrl, setArenaUrl] = useState<string>("public/arenas/Arena.jpg");

  if (undefined === initialChampionList && data) {
    setInitialChampionList(data);
  }

  if(undefined === championBag && initialChampionList) {
    const initialChampionBag = InitializeChampionBag(initialChampionList);
    setChampionBag(initialChampionBag);
  }

  function handleDragEnd(event: DragEndEvent) {
    const {active, over} = event;

    if(over && over.id === 'shop') {
      const { newBoardBag, newBenchBag, newChampionBag, newGold } = SellChampion(boardBag, benchBag, championBag, gold, active, over);
      //If bench bags are not equal to each other the unit sold was from the bench
      if(JSON.stringify(newBenchBag) !== JSON.stringify(benchBag)) {
        setBenchBag(newBenchBag);
      } else {
        setBoardBag(newBoardBag);
      }
      setChampionBag(newChampionBag);
      setGold(newGold);
    } 
    else if (over && over.id) {
      const { newBoardBag, newBenchBag } = MoveChampion(boardBag, benchBag, active, over);
      setBoardBag(newBoardBag);
      setBenchBag(newBenchBag);
    }
  }
  
  return (
    <GameContext.Provider value={{
      initialChampionList, setInitialChampionList,
      championBag, setChampionBag,
      level, setLevel,
      shopBag, setShopBag,
      benchBag, setBenchBag,
      boardBag, setBoardBag,
      totalXP, setTotalXP,
      gold, setGold,
      gameActive, setGameActive,
      time, setTime,
      xpKeybind, setXPKeybind,
      rerollKeybind, setRerollKeybind,
      sellKeybind, setSellKeybind,
      arenaUrl, setArenaUrl
    }}>
      <DndContext autoScroll={false} onDragEnd={handleDragEnd}>          
        <main className="flex min-h-screen flex-col items-center overflow-hidden">
          { gameActive ? <GameMenu /> : null}
          <div className="flex flex-col items-center grow w-full">
            <div>
              <Timer />
            </div>
            <div className="active-traits">

            </div>

            <div className="grow content-end pb-20">
              <Board/>
            </div>

            <div className="flex justify-center w-full min-h-min">
              <Bench />
            </div>
          </div>

          <div className="flex items-center flex-col h-48 w-full">
            <div className="dashboard bg-slate-300 opacity-25 h-1/5 w-full xl:w-8/12">
            
            </div>
      
            <div className="flex h-4/5 w-full xl:w-8/12">
              <div className="flex flex-col bg-slate-700 w-1/5">
                <XpButton />
                <RerollButton />
              </div>
              <div className="bg-slate-800 w-4/5">
                <Shop />
              </div>
              
            </div>
          </div>
        
        </main>
      </DndContext>
    </GameContext.Provider>
    
  );
}
