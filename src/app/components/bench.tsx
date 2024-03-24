import { CSSProperties, useContext } from "react";
import { Champion } from "../lib/definitions";
import { GameContext } from "../context/context";
import { ChampionHex } from "./champion";
import { useDroppable } from "@dnd-kit/core";

interface BenchSlotProps {
    champion?: Champion,
    index: number
}

export default function Bench() {
    const gameContext = useContext(GameContext);
    return (
        <div className="bench flex justify-around place-items-stretch h-full">
            {gameContext.benchBag.map((champion, id) => {
                return <BenchSlot champion={champion} index={id} key={`bench_slot_${id}`} />
            })}
        </div>
    );
}

function BenchSlot(props: BenchSlotProps) {
    const {isOver, setNodeRef} = useDroppable({
        id: `bench-slot-${props.index}`
    });

    const style : CSSProperties = {

    };

    return (
        <div style={style} className={
            8 === props.index ?
            'flex justify-around border-l-4 border-r-4 border-l-cyan-600 border-r-cyan-600 h-full w-full' :
            'flex justify-around border-l-4 border-l-cyan-600 h-full w-full'
        }>
            {undefined !== props.champion ?<ChampionHex champion={props.champion}/> : '' }
        </div>
    );
}