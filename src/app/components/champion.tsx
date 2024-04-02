import { Champion } from "../lib/definitions";
import { CSSProperties, useContext, useEffect, useState } from "react";
import { GameContext } from "../context/context";
import { PurchaseChampion, SellChampion } from "../scripts/actions";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities"
import Image from "next/image";
import useSound from 'use-sound';
import React from "react";

export interface ChampionCardProps {
    champion?: Champion,
    shopIndex: number
}

interface ChampionHexProps {
    champion: Champion,
    currentPosition: string
}

interface TraitItemProps {
    name: string
}

export function ChampionCard(props: ChampionCardProps) {
    const gameContext = useContext(GameContext);
    const [purchaseSFX] = useSound("/sounds/purchase.mp3");
    const [levelUpSFX] = useSound("/sounds/levelup.mp3");

    const {isDragging, attributes, listeners, setNodeRef, transform, over} = useDraggable({
        id: props.champion ? `card_${props.champion.id}` : '',
        data: {
            props: props,
        },
        disabled: !gameContext.gameActive
    });

    const style : CSSProperties = {
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 1000 : 1
    };

    const purchaseChampion = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();

        if(props.champion && (!gameContext.gameActive || gameContext.gold < props.champion?.tier)) {
            return;
        }

        // This is gross but shop logic is very tricky
        if(!gameContext.benchBag.some((slot) => slot === undefined) &&
        gameContext.benchBag.filter(champion => champion && champion.name === props.champion?.name && champion.starlevel === 1).length < 2) {

            if(!gameContext.benchBag.some((slot) => slot === undefined) &&
            !(gameContext.benchBag.filter(champion => champion && champion.name === props.champion?.name && champion.starlevel === 1).length === 1 &&
            gameContext.shopBag.filter(champion => champion && champion.name === props.champion?.name).length >= 2)) {
                return;
            }
        }

        const {newBoardBag, newBenchBag, newShopBag, newGold, levelUpChampion} = PurchaseChampion(gameContext.boardBag, gameContext.benchBag, gameContext.shopBag, gameContext.gold, props);
        purchaseSFX();
        if(levelUpChampion) {
            levelUpSFX();
        }
        gameContext.setBoardBag(newBoardBag);
        gameContext.setBenchBag(newBenchBag);
        gameContext.setShopBag(newShopBag);
        gameContext.setGold(newGold);
    }

    return (
        undefined != props.champion ?
        <div className="champion-card w-1/5 m-2" onClick={purchaseChampion} ref={setNodeRef} {...listeners} {...attributes} style={style}>
            <div className={`bg-center relative bg-no-repeat bg-cover h-4/5 tier-${props.champion.tier}-border`} style={{
                backgroundImage: `url(${props.champion.imageurl})`,
            }}>
                <div className="tier-indicator top-0 z-10 w-8/12 mx-auto">{
                    props.champion.tier > 1 ?
                    <Image alt="tier-indicator" width={100} height={100} src={`/tiers/cost-${props.champion.tier}.webp`}/> :
                    null
                }
                </div>
                <div className="absolute bottom-0 z-10">
                    <ul className="origin-list">
                        {props.champion.origins.map((trait, id) => {
                            return <TraitItem name={trait} key={`origin_trait_${id}`}/>
                        })}
                    </ul>
                    <ul className="class-list">
                        {props.champion.classes.map((trait, id) => {
                            return <TraitItem name={trait} key={`class_trait_${id}`}/>
                        })}
                    </ul>
                </div>
            </div>

            <div className={`champion-card-footer text-[#f9faf6] p-1 items-center flex flex-row h-1/5 tier-${props.champion.tier}-card-bg`}>
                <div className="champion-name basis-3/4">{props.champion.name}</div>
                <div className="champion-cost basis-1/4 flex justify-end">{props.champion.tier}</div>
            </div>
        </div>
        :
        <div className="champion-card bg-black w-1/5 m-2">
            <div className="">
            </div>
        </div>
    );
}

function TraitItem(props: TraitItemProps) {
    return(
        <li className="text-white flex flex-row items-center">
            <div className="traitHex flex items-center border-black border-[1px] rounded-full bg-[#3d3c39] w-[20px] h-[20px] m-1">
                <Image alt={`${props.name}`} width={16} height={16} className="mx-auto p-[2px]" src={`/traits/${props.name}.png`} />
            </div>
            {props.name}
        </li>
    ) 
}

export function ChampionHex(props: ChampionHexProps) {
    const gameContext = useContext(GameContext);
    const [hovered, setHovered] = useState(false)
    const [sellSFX] = useSound("/sounds/sell.mp3");
    const {isDragging, attributes, listeners, setNodeRef, transform, over} = useDraggable({
        id: `${props.champion.id}`,
        data: {
            tier: props.champion.tier,
            currentPosition: props.currentPosition,
        },
        disabled: !gameContext.gameActive
    });

    const hexStyle : CSSProperties = {
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 1000 : 1
    };

    const style : CSSProperties = {
        backgroundImage: `url(${props.champion.imageurl})`,
    };

    const handleKeydownEvent = (event: KeyboardEvent) => {
        if (!props.champion || !gameContext.gameActive || !hovered) return

        if (event.key === gameContext.sellKeybind) {
            const { newBoardBag, newBenchBag, newChampionBag, newGold } = SellChampion(gameContext.boardBag, gameContext.benchBag, gameContext.championBag, gameContext.gold, props.currentPosition);
            sellSFX();
            //If bench bags are not equal to each other the unit sold was from the bench
            if(JSON.stringify(newBenchBag) !== JSON.stringify(gameContext.benchBag)) {
                gameContext.setBenchBag(newBenchBag);
            } else {
                gameContext.setBoardBag(newBoardBag);
            }
            gameContext.setChampionBag(newChampionBag);
            gameContext.setGold(newGold);
            return;
        }
    }

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault()
        setHovered(true)
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault()
        setHovered(false)
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeydownEvent)
        return () => window.removeEventListener('keydown', handleKeydownEvent)
      })

    return (
        <div ref={setNodeRef} {...listeners} {...attributes} style={hexStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="relative">
            <div className="absolute inset-x-0 top-0 flex flex-row justify-center">
                <div className="flex z-10">
                    {props.champion.origins.map((origin, id) => {
                        return <div key={`trait_${id}`} className="flex items-center border-black border-[1px] rounded-full bg-[#3d3c39] w-[20px] h-[20px] m-1"><Image alt={origin} width={16} height={16} className="mx-auto p-[2px]" src={`/traits/${origin}.png`} /></div>
                    })}
                </div>  
                <div className="flex z-10">
                    {props.champion.classes.map((name, id) => {
                        return <div key={`trait_${id}`} className="flex items-center border-black border-[1px] rounded-full bg-[#3d3c39] w-[20px] h-[20px] m-1"><Image alt={name} width={16} height={16} className="mx-auto p-[2px]" src={`/traits/${name}.png`}/></div>
                    })}
                </div>  
            </div>

            <div className="hex flex flex-col items-center bg-no-repeat bg-[90%_100%]" style={style}>
                <div className="text-white text-md grow content-center border-text">{props.champion.name}</div>
            </div>

            <div className="absolute inset-x-0 bottom-0 flex flex-row justify-center">
                <div className="z-10">{props.champion.starlevel > 1 ? <Image alt={`${props.champion.starlevel}`} width={50} height={20} className="mx-auto p-[2px]" src={props.champion.starlevel === 3 ? "/threeStar.png" : "/twoStar.png"}/> : <div className="h-[20px]"></div> }</div>
            </div>
        </div>
        
    );
}