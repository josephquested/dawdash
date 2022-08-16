"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (cellData) => {
    let html = '';
    if (cellData.player != null) {
        let player = cellData.player;
        html += `<img class="facing-${player.dir}" src="./img/${player.img}">`;
    }
    if (cellData.laser != null) {
        let laser = cellData.laser;
        html += `<img class="facing-${laser.dir}" src="./img/${laser.img}">`;
    }
    return html;
};
//# sourceMappingURL=fillCell.js.map