import React, {useState, useRef, useEffect} from 'react'
import Goban from './shudan/Goban'
import './css/goban.css'
import './App.css'

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


const paintMap = [
  [-1, -1, -1, -1, -1, -1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1, 1, 1],
  [-1, -1, -1, -1, -1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1],
  [-1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, 1, 1, 1, 1],
  [-1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [-1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1],
  [-1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, -1, -1, 0, 1, 1, 1, 1],
  [-1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, 1, 1, 1],
  [-1, -1, -1, 1, 1, 1, 1, -1, -1, 1, 0, 1, -1, -1, -1, -1, -1, -1, 1],
  [-1, -1, -1, -1, 1, 1, 1, 0, -1, 1, -1, -1, -1, -1, -1, 1, 1, 1, 1],
  [-1, -1, -1, 1, 1, -1, -1, -1, -1, 1, 1, 1, -1, -1, -1, -1, 1, -1, -1],
  [-1, -1, -1, -1, 1, 1, 1, -1, -1, -1, 1, -1, -1, -1, -1, 1, 1, -1, -1],
  [-1, 1, -1, 0, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, -1],
  [1, 1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, -1, -1, -1, 1, -1, -1, -1],
  [1, 1, 1, 1, 1, 1, 1, 1, -1, 1, 1, 1, -1, -1, -1, 1, 1, -1, -1],
  [1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 0, 1, -1, -1, -1, 1, -1, -1, -1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, 1, -1, -1, -1, -1],
  [1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, 1, 1, 1, 1, -1, -1, -1],
  [1, 1, 1, 1, -1, 1, 1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, -1, 1],
  [1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1]
].map(row => row.map(sign => ((Math.random() * 2 + 1) / 3) * sign))

const heatMap = (() => {
  let _ = null
  let O = (strength, text) => ({strength, text})
  let O1 = O(1, '20%\n111')
  let O5 = O(5, '67%\n2315')
  let O9 = O(9, '80%\n13.5k')

  return [
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, O(7), O9, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, O(3), _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, O(2), _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, O1, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, O5, O(4), _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _]
  ]
})()

const markerMap = (() => {
  let _ = null
  let O = {type: 'circle'}
  let X = {type: 'cross'}
  let T = {type: 'triangle'}
  let Q = {type: 'square'}
  let $ = {type: 'point'}
  let S = {type: 'loader'}
  let L = label => ({type: 'label', label})
  let A = L('a')
  let B = L('b')
  let C = L('c')
  let longLabel = L('Long\nlabel with linebreak')

  return [
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, O, O, O, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, X, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, X, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, X, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, T, T, T, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, $, $, $, _, _, _, _, _, _, _, _, _, _, _, S, S, S, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, Q, _, _, _, _, _, _, _, _, _, longLabel],
    [_, _, _, _, _, _, _, _, Q, _, _, _, _, _, _, _, _, _, C],
    [_, _, _, _, _, _, _, _, Q, _, _, _, _, _, _, _, _, _, B],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, A]
  ]
})()

