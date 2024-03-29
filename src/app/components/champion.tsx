import { Champion, GameContextType } from "../lib/definitions";
import { CSSProperties, useContext } from "react";
import { GameContext } from "../context/context";
import { PurchaseChampion } from "../scripts/actions";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities"
import Image from "next/image";
import useSound from 'use-sound';

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
    const [purchaseSFX] = useSound("/sounds/purchase.mp3");
    const [levelUpSFX] = useSound("/sounds/levelup.mp3");

    const gameContext = useContext(GameContext);
    const purchaseChampion = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        //If bench has no space, then you cannot purchase a champion
        if(!gameContext.benchBag.some((slot) => slot === undefined) && gameContext.benchBag.filter(champion => champion && champion.name === props.champion?.name && champion.starlevel === 1).length < 2) {
            return;
        }
        const {newBoardBag, newBenchBag, newShopBag, newGold, levelUpChampion} = PurchaseChampion(gameContext, props);
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
        <div className="champion-card w-1/5 m-2" onClick={purchaseChampion}>
            <audio className="audio">
                <source src="/sounds/purchase.mp3" />
            </audio>
            <div className="tier-indicator"></div>
            <div className={`bg-center relative bg-no-repeat bg-cover h-4/5 tier-${props.champion.tier}-border`} style={{
                backgroundImage: `url(${props.champion.imageurl})`,
            }}>
                <div className="absolute bottom-0">
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
    const {isDragging, attributes, listeners, setNodeRef, transform, over} = useDraggable({
        id: `${props.champion.id}`,
        data: {
            tier: props.champion.tier,
            currentPosition: props.currentPosition,
        }
    });

    const hexStyle : CSSProperties = {
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 1000 : 1
    };

    const style : CSSProperties = {
        backgroundImage: `url(${props.champion.imageurl})`,
    };

    return (
        <div ref={setNodeRef} {...listeners} {...attributes} style={hexStyle} className="relative">
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
                <div className="text-white text-md grow content-center champion-text">{props.champion.name}</div>
            </div>

            <div className="absolute inset-x-0 bottom-0 flex flex-row justify-center">
                <div className="z-10">{props.champion.starlevel > 1 ? <Image alt={`${props.champion.starlevel}`} width={50} height={20} className="mx-auto p-[2px]" src={props.champion.starlevel === 3 ? "/threeStar.png" : "/twoStar.png"}/> : <div className="h-[20px]"></div> }</div>
            </div>
        </div>
        
    );
}