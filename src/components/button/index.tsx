import * as React from "react"

interface IButtonProps {
    disabled?: boolean
    className?: string
    style?: React.CSSProperties
    onClick?: React.MouseEventHandler
}

const Button: React.FunctionComponent<IButtonProps> = ( props ) => {

    const handleClick = (e: React.MouseEvent<Element, MouseEvent>) => {
        if (props.disabled) return
        if (props.onClick) props.onClick(e)
    }
    return ( 
        <button style={props.style} onClick={handleClick} className={`${props.className} ${props.disabled ? 'disabled' : ''}`}>{props.children}</button>
    )
}


export default Button