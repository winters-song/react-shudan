import React, {useState} from 'react'
import Goban from './shudan/Goban'
import './css/goban.css'

const Board = require('@sabaki/go-board')

const chineseCoord = [
  '一',
  '二',
  '三',
  '四',
  '五',
  '六',
  '七',
  '八',
  '九',
  '十',
  '十一',
  '十二',
  '十三',
  '十四',
  '十五',
  '十六',
  '十七',
  '十八',
  '十九'
]


const signMap = [
  [0, 0, 0, -1, -1, -1, 1, 0, 1, 1, -1, -1, 0, -1, 0, -1, -1, 1, 0],
  [0, 0, -1, 0, -1, 1, 1, 1, 0, 1, -1, 0, -1, -1, -1, -1, 1, 1, 0],
  [0, 0, -1, -1, -1, 1, 1, 0, 0, 1, 1, -1, -1, 1, -1, 1, 0, 1, 0],
  [0, 0, 0, 0, -1, -1, 1, 0, 1, -1, 1, 1, 1, 1, 1, 0, 1, 0, 0],
  [0, 0, 0, 0, -1, 0, -1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0],
  [0, 0, -1, 0, 0, -1, -1, 1, 0, -1, -1, 1, -1, -1, 0, 1, 0, 0, 1],
  [0, 0, 0, -1, -1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, 1, 1, 1],
  [0, 0, -1, 1, 1, 0, 1, -1, -1, 1, 0, 1, -1, 0, 1, -1, -1, -1, 1],
  [0, 0, -1, -1, 1, 1, 1, 0, -1, 1, -1, -1, 0, -1, -1, 1, 1, 1, 1],
  [0, 0, -1, 1, 1, -1, -1, -1, -1, 1, 1, 1, -1, -1, -1, -1, 1, -1, -1],
  [-1, -1, -1, -1, 1, 1, 1, -1, 0, -1, 1, -1, -1, 0, -1, 1, 1, -1, 0],
  [-1, 1, -1, 0, -1, -1, -1, -1, -1, -1, 1, -1, 0, -1, -1, 1, -1, 0, -1],
  [1, 1, 1, 1, -1, 1, 1, 1, -1, 1, 0, 1, -1, 0, -1, 1, -1, -1, 0],
  [0, 1, -1, 1, 1, -1, -1, 1, -1, 1, 1, 1, -1, 1, -1, 1, 1, -1, 1],
  [0, 0, -1, 1, 0, 0, 1, 1, -1, -1, 0, 1, -1, 1, -1, 1, -1, 0, -1],
  [0, 0, 1, 0, 1, 0, 1, 1, 1, -1, -1, 1, -1, -1, 1, -1, -1, -1, 0],
  [0, 0, 0, 0, 1, 1, 0, 1, -1, 0, -1, -1, 1, 1, 1, 1, -1, -1, -1],
  [0, 0, 1, 1, -1, 1, 1, -1, 0, -1, -1, 1, 1, 1, 1, 0, 1, -1, 1],
  [0, 0, 0, 1, -1, -1, -1, -1, -1, 0, -1, -1, 1, 1, 0, 1, 1, 1, 0]
]


function App() {
  // 棋盘单位尺寸
  const [vertexSize, setVertexSize] = useState(24)
  // 显示坐标
  const [showCoordinates, setShowCoordinates] = useState(true)
  // 坐标显示切换
  const [alternateCoordinates, setAlternateCoordinates] = useState(false)

  const [board, setBoard] = useState(new Board(signMap))

  let showCorner = false
  let showLines = false
  let isBusy = false

  const handleMouseUp = (evt, [x, y]) => {
    let sign = evt.button === 0 ? 1 : -1
    let newBoard = board.makeMove(sign, [x, y])
    setBoard(newBoard)
  };
 
  return (
    <>
      <section style={{display: 'grid', gridTemplateColumns: '15em auto', gridColumnGap: '1em'}}>
        <form style={{display: 'flex', flexDirection: 'column'}}>
          <p style={{margin: '0 0 .5em 0'}}>
            {"Size: "}
            <button type="button" onClick={() => {
              setVertexSize(Math.max(vertexSize - 4, 4))
            }}> - </button>
            {" "}
            <button type="button" onClick={() => {
              setVertexSize(24)
            }}> • </button>
            {" "}
            <button type="button" onClick={() => {
              setVertexSize(vertexSize + 4)
            }}> + </button>
          </p>

          <p style={{margin: '0 0 .5em 0'}}>
            {"Stones: "}
            <button type="button" onClick={() => {
              setBoard(new Board(signMap))
            }}> • </button>
          </p>

          <label style={{display: "flex", alignItems: "center"}}>
            <input type="checkbox" checked={showCoordinates} onChange={() => {
              setShowCoordinates(!showCoordinates)
            }}/>
            <span style={{userSelect:"none"}}>Show coordinates</span>
          </label>

          <label style={{display: "flex", alignItems: "center"}}>
            <input type="checkbox" checked={alternateCoordinates} onChange={() => {
              setAlternateCoordinates(!alternateCoordinates)
            }}/>
            <span style={{userSelect:"none"}}>Alternate coordinates</span>
          </label>

        </form>

        <div>
          <Goban 
            vertexSize={vertexSize}
            animate={true}
            busy={isBusy}
            rangeX={showCorner ? [8, 18] : undefined}
            rangeY= {showCorner ? [12, 18] : undefined}
            coordX= {alternateCoordinates ? i => chineseCoord[i] : undefined}
            coordY= {alternateCoordinates ? i => i + 1 : undefined}
            signMap={board.signMap}
            showCoordinates={showCoordinates}

            onVertexMouseUp= {handleMouseUp}
          />

          {
            alternateCoordinates && (
              <style> 
              {`
              .shudan-coordx span {
                font-size: .45em;
              }
              `}
              </style>
            )
          }
        </div>
      </section>
    </>
  );
}

export default App;
