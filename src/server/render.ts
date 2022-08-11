import CellData from './celldata'
import GameData from './gamedata'

export default (cellData: CellData[], gameData: GameData) => {

    let html : string = '<table id="board">'
    
    for (let i = 0; i < gameData.rows; i++) {

        let tr : string = '<tr>'

        for (let j = 0; j < gameData.cols; j++) {

            tr += `<td>row: ${i} col: ${j}</td>`
        }

        tr += '</tr>'
        html += tr
    }

    html += '</table>'
    return html
}