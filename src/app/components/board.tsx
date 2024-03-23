import { useDroppable } from "@dnd-kit/core";
import { Champion } from "../lib/definitions";
import { ChampionHex } from "./champion";
import { CSSProperties } from "react";

interface HexRowProps {
    id: string,
    direction: string
}

interface HexProps {
    id: string
    champion: Champion|undefined
}

export default function Board() {
    return (
        <div className="flex flex-col gap-y-2">
            <HexRow id="A" direction="left" />
            <HexRow id="B" direction="right" />
            <HexRow id="C" direction="left" />
            <HexRow id="D" direction="right" />
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
            <Hex id={`${props.id}-1`} champion={undefined} />
            <Hex id={`${props.id}-2`} champion={undefined} />
            <Hex id={`${props.id}-3`} champion={undefined} />
            <Hex id={`${props.id}-4`} champion={undefined} />
            <Hex id={`${props.id}-5`} champion={undefined} />
            <Hex id={`${props.id}-6`} champion={undefined} />
            <Hex id={`${props.id}-7`} champion={undefined} />
        </div>
    );
}

function Hex(props : HexProps) {
    const {isOver, setNodeRef} = useDroppable({
        id: 'dropable'
    });

    const style : CSSProperties = {
        outline: isOver ? 'solid 2px rgb(8 145 178)' : undefined,
        outlineOffset: isOver ? "-2px" : undefined
    }
    
    return (
        <div id={props.id}>
            {undefined !== props.champion ?<ChampionHex champion={props.champion}/> : <div  style={style} className="hex"></div> }
        </div>
    )
}