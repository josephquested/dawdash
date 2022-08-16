"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (dir, cell, cells, gameData) => {
    let x = cell.x;
    let y = cell.y;
    if (dir == 0) {
        if (y != 0)
            y--;
    }
    else if (dir == 1) {
        if (x != gameData.cols - 1)
            x++;
    }
    else if (dir == 2) {
        if (y != gameData.rows - 1)
            y++;
    }
    else if (dir == 3) {
        if (x != 0)
            x--;
    }
    return cells.find(_cell => { return _cell.x == x && _cell.y == y; });
};
//# sourceMappingURL=getCellFromDir.js.map