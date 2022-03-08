import React, { useEffect, useState, useImperativeHandle, forwardRef} from "react"

const Modal: React.FC<IModal> = forwardRef(({ cref, children, style, show, onChange, onClose}) => {
    const [isShow, setIsShow] = useState<boolean | undefined>(false)
    
    useImperativeHandle(cref, () => ({
        close : () => {
            if (onClose) onClose()
            setIsShow(false) 
        }
    }))

    useEffect(() => {
        setIsShow(show)
    }, [show])

    useEffect(() => {
       if (onChange) onChange(isShow) 
    }, [isShow])

    return (
        <div className="modal" style={isShow ? undefined : {display: "none"}}>
            <div className="modal-content" style={style}>
                <div className="close-btn" onClick={()=>{ 
                    if (onClose) onClose()
                    setIsShow(false) 
                }}></div>
                {isShow ? children : undefined}
            </div>
        </div>
    )
})

export default Modal