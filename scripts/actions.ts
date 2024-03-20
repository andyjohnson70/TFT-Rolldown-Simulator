import { BagSize, Champion, ChampionBag } from "@/app/lib/definitions";

export function InitializeChampionBag(championsList?: Champion[]) : ChampionBag {
    let championBag: ChampionBag = {
        Tier1Units: [],
        Tier2Units: [],
        Tier3Units: [],
        Tier4Units: [],
        Tier5Units: []
    };

    if(championsList === undefined || championsList.length === 0) {
        return championBag;
    }

    championsList?.forEach((champion) => {
        switch(champion.tier) {
            case 1:
                championBag.Tier1Units.push(...Array(BagSize.Tier1).fill(champion));
                break;
            case 2: 
                championBag.Tier2Units.push(...Array(BagSize.Tier2).fill(champion));
                break;
            case 3:
                championBag.Tier3Units.push(...Array(BagSize.Tier3).fill(champion));
                break;
            case 4:
                championBag.Tier4Units.push(...Array(BagSize.Tier4).fill(champion));
                break;
            case 5:
                championBag.Tier5Units.push(...Array(BagSize.Tier5).fill(champion));
                break;
        }
    });
    console.log("champion bag:", championBag);
    return championBag;
}
