import CellData from './celldata'
import Player from './player'
import Laser from './laser'

export default (cellData: CellData) => {

    let html = ''

    if (cellData.player != null) {
        let player : Player = cellData.player
        html += `<img class="facing-${player.dir}" src="./img/${player.img}">`
    }

    if (cellData.laser != null) {
        let laser : Laser = cellData.laser
        html += `<img class="facing-${laser.dir}" src="./img/${laser.img}">`
    }

    return html
}