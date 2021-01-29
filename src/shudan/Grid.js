import React from 'react'

function Grid (props) {

  let {vertexSize, width, height, xs=[], ys=[], hoshis} = props
  let halfVertexSize = vertexSize / 2
  let fl = Math.floor

  return (
    <>
    { xs.length > 0 && ys.length > 0 && (
      <svg className='shudan-grid'
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0
        }}>
        { 
          ys.map((_, i) => {
            let x = xs[0] === 0 ? halfVertexSize : 0

            return (
              <rect key={`h${i}`} className="shudan-gridline shudan-horizontal"
                x={fl(x)}
                y={fl((2 * i + 1) * halfVertexSize)}
                width= {
                  xs[xs.length - 1] === width - 1 ? fl((2 * xs.length - 1) * halfVertexSize - x) : fl(xs.length * vertexSize - x)
                }
                height= "1"
              />
            )
          })
        }
        { 
          xs.map((_, i) => {
            let y = ys[0] === 0 ? halfVertexSize : 0

            return (
              <rect key={`v${i}`} className="shudan-gridline shudan-vertical"
                x={fl((2 * i + 1) * halfVertexSize)}
                y={fl(y)}
                width= "1"
                height= {
                  ys[ys.length - 1] === height - 1 ? fl((2 * ys.length - 1) * halfVertexSize - y) : fl(ys.length * vertexSize - y)
                }
              />
            )
          })
        }
        {/* 星位 */}
        {
          hoshis.map(([x, y]) => {
            let i = xs.indexOf(x)
            let j = ys.indexOf(y)
            if (i < 0 || j < 0) return

            return (
              <circle key={[x, y].join('-')} className='shudan-hoshi'
                cx={fl((2 * i + 1) * halfVertexSize) + 0.5}
                cy={fl((2 * j + 1) * halfVertexSize) + 0.5}
                r='.1em'
              />
            )
          })
        }
      </svg>
    )}
    </>
  )

}

export default React.memo(Grid, (prevProps, nextProps) => {
  return (
    nextProps.vertexSize === prevProps.vertexSize &&
    nextProps.width === prevProps.width &&
    nextProps.height === prevProps.height &&
    nextProps.xs.length === prevProps.xs.length &&
    nextProps.ys.length === prevProps.ys.length &&
    nextProps.xs[0] === prevProps.xs[0] &&
    nextProps.ys[0] === prevProps.ys[0]
  )
})
