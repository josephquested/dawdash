import CellData from './celldata'
import GameData from './gamedata'

export default (dir : number, cell : CellData, cells : CellData[], gameData: GameData) => {

    let x : number = cell.x
    let y : number = cell.y

    if (dir == 0) {
        if (y != 0)
            y--
    }

    else if (dir == 1) {
        if (x != gameData.cols - 1)
            x++
    }

    else if (dir == 2) {
        if (y != gameData.rows - 1)
            y++
    }

    else if (dir == 3) {
        if (x != 0)
            x--
    }
    
    return cells.find(_cell => { return _cell.x == x && _cell.y == y })
}