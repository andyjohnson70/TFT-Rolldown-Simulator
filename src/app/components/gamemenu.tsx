import { GameContext } from "../context/context";
import { useContext } from "react";
import { EndGame, FetchShopBag, InitializeChampionBag } from "../scripts/actions";
import useSound from "use-sound";
import { Champion } from "../lib/definitions";
import { ChampionHex } from "./champion";
import React from "react";


export default function GameMenu() {
    const[bellSFX] = useSound("/sounds/bell.mp3");
    const gameContext = useContext(GameContext);
    const level = gameContext.level;
    const gold = gameContext.gold;
    let time = gameContext.time;

    function startTimer() {
        if(time > 0) {
            let interval = setInterval(() => {
                time--;
                gameContext.setTime(time);
                
                if(time === 3) {
                    bellSFX();
                }
                if (time === 1) {
                    setTimeout(() => {
                        EndGame(gameContext);
                    }, 2000);
                 }
                 if(time === 0) {
                    clearInterval(interval);
                }

            }, 1000);
        } else {
            
        }
    }

    const handleGameStart = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if(!gameContext.championBag) {
            return;
        }
        gameContext.setBenchBag(Array(9).fill(undefined));
        gameContext.setBoardBag(Array.from(Array(4), () => new Array(7).fill(undefined)));
        const initialChampionBag = InitializeChampionBag(gameContext.initialChampionList);
        gameContext.setChampionBag(initialChampionBag);
        const { newChampionBag, newShopBag } = FetchShopBag(gameContext.championBag, gameContext.boardBag, gameContext.benchBag, gameContext.shopBag, gameContext.level);
        gameContext.setShopBag(newShopBag);
        gameContext.setChampionBag(newChampionBag);
        gameContext.setGameEnded(false);
        gameContext.setGameActive(true);
        startTimer();
    }

    return (
        <div id="gameMenu" className="fixed z-50 left-0 top-0 w-full h-full bg-slate-900 bg-opacity-75">
            <div className="gameMenuModal bg-[#010a13] border-[#785a28] border-2 opacity-100 fixed flex flex-row inset-x-0 mt-10 m-auto z-11 w-3/4 h-3/4">
                <div className="left-section border-r-[#785a28] border-r-2 flex flex-col h-full w-full xl:w-6/12">
                    <div className="text-[#efe5d1] text-4xl p-3 xl:pb-12">
                        Game Options
                    </div>
                    <div className="flex flex-col h-full gap-y-4">
                        <div className="option-row flex justify-between p-3">
                            <label className="option-label text-[#ccbd91] text-2xl">
                                Level:
                            </label>
                            <input id="level" type="number" min="2" max="10" className="input text-center rounded-lg border-[#715527] border-2 max-w-[40px]" onChange={e => gameContext.setLevel(Number(e.target.value))} value={level}></input>
                        </div>

                        <div className="option-row flex justify-between p-3">
                            <label className="option-labe text-[#ccbd91] text-2xl">
                                Gold:
                            </label>
                            <input id="gold" type="number" min="0" className="input text-center rounded-lg border-[#715527] border-2 max-w-[60px]" onChange={e => gameContext.setGold(Number(e.target.value))} value={gold}></input>
                        </div>

                        <div className="option-row flex justify-between p-3">
                            <label className="option-label text-[#ccbd91] text-2xl">
                                Time:
                            </label>
                            <input id="time" type="number" min="1" className="input text-center rounded-lg border-[#715527] border-2 max-w-[60px]" onChange={e => gameContext.setTime(Number(e.target.value))} value={time}></input>
                        </div>

                        <div className="option-row flex justify-between p-3">
                            <label className="option-label text-[#ccbd91] text-2xl">
                                Reroll Shop Keybind:
                            </label>
                            <input id="rerollKeybind" type="text" maxLength={1} className="input text-center rounded-lg border-[#715527] border-2 max-w-[40px]" onChange={e => gameContext.setRerollKeybind(e.target.value)} value={gameContext.rerollKeybind}></input>
                        </div>

                        <div className="option-row flex justify-between p-3">
                        <label className="option-label text-[#ccbd91] text-2xl">
                                Buy XP Keybind:
                            </label>
                            <input id="xpKeybind" type="text" maxLength={1} className="input text-center rounded-lg border-[#715527] border-2 max-w-[40px]" onChange={e => gameContext.setXPKeybind(e.target.value)} value={gameContext.xpKeybind}></input>
                        </div>

                        <div className="option-row flex mt-auto justify-between pb-8">
                            <button className="bg-[#1e2328] border-[#c8aa6d] border-2 text-[#ccbd91] w-6/12 mx-auto" onClick={handleGameStart}>
                                Start
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col h-full">
                    {!gameContext.gameEnded ?
                        <Overview /> :
                        <GameSummary />
                    }
                </div>
            </div>
        </div>
    );
}

function Overview () {
    return (
        <div className="flex flex-col w-3/4 mx-auto">
            <div className="text-[#efe5d1] text-4xl mx-auto p-3 xl:pb-12">
                Overview
            </div>

            <div className="text-[#efe5d1] text-xl mx-auto p-3">
                Use this tool to help pracice your roll down turns in Teamfight Tactics.
            </div>

            <div className="text-[#efe5d1] text-xl mx-auto p-3">
                Set your current level, how much gold you have, how long your turn is, and your keybinds to start.
            </div>

            <div className="text-[#efe5d1] text-xl mx-auto p-3">
                @ScarnoseJohnson on Twitter for any suggestions or bug reports.
            </div>

            <div className="text-[#efe5d1] text-xl mx-auto p-3">
                Enjoy!
            </div>
        </div>
    );
}

function GameSummary () {
    const gameContext = useContext(GameContext);
    const flatBoardBag: (Champion|undefined)[] = gameContext.boardBag.flat();
    return (
        <div className="flex flex-col">
            <div className="text-[#efe5d1] font-bold text-2xl mx-auto">Game Summary</div>
            <div className="flex flex-col">
                <div className="text-[#efe5d1] font-bold text-xl mx-auto pt-8">Board</div>
                <div className="flex flex-row mx-auto gap-x-2">
                    {flatBoardBag.map((champion, id) => {
                        return champion ? <ChampionHex key={`board_champion_hex_${id}`} champion={champion} currentPosition="id" /> : null
                    })}
                </div>
            </div>

            <div className="flex flex-col">
                <div className="text-[#efe5d1] font-bold text-xl mx-auto pt-8">Bench</div>
                <div className="flex flex-row mx-auto gap-x-2">
                    {gameContext.benchBag.map((champion, id) => {
                        return champion ? <ChampionHex key={`bench_champion_hex_${id}`} champion={champion} currentPosition="id" /> : null
                    })}
                </div>
            </div>
        </div>
    );
}