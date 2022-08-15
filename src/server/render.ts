import CellData from './celldata'
import GameData from './gamedata'
import fillCell from './fillCell'

export default (cellData: CellData[], gameData: GameData) => {

    let html : string = '<table id="board">'
    let index : number = 0;
    
    for (let i = 0; i < gameData.rows; i++) {

        let tr : string = '<tr>'

        for (let j = 0; j < gameData.cols; j++) {
            tr += `<td id="${j}-${i}">${j}-${i} ${fillCell(cellData[index])}</td>`
            index++
        }

        tr += '</tr>'
        html += tr
    }

    html += '</table>'
    return html
}