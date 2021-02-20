import React, {useState, useEffect, useRef} from 'react'
import Goban from './Goban'

function BoundedGoban(props) {
  let {
    showCoordinates,
    maxWidth = 400,
    maxHeight = 400,
    rangeX,
    rangeY,
    signMap,
    style = {}, 
    maxVertexSize = Infinity} = props

  const [vertexSize, setVertexSize] = useState(1)
  const [visibility, setVisibility] = useState('hidden')

  const gobanRef = useRef(null);

  useEffect(() => {
    let {offsetWidth, offsetHeight} = gobanRef.current
    let scale = Math.min(maxWidth / offsetWidth, maxHeight / offsetHeight)
    let newVertexSize = Math.max(Math.floor(vertexSize * scale), 1)

    if (vertexSize !== newVertexSize) {
      setVertexSize(newVertexSize)
    }

    if (visibility !== 'visible') {
      setVisibility('visible')
    }
  }, [visibility, showCoordinates,maxWidth, maxHeight, maxVertexSize, rangeX, rangeY, signMap])

  return (
    <Goban ref={gobanRef}
      {...Object.assign({}, props, {

        style: Object.assign({
          visibility: visibility
        }, style ),

        vertexSize: Math.min(vertexSize, maxVertexSize)
      })} />
  )
}

export default React.memo(BoundedGoban) 