const ghostStoneMap = (() => {
  let _ = null
  let O = t => ({sign: -1, type: t})
  let X = t => ({sign: 1, type: t})
  let o = t => ({sign: -1, type: t, faint: true})
  let x = t => ({sign: 1, type: t, faint: true})
  let [Xg, xg] = [X, x].map(f => f('good'))
  let [Xb, xb] = [X, x].map(f => f('bad'))
  let [Xi, xi] = [X, x].map(f => f('interesting'))
  let [Xd, xd] = [X, x].map(f => f('doubtful'))

  return [
    [X(), x(), _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [O(), o(), _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [Xg, xg, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [Xi, xi, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [Xd, xd, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [Xb, xb, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _]
  ]
})()



function App() {
  // 棋盘单位尺寸
  const [vertexSize, setVertexSize] = useState(24)

  const [board, setBoard] = useState(new Board(signMap))

  const boardRef = useRef(board)
  // 显示坐标
  const [showCoordinates, setShowCoordinates] = useState(true)
  // 坐标显示切换
  const [alternateCoordinates, setAlternateCoordinates] = useState(false)

  const [showCorner, setShowCorner] = useState(false)
  const [showDimmedStones, setShowDimmedStones] = useState(false)
  const [fuzzyStonePlacement, setFuzzyStonePlacement] = useState(false)
  const [animateStonePlacement, setAnimateStonePlacement] = useState(false)
  const [showPaintMap, setShowPaintMap] = useState(false)
  const [showHeatMap, setShowHeatMap] = useState(false)
  const [showMarkerMap, setShowMarkerMap] = useState(false)
  const [showGhostStones, setShowGhostStones] = useState(false)
  const [showLines, setShowLines] = useState(false)
  const [showSelection, setShowSelection] = useState(false)
  const [isBusy, setIsBusy] = useState(false)


  const handleMouseUp = (evt, [x, y]) => {
    let sign = evt.button === 0 ? 1 : -1
    let newBoard = boardRef.current.makeMove(sign, [x, y])
    setBoard(newBoard)
  };

  useEffect(()=> {
    boardRef.current = board
  }, [board]);
 
  return (
    <>
      <section style={{display: 'grid', gridTemplateColumns: '15em auto', gridColumnGap: '1em'}}>
        <form style={{display: 'flex', flexDirection: 'column'}} className="form-controller">
          <p>
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

          <p>
            {"Stones: "}
            <button type="button" onClick={() => {
              setBoard(new Board(signMap))
            }}> • </button>
          </p>

          <label>
            <input type="checkbox" checked={showCoordinates} onChange={() => {
              setShowCoordinates(!showCoordinates)
            }}/>
            <span>Show coordinates</span>
          </label>

          <label>
            <input type="checkbox" checked={alternateCoordinates} onChange={() => {
              setAlternateCoordinates(!alternateCoordinates)
            }}/>
            <span>Alternate coordinates</span>
          </label>

          <label>
            <input type="checkbox" checked={showCorner} onChange={() => {
              setShowCorner(!showCorner)
            }}/>
            <span>Show lower right corner only</span>
          </label>

          <label>
            <input type="checkbox" checked={showDimmedStones} onChange={() => {
              setShowDimmedStones(!showDimmedStones)
            }}/>
            <span>Dim dead stones</span>
          </label>

          <label>
            <input type="checkbox" checked={fuzzyStonePlacement} onChange={() => {
              setFuzzyStonePlacement(!fuzzyStonePlacement)
            }}/>
            <span>Fuzzy stone placement</span>
          </label>

          <label>
            <input type="checkbox" checked={animateStonePlacement} onChange={() => {
              setAnimateStonePlacement(!animateStonePlacement)
            }}/>
            <span>Animate stone placement</span>
          </label>

          <label>
            <input type="checkbox" checked={showMarkerMap} onChange={() => {
              setShowMarkerMap(!showMarkerMap)
            }}/>
            <span>Show markers</span>
          </label>

          <label>
            <input type="checkbox" checked={showGhostStones} onChange={() => {
              setShowGhostStones(!showGhostStones)
            }}/>
            <span>Show ghost stones</span>
          </label>

          <label>
            <input type="checkbox" checked={showPaintMap} onChange={() => {
              setShowPaintMap(!showPaintMap)
            }}/>
            <span>Show paint map</span>
          </label>

          <label>
            <input type="checkbox" checked={showHeatMap} onChange={() => {
              setShowHeatMap(!showHeatMap)
            }}/>
            <span>Show heat map</span>
          </label>

          <label>
            <input type="checkbox" checked={showLines} onChange={() => {
              setShowLines(!showLines)
            }}/>
            <span>Show lines</span>
          </label>

          <label>
            <input type="checkbox" checked={showSelection} onChange={() => {
              setShowSelection(!showSelection)
            }}/>
            <span>Show selection</span>
          </label>

          <label>
            <input type="checkbox" checked={isBusy} onChange={() => {
              setIsBusy(!isBusy)
            }}/>
            <span>Busy</span>
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
