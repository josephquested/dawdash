import CellData from './celldata'
import Player from './player'

export default (cellData: CellData) => {

    let html = ''

    if (cellData.player != null)
    {
        let player : Player = cellData.player
        html += `<img class="facing-${player.dir}" src="./img/player.png">`
    }

    return html
}