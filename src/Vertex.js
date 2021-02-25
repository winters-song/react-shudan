import React from 'react'
const classnames = require('classnames')
const {vertexEvents} = require('./helper')

const absoluteStyle = zIndex => ({
  position: 'absolute',
  zIndex
})

function Vertex (props) {

  let {
    position,
    shift,
    random,
    sign,
    heat,
    paint,
    dimmed,
    marker,
    ghostStone,
    animate,
    selected,
    selectedLeft,
    selectedRight,
    selectedTop,
    selectedBottom
  } = props

  let markerMarkup = z =>
    !!marker && (
      <div className='shudan-marker' title={marker.label} style={absoluteStyle(z)} ></div>
    )

  let handlers = {}
  for (let e of vertexEvents) {
    handlers[e] = evt => {
      let handler = props[`on${e}`] || (() => {})
      handler(evt, props.position)
    }
  }

  return (
    <div
      data-x={position[0]}
      data-y={position[1]}
      style={{position: 'relative'}}
      className={
        classnames(
          'shudan-vertex',
          `shudan-random_${random}`,
          `shudan-sign_${sign}`,
          {
            [`shudan-shift_${shift}`]: !!shift,
            [`shudan-heat_${!!heat && heat.strength}`]: !!heat,
            [`shudan-paint_${paint > 0 ? 1 : -1}`]: !!paint,
            'shudan-dimmed': dimmed,
            'shudan-selected': selected,
            'shudan-selectedleft': selectedLeft,
            'shudan-selectedright': selectedRight,
            'shudan-selectedtop': selectedTop,
            'shudan-selectedbottom': selectedBottom,
            'shudan-animate': animate
          },

          marker && marker.type && `shudan-marker_${marker.type}`,
          marker &&
            marker.type === 'label' &&
            marker.label &&
            (marker.label.includes('\n') || marker.label.length >= 3) &&
            `shudan-smalllabel`,

          ghostStone && `shudan-ghost_${ghostStone.sign}`,
          ghostStone && ghostStone.type && `shudan-ghost_${ghostStone.type}`,
          ghostStone && ghostStone.faint && `shudan-ghost_faint`
        )
      }

      onClick={handlers['Click']}
      onMouseDown={handlers['MouseDown']}
      onMouseUp={handlers['MouseUp']}
      onMouseMove={handlers['MouseMove']}
      onMouseEnter={handlers['MouseEnter']}
      onMouseLeave={handlers['MouseLeave']}
    >
      {!sign && markerMarkup(0)}
      {!sign && !!ghostStone && (
        <div key='ghost' className='shudan-ghost' style={absoluteStyle(1)}></div>
      )}

      <div key='stone' className='shudan-stone' style={absoluteStyle(2)}>
        {!!sign && (
          <div key='shadow' className='shudan-shadow' style={absoluteStyle()}></div>
        )}
        {!!sign && (
          <div key='inner' style={absoluteStyle()}
            className={classnames(
              'shudan-inner',
              'shudan-stone-image',
              `shudan-random_${random}`,
              `shudan-sign_${sign}`
            )} 
          ></div>
        )}
        {!!sign && markerMarkup() }
      </div>
      {!!paint && (
        <div key='paint' className="shudan-paint" style={{
          ...absoluteStyle(3),
          opacity: Math.abs(paint || 0) * 0.5
        }}></div>
      )} 

      {!!selected && (
        <div key='selection' className="shudan-selection" style={absoluteStyle(4)}></div>
      )} 

      <div key="heat" className="shudan-heat" style={absoluteStyle(5)}></div>
      {!!heat && (
        <div key='heatlabel' className="shudan-heatlabel" style={absoluteStyle(6)}>
          {heat.text && heat.text.toString()}
        </div>
      )} 
    </div>
  )
}

// 返回 true 时，不会触发 render，如果返回 false，则会
export default React.memo(Vertex, (prevProps, nextProps) => {
  return (
    prevProps.shift === nextProps.shift &&
    prevProps.random === nextProps.random &&
    prevProps.sign === nextProps.sign &&
    prevProps.selected === nextProps.selected &&
    prevProps.heat === nextProps.heat &&
    prevProps.paint === nextProps.paint &&
    prevProps.dimmed === nextProps.dimmed &&
    prevProps.marker === nextProps.marker &&
    prevProps.ghostStone === nextProps.ghostStone &&
    prevProps.animate === nextProps.animate
  )
})
