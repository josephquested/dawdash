"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (gameData) => {
    let cells = [];
    for (let i = 0; i < gameData.rows; i++) {
        for (let j = 0; j < gameData.cols; j++) {
            let cell = { x: j, y: i, player: null, laser: null };
            cells.push(cell);
        }
    }
    return cells;
};
//# sourceMappingURL=generateCells.js.map