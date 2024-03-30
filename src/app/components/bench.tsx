import { CSSProperties, useContext, useEffect } from "react";
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
        <div className="bench flex w-full 2xl:w-7/12">
            {gameContext.benchBag.map((champion, id) => {
                return <BenchSlot champion={champion} index={id} key={`bench_slot_${id}`} />
            })}
        </div>
    );
}

function BenchSlot(props: BenchSlotProps) {
    const {isOver, setNodeRef} = useDroppable({
        id: `${props.index}`
    });

    const style : CSSProperties = {
        background: isOver ? 'rgba(255, 255, 255, 0.25)' : undefined
    };

    return (
        <div ref={setNodeRef} id={props.index.toString()} style={style} className={
            8 === props.index ?
            'flex justify-around border-l-4 border-r-4 border-l-cyan-600 border-r-cyan-600 h-full w-full min-w-[105px]' :
            'flex justify-around border-l-4 border-l-cyan-600 h-full w-full min-w-[105px]'
        }>
            {undefined !== props.champion ?<ChampionHex currentPosition={props.index.toString()} champion={props.champion}/> : '' }
        </div>
    );
}