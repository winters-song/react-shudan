import React, { useState } from 'react'

import CoordX from './CoordX'
import CoordY from './CoordY'
import Grid from './Grid'
import Vertex from './Vertex'

import helper from './helper'
const classnames = require('classnames') 

// const Line = require('./Line')

function Goban(props) {
  let {
    innerProps = {},
    vertexSize = 24,
    coordX,
    coordY,
    rangeX = [0, Infinity],
    rangeY = [0, Infinity],
    busy,
    signMap = [],
    paintMap,
    heatMap,
    markerMap,
    ghostStoneMap,
    fuzzyStonePlacement = false,
    showCoordinates = true,
    lines = [],
    selectedVertices = [],
    dimmedVertices = []
  } = props

  // 宽高从signMap读取
  const [width, setWidth] = useState(signMap.length === 0 ? 0 : signMap[0].length)
  const [height, setHeight] = useState(signMap.length)
  // 坐标数组
  const [xs, setXs] = useState(helper.range(width).slice(rangeX[0], rangeX[1] + 1))
  const [ys, setYs] = useState(helper.range(height).slice(rangeY[0], rangeY[1] + 1))
  // 星位
  const [hoshis, setHoshis] = useState(helper.getHoshis(width, height))
  const [shiftMap, setShiftMap] = useState(helper.readjustShifts(
    signMap.map(row => row.map(_ => helper.random(8)))
  ))
  const [randomMap, setRandomMap] = useState(signMap.map(row => row.map(_ => helper.random(4))))
  // const [animatedVertices, setAnimatedVertices] = useState([])

  return (
    <div 
      className={classnames('shudan-goban', 'shudan-goban-image', {
        'shudan-busy': busy,
        'shudan-coordinates': showCoordinates
      }) + ' ' +
      (props.class || props.className || '')} 

      style={Object.assign({
        display: 'inline-grid',
        gridTemplateRows: showCoordinates ? '1em 1fr 1em' : '1fr',
        gridTemplateColumns: showCoordinates ? '1em 1fr 1em' : '1fr',
        fontSize: vertexSize,
        lineHeight: '1em'
      }, props.style || {})} >

      { showCoordinates && (
        <>
          <CoordX style={{gridRow: '1', gridColumn: '2'}}  xs={xs} coordX={coordX}/>
          <CoordY style={{gridRow: '2', gridColumn: '1'}}  ys={ys} coordY={coordY} height={height} />
        </>
      )}

      <div 
        className="shudan-content"
        style={{
          position: 'relative',
          width: `${xs.length}em`,
          height: `${ys.length}em`,
          gridRow: showCoordinates ? '2' : '1',
          gridColumn: showCoordinates ? '2' : '1'
        }} >
        <Grid 
          vertexSize={vertexSize}
          width={width}
          height={height}
          xs={xs}
          ys={ys}
          hoshis={hoshis} />

        <div
          className='shudan-vertices'
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${xs.length}, 1em)`,
            gridTemplateRows: `repeat(${ys.length}, 1em)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1
          }}>
          { 
            ys.map(y =>
              xs.map(x => {
                let equalsVertex = v => helper.vertexEquals(v, [x, y])
                let selected = selectedVertices.some(equalsVertex)

                return (
                  <Vertex 
                    key={[x, y].join('-')}
                    position={[x, y]}
                    shift={fuzzyStonePlacement ? shiftMap && shiftMap[y] && shiftMap[y][x] : 0}
                    random={randomMap && randomMap[y] && randomMap[y][x]}
                    sign={signMap && signMap[y] && signMap[y][x]}
                    heat={heatMap && heatMap[y] && heatMap[y][x]}
                    paint={paintMap && paintMap[y] && paintMap[y][x]}
                    marker={markerMap && markerMap[y] && markerMap[y][x]}
                    ghostStone={ghostStoneMap && ghostStoneMap[y] && ghostStoneMap[y][x]}
                    dimmed={dimmedVertices.some(equalsVertex)}
                    selected={selected}
                    selectedLeft={selected && selectedVertices.some(v =>
                      helper.vertexEquals(v, [x - 1, y])
                    )}
                    selectedRight={selected && selectedVertices.some(v =>
                      helper.vertexEquals(v, [x + 1, y])
                    )}
                    selectedTop={selected && selectedVertices.some(v =>
                      helper.vertexEquals(v, [x, y - 1])
                    )}
                    selectedBottom={selected && selectedVertices.some(v =>
                      helper.vertexEquals(v, [x, y + 1])
                    )}

                    onMouseUp={props.onVertexMouseUp}
                  />
                )
              })
            )
          }
        </div>
      </div>

      { showCoordinates && (
        <>
          <CoordY style={{gridRow: '2', gridColumn: '3'}}  ys={ys} coordY={coordY} height={height} />
          <CoordX style={{gridRow: '3', gridColumn: '2'}}  xs={xs} coordX={coordX} />
        </>
      )}
      
    </div>
  )

}


export default React.memo(Goban) 
