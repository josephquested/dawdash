import Player from './player'
import Laser from './laser'

type CellData = {
    x: number,
    y: number,
    player: Player,
    laser: Laser
}

export default CellData