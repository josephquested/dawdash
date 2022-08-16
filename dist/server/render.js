"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fillCell_1 = __importDefault(require("./fillCell"));
exports.default = (cellData, gameData) => {
    let html = '<table id="board">';
    let index = 0;
    for (let i = 0; i < gameData.rows; i++) {
        let tr = '<tr>';
        for (let j = 0; j < gameData.cols; j++) {
            tr += `<td id="${j}-${i}">${(0, fillCell_1.default)(cellData[index])}</td>`;
            index++;
        }
        tr += '</tr>';
        html += tr;
    }
    html += '</table>';
    return html;
};
//# sourceMappingURL=render.js.map