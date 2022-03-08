import React from "react"

const CloseCircleIcon = ({width = "18", height = "18", color="#0C0C14"}: {width?: string | number, height?: string | number, color?: string}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 10L10 14M10 10L14 14L10 10Z" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default CloseCircleIcon