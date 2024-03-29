import { useDroppable } from "@dnd-kit/core";
import { Champion } from "../lib/definitions";
import { ChampionHex } from "./champion";
import { CSSProperties, useContext } from "react";
import { GameContext } from "../context/context";

interface HexRowProps {
    boardHexes: (Champion|undefined)[],
    id: string,
    direction: string
}

interface HexProps {
    id: string
    champion: Champion|undefined
}

export default function Board() {
    const gameContext = useContext(GameContext);
    return (
        <div className="flex flex-col gap-y-2">
            {gameContext.boardBag.map((boardRow, id) => {
                return <HexRow boardHexes={boardRow} id={id.toString()} direction={0 === id % 2 ? 'left' : 'right'} key={`hex_row_${id}`} />
            })}
        </div>
    );
}

function HexRow(props : HexRowProps) {
    
    return (
        <div id={props.id} className={
            "right" === props.direction ?
            "flex grid-rows-7 gap-2 translate-x-14" :
            "flex grid-rows-7 gap-2"
        }>
            {props.boardHexes.map((hex, id) => {
                return <Hex id={`${props.id}-${id}`} champion={hex} key={`hex_${props.id}-${id}`} />
            })}
        </div>
    );
}

function Hex(props : HexProps) {
    const {isOver, setNodeRef} = useDroppable({
        id: `${props.id}`
    });

    const style : CSSProperties = {
        outline: isOver ? 'solid 2px rgb(8 145 178)' : undefined,
        outlineOffset: isOver ? "-2px" : undefined
    }
    
    return (
        <div ref={setNodeRef} id={props.id}>
            {undefined !== props.champion ?<ChampionHex currentPosition={props.id} champion={props.champion}/> : <div  style={style} className="hex"></div> }
        </div>
    )
}