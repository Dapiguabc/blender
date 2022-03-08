import React from "react"

type ICheckbox = {
    label?: string
} & React.InputHTMLAttributes<HTMLInputElement>

const checkbox: React.FunctionComponent<ICheckbox> = ({ label, onChange, style }) => {
    return (
        <div style={style} className="checkbox">
            <input type="checkbox" onChange={onChange} /> {label}
        </div>
    )
}

export default checkbox