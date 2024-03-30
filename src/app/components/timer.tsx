import { useContext, useEffect, useRef, useState } from "react";
import { GameContext } from "../context/context";
import { EndGame } from "../scripts/actions";


export function Timer() {
    const gameContext = useContext(GameContext);

    return (
        <div className="bg-[#010a13] bg-opacity-75 fixed top-0 mx-auto h-fit">
            <div className="text-[#eee4d1] text-xl p-3">{gameContext.time}</div>
        </div>
    );
}

