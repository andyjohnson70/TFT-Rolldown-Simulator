import { prototype } from "events";
import { Champion } from "../lib/definitions";
import { useContext } from "react";
import { GameContext } from "../context/context";

interface ChampionProps {
    champion?: Champion,
    shopIndex: number
}

interface TraitItemProps {
    name: string
}

export function ChampionCard(props: ChampionProps) {
    const gameContext = useContext(GameContext);
    const purchaseChampion = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
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

export function ChampionHex(props: ChampionProps) {
    return (
        <div>

        </div>
    );
}