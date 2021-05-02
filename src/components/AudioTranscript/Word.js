import React from 'react'

export default function Word (props) {

  const { startTime, endTime, word } = props;
  
  return (
    <span data-start={startTime} data-end={endTime}>
      { word} 
    </span>
  )
}