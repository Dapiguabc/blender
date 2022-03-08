import React, { useState } from "react"

const AltPopup: React.FC<React.HTMLAttributes<HTMLDivElement> & {value: string}> = ({ children, style, value}  ) => {
    return (
        <div className="popup altPopup" style={style}>
            {children}
            <div className="body">{value}</div>
        </div>
    )   
}

export default AltPopup