import React, { useEffect, useState, useRef, useMemo } from "react"
import Button from "../button"
import Modal from "./index"
import Checkbox from "../checkbox"
import CopyIcon from "../icons/copyIcon"
import DownloadIcon from "../icons/downloadIcon"
import CheckmarkIcon from "../icons/checkmarkIcon"
import { moneyFormat, formatAccountAddress, downloadFile} from "../../untils/commonUntils"
import { sendTokenApproval, checkContractState, createNote, createRandomDeposit, blenderDeposit, IDeposit} from "../../untils/blender"  
import BN from 'bignumber.js'
import copy from 'copy-to-clipboard';
import AltPopup from "../popup/altPopup"
import Message from "../message"
import useCookieState from "../../hooks/useCookieState"

const defaultApproveAmount = '99999999999999999'

const symbols:{[k: string]: Token} = {
    PHI: 'phi',
    TAU: 'currency',
}

const DepositModal: React.FunctionComponent<IDepositModal> = ({ depositContract, account, amount, token, style, show, onChange, onClose }) => {

    const [checked, setChecked] = useState(false)
    const [approved, setApproved] = useState(false)
    const [copySuccess, setCopySuccess] = useState(false)
    const [copyAccountSuccess, setCopyAccountSuccess] = useState(false)
    const [downloadSuccess, setDownloadSuccess] = useState(false)
    const [alreadyDownload, setAlreadyDownload] = useState(false)
    const [note, setNote] = useState<string | undefined>(undefined)
    const [deposit, setDeposit] = useState<IDeposit | undefined>(undefined)
    const [loading, setLoading] = useState(false)
    const [cookieNotes, setCookieNotes] = useCookieState('notes', {
        defaultValue: '',
        expires: (() => new Date(new Date().setMonth(+new Date().getMonth() + 1)))(),
      })

    const cref = useRef<{close: () => void}>({close: () => {}})

    useEffect(() => {
        if (show) {
            checkApproved()
            setChecked(false)
            setAlreadyDownload(false)
        }
    }, [show])

    useEffect(() => {
        if (show && amount && token) {
            createRandomDeposit().then((deposit) => {
                setDeposit(deposit)
                let note = createNote(amount, token?.symbol, deposit)
                setNote(note)
            })
        }
    }, [show, amount, token])

    const btnName = useMemo(() => {
        if (note) {
            if (approved) {
                if (loading) {
                    return "Depositing..."
                } else {
                    return `Confirm Deposit ${moneyFormat(amount)} ${token.symbol}`
                }
            } else {
                if (loading) {
                    return "Approving..."
                } else {
                    return "Approve"
                }
            }
        } else {
            return "Creating Note..."
        }
    }, [note, approved, loading, amount, token])

    const checkApproved = async () => {
        if (!token || !account || !depositContract) return
        let approvedNum =  new BN(await checkContractState(token.contract, 'balances', [account, depositContract], 0))
        if (new BN(amount).comparedTo(approvedNum) === 1) {
            console.log("未授权")
            setApproved(false)
        } else {
            setApproved(true)
        }
    }

    const approve = () => {
        setLoading(true)
        sendTokenApproval(new BN(defaultApproveAmount), token.contract, depositContract, (res: any) => {
            console.log(res)
            setLoading(false)
            if (res?.data?.resultInfo?.statusCode === 0) {
                setApproved(true)
                Message.pop({
                    type: 'success',
                    title: "Approve Success",
                    content: `Successfully give ${depositContract} access to ${amount} ${token.symbol}.`
                })
            } else {
                //do something
                console.log(res)
            }
        })
    }

    const btnHandle = () => {
        if (approved) {
            if (deposit) {
                if (alreadyDownload) {
                    setLoading(true)
                    blenderDeposit(amount, symbols[token.symbol], deposit, (res: any) => {
                        setLoading(false)
                        console.log(res)
                        // setCookieNotes()
                    })
                } else {
                    Message.pop({
                        type: "error",
                        title: "Download Note",
                        content: "Please download your note. Without this note, you will lose access to your deposited assets.",
                    })
                }
            }
        } else {
            approve()
        }
    }

    const handleCopyAccount = () => {
        copy(account ?? '')
        setCopyAccountSuccess(true)
        setTimeout(()=>{
            setCopyAccountSuccess(false)
        }, 1000)
    }

    const handleCopy = () => {
        copy(note ?? '')
        setCopySuccess(true)
        setTimeout(()=>{
            setCopySuccess(false)
        }, 1000)
    }

    const handleDownload = () => {
        let currDateTime = new Date().toLocaleString();
        let filename = "Blender_Note_" + currDateTime + ".txt";
        downloadFile(filename, note??'')
        setDownloadSuccess(true)
        setAlreadyDownload(true)
        setTimeout(()=>{
            setDownloadSuccess(false)
        }, 1000)
    }

    const close = () => {
        if (cref && cref.current) {
            cref.current.close()
        }
    }


    return (
        <Modal cref={cref} style={{maxWidth: 434, width: "90%"}} show={ show } onChange={ onChange } onClose= {onClose}>
            <div className="deposit" style={ style }>
                <div className="title">Confirm Deposit</div>
                <div className="info">
                    <div>Address: <span className={`link ${copyAccountSuccess? "success" : ""}`} onClick={handleCopyAccount}>{formatAccountAddress(account, 10)}</span> {copyAccountSuccess? <CheckmarkIcon color="var(--success-color)" /> : <CopyIcon color="var(--primary-color)" /> } </div>
                    <div>Deposit: <span>{moneyFormat(amount)} {token?.symbol}</span></div>
                </div>
                <div className="warning">Please backup your note. If you lose this note, you will be unable to withdraw your TAU.</div>
                <div className="note">
                    <div>
                        Note
                        <AltPopup 
                            value="A note is a string of random characters that ensures only you will be able to withdraw this deposit." 
                            style={{marginLeft: 10}}>
                            <span className="alt">i</span>
                        </AltPopup>
                    </div>
                    <div className="note-content">{formatAccountAddress(note, 24, 8)}</div>
                </div>
                <div className="actions">
                    <div className={`action ${copySuccess? "success" : ""}`} onClick={handleCopy}>
                        <span>Copy Note</span> 
                        {copySuccess? <CheckmarkIcon color="var(--success-color)" /> : <CopyIcon color="var(--primary-color)" /> }
                    </div>
                    <div className={`action ${downloadSuccess? "success" : ""}`} onClick={handleDownload}>
                        <span>Download Note</span>
                        {downloadSuccess? <CheckmarkIcon color="var(--success-color)" /> : <DownloadIcon color="var(--primary-color)" /> }
                    </div>
                </div>
                <Checkbox style={{marginBottom: 20}} onChange={(e)=>{setChecked(e.target.checked)}} label="I confirm I have the note backed up." />
                <Button disabled={!checked || loading} className={`primary confirm-btn large`} onClick={btnHandle}>{btnName}</Button>
                <Button className="cancel large" onClick={close}>Cancel</Button>
            </div>
        </Modal>
    )
}

export default DepositModal