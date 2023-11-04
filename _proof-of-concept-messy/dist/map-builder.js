export function BuildMap(boardMap) {
    const map = new Map();
    boardMap.walls.forEach(w => {
        map.set(w, {
            classes: ['wall'],
            indicator: ' ',
            mapItems: [
                {
                    cellType: 'wall',
                    indicator: ' ',
                    location: w
                }
            ]
        });
    });
    map.set(boardMap.goal, {
        classes: ['goal'],
        indicator: ' ',
        mapItems: [
            {
                cellType: 'goal',
                indicator: ' ',
                location: boardMap.goal
            }
        ]
    });
    map.set(boardMap.player, {
        classes: ['player'],
        indicator: '>',
        mapItems: [
            {
                cellType: 'player',
                indicator: '>',
                location: boardMap.player
            }
        ]
    });
    return map;
}
//# sourceMappingURL=map-builder.js.map