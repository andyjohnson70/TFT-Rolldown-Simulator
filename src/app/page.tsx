"use client";
import { BuyXP, FetchShopBag, InitializeChampionBag, MoveChampion, PurchaseChampion, SellChampion } from "./scripts/actions";
import { RerollButton, XpButton } from "./components/buttons";
import { Shop } from "./components/shop";
import { GameContext } from "./context/context";
import { Champion, ChampionBag, ChampionDataModel } from "./lib/definitions";
import useSWRImmutable from "swr/immutable";
import Board from "./components/board";
import Bench from "./components/bench";
import { useEffect, useState } from "react";
import { DndContext, DragEndEvent, MouseSensor, Over, useSensor, useSensors } from "@dnd-kit/core";
import GameMenu from "./components/gamemenu";
import { Timer } from "./components/timer";
import useSound from "use-sound";
import Dashboard from "./components/dashboard";
import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from '@vercel/speed-insights';
import React from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data } = useSWRImmutable<ChampionDataModel[]>("/api", fetcher)

  const [initialChampionList, setInitialChampionList] = useState<ChampionDataModel[]|undefined>(undefined);
  const [championBag, setChampionBag] = useState<ChampionBag|undefined>(undefined);
  const [level, setLevel] = useState<number>(7);
  const [shopBag, setShopBag] = useState<(Champion|undefined)[]>(Array(5).fill(undefined));
  const [benchBag, setBenchBag] = useState<(Champion|undefined)[]>(Array(9).fill(undefined));
  const [boardBag, setBoardBag] = useState<(Champion|undefined)[][]>(Array.from(Array(4), () => new Array(7).fill(undefined)));
  const [xp, setXP] = useState<number>(0);
  const [gold, setGold] = useState<number>(50); 
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [time, setTime] = useState<number>(50);
  const [xpKeybind, setXPKeybind] = useState<string>("f");
  const [rerollKeybind, setRerollKeybind] = useState<string>("d");
  const [sellKeybind, setSellKeybind] = useState<string>("e");
  const [arenaUrl, setArenaUrl] = useState<string>("public/arenas/Arena.jpg");
  const [rerollSFX] = useSound("/sounds/reroll.mp3");
  const [sellSFX] = useSound("/sounds/sell.mp3");
  const [xpSFX] = useSound("/sounds/xp.mp3");
  const [purchaseSFX] = useSound("/sounds/purchase.mp3");
  const [levelUpSFX] = useSound("/sounds/levelup.mp3");
  injectSpeedInsights();
  inject();
  

  if (undefined === initialChampionList && data) {
    setInitialChampionList(data);
  }

  if(undefined === championBag && initialChampionList) {
    const initialChampionBag = InitializeChampionBag(initialChampionList);
    setChampionBag(initialChampionBag);
  }

  function handleKeydownEvent(event: KeyboardEvent) {
    if(!gameActive) return
    
    if(event.key === rerollKeybind  && gold >= 2) {
        const { newChampionBag, newShopBag } = FetchShopBag(championBag, boardBag, benchBag, shopBag, level);
        rerollSFX();
        setChampionBag(newChampionBag);
        setShopBag(newShopBag);
        setGold(gold.valueOf() - 2);
    }

    if(event.key === xpKeybind && gold >= 4 && level < 10) {
      const { newLevel, newXP, newGold } = BuyXP(level, xp, gold);
      xpSFX();
      setLevel(newLevel);
      setXP(newXP);
      setGold(newGold);
    }

    if(event.key === sellKeybind) {

    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const {active, over} = event;

    if(active && active.id.toString().includes('card_') && ((over && over.id !== 'shop') || !over)) {
      if((!active.data.current) || 
        (!benchBag.some((slot) => slot === undefined) && 
        benchBag.filter(champion => champion && active.data.current && champion.name === active.data.current.props.champion?.name && champion.starlevel === 1).length < 2) ||
        gold < active.data.current.props.champion?.tier) {
        return;
      }

      const {newBoardBag, newBenchBag, newShopBag, newGold, levelUpChampion} = PurchaseChampion(boardBag, benchBag, shopBag, gold, active.data.current.props);
        purchaseSFX();
        if(levelUpChampion) {
            levelUpSFX();
        }
        setBoardBag(newBoardBag);
        setBenchBag(newBenchBag);
        setShopBag(newShopBag);
        setGold(newGold);
        return;
    }

    if(over && over.id === 'shop' && active && !active.id.toString().includes('card_')) {
      if(!active.data.current || !active.data.current.currentPosition) {
        return;
      }
      const { newBoardBag, newBenchBag, newChampionBag, newGold } = SellChampion(boardBag, benchBag, championBag, gold, active.data.current.currentPosition);
      sellSFX();
      //If bench bags are not equal to each other the unit sold was from the bench
      if(JSON.stringify(newBenchBag) !== JSON.stringify(benchBag)) {
        setBenchBag(newBenchBag);
      } else {
        setBoardBag(newBoardBag);
      }
      setChampionBag(newChampionBag);
      setGold(newGold);
      return;
    } 
    else if (over && over.id && active && !active.id.toString().includes('card_')) {
      const { newBoardBag, newBenchBag } = MoveChampion(boardBag, benchBag, active, over, level);
      setBoardBag(newBoardBag);
      setBenchBag(newBenchBag);
      return;
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeydownEvent)
    return () => window.removeEventListener('keydown', handleKeydownEvent)
  })

  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });
  const sensors = useSensors(
    mouseSensor
  );
  return (
    <GameContext.Provider value={{
      initialChampionList, setInitialChampionList,
      championBag, setChampionBag,
      level, setLevel,
      shopBag, setShopBag,
      benchBag, setBenchBag,
      boardBag, setBoardBag,
      xp: xp, setXP: setXP,
      gold, setGold,
      gameActive, setGameActive,
      gameEnded, setGameEnded,
      time, setTime,
      xpKeybind, setXPKeybind,
      rerollKeybind, setRerollKeybind,
      sellKeybind, setSellKeybind,
      arenaUrl, setArenaUrl
    }}>
      <DndContext autoScroll={false} onDragEnd={handleDragEnd} sensors={sensors}>          
        <main className="flex min-h-screen flex-col items-center overflow-hidden">
          { !gameActive ? <GameMenu /> : null}
          <div className="flex flex-col grow items-center w-full">
            <div>
              <Timer />
            </div>
            <div className="active-traits">

            </div>

            <div className="grow content-end pb-8">
              <Board/>
            </div>

            <div className="flex justify-center w-full min-h-min">
              <Bench />
            </div>
          </div>

          <div className="flex items-center flex-col h-48 w-full">
            <div className="dashboard h-1/5 w-full xl:w-8/12">
              <Dashboard />
            </div>
      
            <div className="flex h-4/5 w-full xl:w-8/12 border-[#785a28] border-x-2 border-t-2">
              <div className="flex flex-col justify-center bg-[#262d39] w-1/5">
                <XpButton />
                <RerollButton />
              </div>
              <div className="bg-[#152023] w-4/5">
                <Shop />
              </div>
              
            </div>
          </div>
        
        </main>
      </DndContext>
    </GameContext.Provider>
    
  );
}
