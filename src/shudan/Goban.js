import React, { useState, useEffect,useRef } from 'react'

import CoordX from './CoordX'
import CoordY from './CoordY'
import Grid from './Grid'
import Vertex from './Vertex'
import Line from './Line'

// import helper from './helper'
const { range, getHoshis, readjustShifts, random, diffSignMap, vertexEquals} = require('./helper') 
const classnames = require('classnames') 


function Goban(props) {
  let {
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
    animateStonePlacement = false,
    fuzzyStonePlacement = false,
    showCoordinates = true,
    lines = [],
    selectedVertices = [],
    dimmedVertices = []
  } = props

  // 宽高从signMap读取
  let width = signMap.length === 0 ? 0 : signMap[0].length
  let height = signMap.length

  // 坐标数组
  let xs = range(width).slice(rangeX[0], rangeX[1] + 1)
  let ys = range(height).slice(rangeY[0], rangeY[1] + 1)

  // 星位
  let hoshis = getHoshis(width, height)

  // 不规则棋子位置
  const [shiftMap, setShiftMap] = useState(readjustShifts(
    signMap.map(row => row.map(_ => random(8)))
  ))

  let randomMap = signMap.map(row => row.map(_ => random(4)))

  const [clearAnimatedVertices, setClearAnimatedVertices] = useState()
  const [animatedVertices, setAnimatedVertices] = useState([])

  const signMapRef = useRef(signMap)

  // 落子动画
  useEffect(() => {
    let diff = diffSignMap(signMapRef.current, signMap)

    if ( animateStonePlacement && !clearAnimatedVertices && diff.length > 0 ) {
      signMapRef.current = signMap
      setAnimatedVertices(diff)
      for (let [x, y] of diff) {
        shiftMap[y][x] = random(7) + 1
        readjustShifts(shiftMap, [x, y])
      }
      setShiftMap(shiftMap)

      setClearAnimatedVertices(setTimeout(() => {
        setAnimatedVertices([])
        setClearAnimatedVertices(null)
      }, 200))
    }
  }, [signMap])

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
                let equalsVertex = v => vertexEquals(v, [x, y])
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
                    animate= {animatedVertices.some(equalsVertex)}
                    selected={selected}
                    selectedLeft={selected && selectedVertices.some(v =>
                      vertexEquals(v, [x - 1, y])
                    )}
                    selectedRight={selected && selectedVertices.some(v =>
                      vertexEquals(v, [x + 1, y])
                    )}
                    selectedTop={selected && selectedVertices.some(v =>
                      vertexEquals(v, [x, y - 1])
                    )}
                    selectedBottom={selected && selectedVertices.some(v =>
                      vertexEquals(v, [x, y + 1])
                    )}

                    onMouseUp={props.onVertexMouseUp}
                  />
                )
              })
            )
          }

          <div className='shudan-lines' style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 2
          }}>
            <div style={{
              position: 'absolute',
              top: `-${rangeY[0]}em`,
              left: `-${rangeX[0]}em`,
              width: `${width}em`,
              height: `${height}em`
            }}>
              {
                lines.map(({v1, v2, type}, i) => {
                  return (<Line key={i} v1={v1} v2={v2} type={type} vertexSize={vertexSize} />)
                })
              }
            </div>
          </div>
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
