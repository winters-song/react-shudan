import React from 'react'

const {alpha} = require('./helper')

function CoordX (props) {
  let {
    xs,
    coordX = i => alpha[i] || alpha[alpha.length - 1]
  } = props

  return (
    <div 
      className="shudan-coordx" 
      style={Object.assign({
        display: 'flex',
        textAlign: 'center'
      }, props.style)}> 
      { 
        xs.map(i => {
          return (
            <div key={i} style={{width: '1em'}}>
              <span style={{display: 'block'}}>{coordX(i)}</span>
            </div>
          )
        })
      }
    </div>
  )
}

export default React.memo(CoordX);