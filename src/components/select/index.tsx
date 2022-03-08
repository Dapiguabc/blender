import React, { useState, useEffect } from "react"
import ArrowDownIcon from "../icons/arrowDownIcon"
import ArrowUpIcon from "../icons/arrowUpIcon"

export interface IOption<T={}> {
    key?: string
    value: T,
    icon?: React.ReactNode
}

export interface ISelectProps<T={}> {
    disabled?: boolean
    onChange?: (value: T) => void
    options: IOption<T>[]
    style?: React.CSSProperties
    className?: string
    renderItem?: (item: IOption<T>) => React.ReactNode
}

const Select = <T,>(props: ISelectProps<T>) => {

    const { options, renderItem, onChange} = props
    const [showOptions, setShowOptions] = useState(false)
    const [currentOption, setCurrentOption] = useState(options[0])
    
    const handleOptionChange = (option: IOption<T>) => {
        setCurrentOption(option)
        setShowOptions(false)
        if (onChange) onChange(option.value)
    }

    useEffect(()=>{
        let option = options[0]
        handleOptionChange(option)
    },[])

    return ( 
        <div 
            className={"select "+ props.className}
            style={props.style}
        >   
            <div className={"currently-selectd"} onClick={ () => {setShowOptions(!showOptions)} }>
                {currentOption? renderItem? renderItem(currentOption): currentOption.value : "Please select one value" }
                { showOptions ? <ArrowUpIcon style={{marginLeft: 10}} /> : <ArrowDownIcon style={{marginLeft: 10}} /> }
            </div>
            <div className="option-wrap" style={showOptions ? undefined : {display: "none"} }>
                {options && options.length > 0 ?
                    options.map(option => {
                        return (
                            <div className="option-item" key={option.key} onClick={()=>{
                                handleOptionChange(option)
                            }}>
                            {renderItem ? renderItem(option): option.value }
                            </div>
                        )
                    })
                    :
                    <div className="option-empty">
                        No Data
                    </div>
                }
            </div>
        </div>
    )
}


export default Select