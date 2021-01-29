import React from 'react'

function CoordY (props) {
  let {
    height, 
    ys, 
    coordY = i => height - i
  } = props

  return (
    <div 
      className="shudan-coordy" 
      style={Object.assign( {
        textAlign: 'center'
      }, props.style)}> 
      { 
        ys.map(i => {
          return (
            <div key={i} style={{width: '1em'}}>
              <span style={{display: 'block'}}>{coordY(i)}</span>
            </div>
          )
        })
      }
    </div>
  )
}

export default React.memo(CoordY);