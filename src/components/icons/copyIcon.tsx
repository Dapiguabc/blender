import React from "react"

const CopyIcon = ({ color }: {color: string | undefined}) => {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0H8.4V8.4H0V0ZM12 3.6V12H3.6V9.6H4.8V10.8H10.8V4.8H9.6V3.6H12Z" fill={color}/>
    </svg>
  )
}

export default CopyIcon