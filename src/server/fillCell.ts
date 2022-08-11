import CellData from './celldata'

export default (cellData: CellData) => {

    let html = ''

    if (cellData.player != null)
        html += '<img src="./img/player.png">'

    return html
}