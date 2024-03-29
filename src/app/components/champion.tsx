import { Champion, GameContextType } from "../lib/definitions";
import { CSSProperties, useContext } from "react";
import { GameContext } from "../context/context";
import { PurchaseChampion } from "../scripts/actions";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities"
import Image from "next/image";

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
    const purchaseChampion = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        //If bench has no space, then you cannot purchase a champion
        if(!gameContext.benchBag.some((slot) => slot === undefined)) {
            return;
        }
        const {newBoardBag, newBenchBag, newShopBag, newGold, levelUpChampion} = PurchaseChampion(gameContext, props);
        gameContext.setBoardBag(newBoardBag);
        gameContext.setBenchBag(newBenchBag);
        gameContext.setShopBag(newShopBag);
        gameContext.setGold(newGold);
    }

    return (
        undefined != props.champion ?
        <div className="champion-card w-1/5 m-2" onClick={purchaseChampion}>
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
            currentPosition: props.currentPosition
        }
    });

    const style : CSSProperties = {
        backgroundImage: `url(${props.champion.imageurl})`,
        transform: CSS.Translate.toString(transform),
    };

    return (
        <div ref={setNodeRef} {...listeners} {...attributes}
        className="champion-hex bg-no-repeat bg-[90%_100%]" style={style}>
            <div className="">{props.champion.starlevel}</div>
        </div>
    );
}