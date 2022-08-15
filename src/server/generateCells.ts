import CellData from './celldata'
import GameData from './gamedata'

export default (gameData: GameData) => {

    let cells: CellData[] = []

    for (let i = 0; i < gameData.rows; i++) {

        for (let j = 0; j < gameData.cols; j++) {

            let cell: CellData = { x: j, y: i, player: null }
            cells.push(cell)
        }
    }

    return cells
}