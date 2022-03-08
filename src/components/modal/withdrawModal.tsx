import React, { useEffect, useRef, useState } from "react"
import Button from "../button"
import Modal from "./index"
import CopyIcon from "../icons/copyIcon"
import CheckmarkIcon from "../icons/checkmarkIcon"
import { moneyFormat, formatAccountAddress } from "../../untils/commonUntils"
import { blenderWithdraw } from "../../untils/blender"  
import copy from 'copy-to-clipboard';
import Message from "../message"

const WithdrawModal: React.FunctionComponent<IWithdrawModal> = ({ note, to, relayer, style, show, onClose }) => {

    const [copyAccountSuccess, setCopyAccountSuccess] = useState(false)
    const [info, setInfo] = useState({
        amount: '0',
        tokenSymbol: ''
    })
    const [loading, setLoading] = useState(false)
    const cref = useRef<{close: () => void}>({close: () => {}})

    useEffect(() => {
        let arr = note.split('-')
        setInfo({
            amount: arr[2],
            tokenSymbol: arr[1]
        })
    }, [note])

    const btnHandle = async () => {
        try {
            setLoading(true)
            let res = await blenderWithdraw(note, to, relayer)
            console.log(res)
            close()
            setLoading(false)
        } catch (error) {
            Message.pop({
                type: "error",
                title: "Withdraw Error",
                content: (error as any).message
            })
        }
    }

    const handleCopyAccount = () => {
        copy(to ?? '')
        setCopyAccountSuccess(true)
        setTimeout(()=>{
            setCopyAccountSuccess(false)
        }, 1000)
    }

    const close = () => {
        if (cref && cref.current) {
            cref.current.close()
        }
    }


    return (
        <Modal style={{maxWidth: 434, width: "90%"}} show={ show } onClose= {onClose}>
            <div className="deposit" style={ style }>
                <div className="title">Confirm Deposit</div>
                <div className="info">
                    <div>Address: <span className={`link ${copyAccountSuccess? "success" : ""}`} onClick={handleCopyAccount}>{formatAccountAddress(to, 10)}</span> {copyAccountSuccess? <CheckmarkIcon color="var(--success-color)" /> : <CopyIcon color="var(--primary-color)" /> } </div>
                    <div>Withdraw: <span>{moneyFormat(info.amount)} {info.tokenSymbol}</span></div>
                    <div>Relayer: <span>blender</span></div>
                </div>
                <Button disabled={loading} className={`primary confirm-btn large`} onClick={btnHandle}>{loading? 'Withdrawing...' : `Confirm Withdraw ${moneyFormat(info.amount)} ${info.tokenSymbol}`}</Button>
                <Button className="cancel large" onClick={close}>Cancel</Button>
            </div>
        </Modal>
    )
}

export default WithdrawModal