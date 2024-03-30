import aatrox from "../../../public/champions/Aatrox.png"
import ahri from "../../../public/champions/Ahri.png"
import alune from "../../../public/champions/Alune.png"
import amumu from "../../../public/champions/Amumu.png"
import annie from "../../../public/champions/Annie.png"
import aphelios from "../../../public/champions/Aphelios.png"
import ashe from "../../../public/champions/Ashe.png"
import azir from "../../../public/champions/Azir.png"
import bard from "../../../public/champions/Bard.png"
import caitlyn from "../../../public/champions/Caitlyn.png"
import chogath from "../../../public/champions/ChoGath.png"
import darius from "../../../public/champions/Darius.png"
import diana from "../../../public/champions/Diana.png"
import galio from "../../../public/champions/Galio.png"
import garen from "../../../public/champions/Garen.png"
import gnar from "../../../public/champions/Gnar.png"
import hwei from "../../../public/champions/Hwei.png"
import illaio from "../../../public/champions/Illaoi.png"
import irelia from "../../../public/champions/Irelia.png"
import janna from "../../../public/champions/Janna.png"
import jax from "../../../public/champions/Jax.png"
import kaisa from "../../../public/champions/Kaisa.png"
import kayn from "../../../public/champions/Kayn.png"
import khazix from "../../../public/champions/KhaZix.png"
import kindred from "../../../public/champions/Kindred.png"
import kobuko from "../../../public/champions/Kobuko.png"
import kogmaw from "../../../public/champions/KogMaw.png"
import leesin from "../../../public/champions/LeeSin.png"
import lillia from "../../../public/champions/Lillia.png"
import lissandra from "../../../public/champions/Lissandra.png"
import lux from "../../../public/champions/Lux.png"
import malphite from "../../../public/champions/Malphite.png"
import morgana from "../../../public/champions/Morgana.png"
import nautilus from "../../../public/champions/Nautilus.png"
import neeko from "../../../public/champions/Ahri.png"
import ornn from "../../../public/champions/Ornn.png"
import qiyana from "../../../public/champions/Qiyana.png"
import reksai from "../../../public/champions/Reksai.png"
import riven from "../../../public/champions/Riven.png"
import senna from "../../../public/champions/Senna.png"
import sett from "../../../public/champions/Sett.png"
import shen from "../../../public/champions/Shen.png"
import sivir from "../../../public/champions/Sivir.png"
import soraka from "../../../public/champions/Soraka.png"
import sylas from "../../../public/champions/Sylas.png"
import syndra from "../../../public/champions/Syndra.png"
import tahmkench from "../../../public/champions/TahmKench.png"
import teemo from "../../../public/champions/Teemo.png"
import thresh from "../../../public/champions/Thresh.png"
import tristana from "../../../public/champions/Tristana.png"
import udyr from "../../../public/champions/Udyr.png"
import volibear from "../../../public/champions/Volibear.png"
import wukong from "../../../public/champions/Wukong.png"
import xayahrakan from "../../../public/champions/XayahRakan.png"
import yasuo from "../../../public/champions/Yasuo.png"
import yone from "../../../public/champions/Yone.png"
import yorick from "../../../public/champions/Yorick.png"
import zoe from "../../../public/champions/Zoe.png"
import zyra from "../../../public/champions/Zyra.png"
import { Champion } from "../lib/definitions";
import { CSSProperties, useContext } from "react";
import { GameContext } from "../context/context";
import { PurchaseChampion } from "../scripts/actions";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities"
import Image, { StaticImageData } from "next/image";
import useSound from 'use-sound';
import React from "react";

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
        if(props.champion && (!gameContext.gameActive || gameContext.gold < props.champion?.tier)) {
            return;
        }
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
            <div className="tier-indicator"></div>
            <div className={`relative h-4/5 tier-${props.champion.tier}-border`}>
                <Image className="z-0" alt={props.champion.name} fill={true} sizes="(max-width: 768) 150px, 110px (min-width: 768) 160px 110px" src={GetChampionImage(props.champion.name)} priority={true} />
                <div className="absolute bottom-0 z-10">
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
                <div className="text-white text-md grow content-center border-text">{props.champion.name}</div>
            </div>

            <div className="absolute inset-x-0 bottom-0 flex flex-row justify-center">
                <div className="z-10">{props.champion.starlevel > 1 ? <Image alt={`${props.champion.starlevel}`} width={50} height={20} className="mx-auto p-[2px]" src={props.champion.starlevel === 3 ? "/threeStar.png" : "/twoStar.png"}/> : <div className="h-[20px]"></div> }</div>
            </div>
        </div>
        
    );
}

function GetChampionImage(championName : string) : StaticImageData {
    switch (championName) {
        case "Aatrox":
        default:
            return aatrox;
        case "Ahri":
            return ahri;
        case "Alune":
            return alune;
        case "Amumu":
            return amumu;
        case "Annie":
            return annie;
        case "Aphelios":
            return aphelios;
        case "Ashe":
            return ashe;
        case "Azir":
            return azir;
        case "Bard":
            return bard;
        case "Caitlyn":
            return caitlyn;
        case "Cho Gath":
            return chogath;
        case "Darius":
            return darius;
        case "Diana":
            return diana;
        case "Galio":
            return galio;
        case "Garen":
            return garen;
        case "Gnar":
            return gnar;
        case "Hwei":
            return hwei;
        case "Illaio":
            return illaio;
        case "Irelia":
            return irelia;
        case "Janna":
            return janna;
        case "Jax":
            return jax;
        case "Kaisa":
            return kaisa;
        case "Kayn":
            return kayn;
        case "Kha Zix":
            return khazix;        
        case "Kindred":
            return kindred;
        case "Kobuko":
            return kobuko;
        case "Kog Maw":
            return kogmaw;
        case "Lee Sin":
            return leesin;
        case "Lillia":
            return lillia;
        case "Lissandra":
            return lissandra;
        case "Lux":
            return lux;
        case "Malphite":
            return malphite;
        case "Morgana":
            return morgana;
        case "Nautilus":
            return nautilus;
        case "Neeko":
            return neeko;
        case "Ornn":
            return ornn;
        case "Qiyana":
            return qiyana;
        case "Rek Sai":
            return reksai;
        case "Riven":
            return riven;
        case "Senna":
            return senna;
        case "Sett":
            return sett;
        case "Shen":
            return shen;
        case "Sivir":
            return sivir;
        case "Soraka":
            return soraka;
        case "Sylas":
            return sylas;
        case "Syndra":
            return syndra;
        case "Tahm Kench":
            return tahmkench;
        case "Teemo":
            return teemo;
        case "Thresh":
            return thresh;
        case "Tristana":
            return tristana;
        case "Udyr":
            return udyr;
        case "Volibear":
            return volibear;
        case "Wukong":
            return wukong;
        case "Xayah and Rakan":
            return xayahrakan;
        case "Yasuo":
            return yasuo;
        case "Yone":
            return yone;
        case "Yorick":
            return yorick;
        case "Zoe":
            return zoe;
        case "Zyra":
            return zyra;
    }
}