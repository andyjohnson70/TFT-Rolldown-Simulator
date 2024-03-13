function ChampionCard() {
    return (
        <div className="champion-card bg-black w-1/5 m-2">
            <div className="tier-indicator"></div>
            <ul className="origin-list">
                <li></li>
            </ul>
            <ul className="class-list">
                <li></li>
            </ul>

            <div className="champion-card-footer">
                <div className="champion-name"></div>
                <div className="champion-cost"></div>
            </div>
        </div>
    );
}

export function Shop() {
    return(
        <div className="shop flex justify-between h-full">
            <ChampionCard />
            <ChampionCard />
            <ChampionCard />
            <ChampionCard />
            <ChampionCard />
        </div>
    );
}