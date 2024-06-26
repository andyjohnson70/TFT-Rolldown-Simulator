import { useDroppable } from "@dnd-kit/core";
import { Champion } from "../lib/definitions";
import { ChampionHex } from "./champion";
import { CSSProperties, useContext } from "react";
import { GameContext } from "../context/context";
import React from "react";

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
        <div className="z-10">
            <div className="text-white border-text text-4xl flex content-end justify-end">
                {gameContext.boardBag.reduce((item, row) => {
                    return item + row.reduce((innerItem, index) => innerItem + (index !== undefined ? 1 : 0), 0)
                }, 0)} / {gameContext.level}
            </div>

            <div className="grid grid-rows-4 row-end-4 gap-y-2 board-container">
            
            {gameContext.boardBag.map((boardRow, id) => {
                return <HexRow boardHexes={boardRow} id={id.toString()} direction={0 === id % 2 ? 'left' : 'right'} key={`hex_row_${id}`} />
            })}
        </div>
        </div>
        
    );
}

function HexRow(props : HexRowProps) {

    return (
        <div id={props.id} className={
            "right" === props.direction ?
            "hex-row flex grid-rows-7 relative gap-2 translate-x-14" :
            "hex-row flex grid-rows-7 relative gap-2"
        }>
            {props.boardHexes.map((hex, id) => {
                return <Hex id={`${props.id}-${id}`} champion={hex} key={`hex_${props.id}-${id}`} />
            })}
        </div>
    );
}

function Hex(props : HexProps) {
    const {active, isOver, setNodeRef} = useDroppable({
        id: `${props.id}`
    });

    const style : CSSProperties = {
        backgroundColor: isOver && active && !active.id.toString().includes('card_') ? 'rgba(255, 255, 255, 0.25)' : undefined,
    }
    
    return (
        <div ref={setNodeRef} id={props.id}>
            {undefined !== props.champion ?<ChampionHex currentPosition={props.id} champion={props.champion}/> : <div className="hex"style={style} ></div> }
        </div>
    )
}