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

type ISelectWithInputProps = Omit<ISelectProps<string>, 'renderItem'>;

const SelectWithInput = (props: ISelectWithInputProps) => {

    const { options, onChange} = props
    const [showOptions, setShowOptions] = useState(false)
    const [currentOption, setCurrentOption] = useState(options[0])
    const [value, setValue] = useState<string | null>(null)
    
    const handleOptionChange = (option: IOption<string>) => {
        setCurrentOption(option)
        setShowOptions(false)
        setValue(option.value)
    }

    useEffect(() => {
        if (!value) return;
        if (onChange) onChange(value)
    }, [value])

    return ( 
        <div 
            className={"select "+ props.className}
            style={props.style}
        >   
            <div className={"currently-selectd"} >
                <input onChange={(e) => { setValue(e.target.value) }} className="select-input"></input>
                <div style={{width: 20}} onClick={ () => {setShowOptions(!showOptions)} }>{ showOptions ? <ArrowUpIcon style={{marginLeft: 10}} /> : <ArrowDownIcon style={{marginLeft: 10}} /> }</div>
            </div>
            <div className="option-wrap" style={showOptions ? undefined : {display: "none"} }>
                {options && options.length > 0 ?
                    options.map(option => {
                        return (
                            <div className="option-item" key={option.key} onClick={()=>{
                                handleOptionChange(option)
                            }}>
                            {option.value}
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


export default SelectWithInput