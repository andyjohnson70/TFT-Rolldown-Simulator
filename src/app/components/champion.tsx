import { Champion, GameContextType } from "../lib/definitions";
import { CSSProperties, useContext } from "react";
import { GameContext } from "../context/context";
import { PurchaseChampion } from "../scripts/actions";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities"

export interface ChampionCardProps {
    champion?: Champion,
    shopIndex: number
}

interface ChampionHexProps {
    champion: Champion
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
        const {newBenchBag, newShopBag} = PurchaseChampion(gameContext, props);
        gameContext.setBenchBag(newBenchBag);
        gameContext.setShopBag(newShopBag);
    }

    return (
        undefined != props.champion ?
        <div className="champion-card w-1/5 m-2" onClick={purchaseChampion}>
            <div className="tier-indicator"></div>
            <div className="bg-center relative bg-no-repeat bg-cover h-4/5" style={{
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

            <div className="champion-card-footer flex flex-row h-1/5">
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
        <li className="text-white">
            {props.name}
        </li>
    ) 
}

export function ChampionHex(props: ChampionHexProps) {
    const {isDragging, attributes, listeners, setNodeRef, transform, over} = useDraggable({
        id: `${props.champion.id}`,
        data: {
            tier: props.champion.tier
        }
    });

    const style : CSSProperties = {
        backgroundImage: `url(${props.champion.imageurl})`,
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 1 : undefined,
    };

    return (
        <div ref={setNodeRef} {...listeners} {...attributes}
        className="hex bg-center relative bg-no-repeat bg-cover" style={style}>

        </div>
    );
}