import React, { useState, useMemo, useContext, useCallback, useRef, FunctionComponent, useEffect} from "react"
import Select, { IOption } from "../components/select"
import Button from "../components/button"
import DepositModal from "../components/modal/depositModal"
import TauIcon from "../components/icons/tauIcon"
import { getIP, isLamdenKey, moneyFormat, verifyNote } from "../untils/commonUntils"
import { WalletContext } from "../context/walletContext"
import { checkWalletIsInstalled } from "../untils/walletUntils" 
import { contracts, relayerList } from "../global"
import AltPopup from "../components/popup/altPopup"
import WithdrawModal from "../components/modal/withdrawModal"
import Message from "../components/message"
import useCookieState from "../hooks/useCookieState"
import SelectWithInput from "../components/select/selectWithInput"

const amountOptions = [{
  key: '1',
  value: 10
},{
  key: '2',
  value: 100
},{
  key: '3',
  value: 1000
},{
  key: '4',
  value: 10000
},{
  key: '5',
  value: 100000
}]

const currencyOptions = [{
  key: '1',
  value: {
    contract: "currency",
    symbol: "TAU"
  },
  icon: TauIcon
},{
  key: '2',
  value: {
    contract: "con_phi_lst001",
    symbol: "PHI"
  },
  icon: TauIcon
}]

const symbols:{[k: string]: Token} = {
  PHI: 'phi',
  TAU: 'currency',
}

type Feature = 'deposit' | 'withdraw'

const Deposit = () => {

  const [showDepositModal, setShowDepositModal] = useState<undefined | boolean>(false)
  const [amount, setAmount] = useState(0)
  const [token, setToken]   = useState<undefined | TokenMeta>(undefined)
  const { wallet } = useContext(WalletContext)

  const btnName = useMemo(() => {
    if (wallet) {
      return `Deposit ${moneyFormat(amount)} ${token?.symbol}`
    } else {
      return `Connect Wallet`
    }
  }, [wallet, amount, token])

  const depositContract = useMemo(() => {
    if (token) {
      console.log(token)
      return contracts[symbols[token.symbol]][amount]
    } else {
      return ``
    }
  }, [amount, token])

  const btnHandle = useCallback(() => {
    if (wallet) {
      setShowDepositModal(true)
    } else {
      checkWalletIsInstalled()
    }
  }, [wallet]) 

  const handleDepositModal = (s:boolean | undefined) => { 
    setShowDepositModal(s) 
  }

  return (
    <>
        <div className="title">Deposit</div>
        <div className="flex flex-align-center text-legal" style={{marginBottom: 10}}>
          <div style={{ flex: "1 1 100px"}}>
            <div style={{marginBottom: 1}}>Select Deposit Amount</div>
            <Select options={amountOptions} 
              style={{width: "100%"}}
              onChange={(value)=>{
                setAmount(value as number)
              }} 
              renderItem={(item) => {
                return (
                  item.value + ' ' + token?.symbol
                )
              }} />
          </div>
          <div style={{marginLeft: 20 , flex: "1 1 50px"}}>
            <div style={{marginBottom: 1 }}>Currency</div>
            <Select<TokenMeta> style={{width: "100%"}} options={currencyOptions} onChange={(value) => { setToken(value) }} renderItem={(item)=>{
              return (
                <div className="flex flex-align-center">
                  <TauIcon/><span style={{marginLeft: "10px"}}>{item.value.symbol}</span>
                </div>
              )
            }}/>
          </div>
        </div>
        <div className="text-legal color-white">We have predetermined amounts that will allow your deposit to blend in to the crowd to remain anonymous.</div>
        <Button className={'primary'} style={{width: "100%", marginTop: "30px"}} onClick={btnHandle}>{btnName}</Button>
        <DepositModal onClose={()=>{setShowDepositModal(false)}} depositContract={depositContract} amount={amount as number} account={wallet as string} token={token as TokenMeta} show={ showDepositModal } onChange={ handleDepositModal } />
    </>
  )
}

const Withdraw = () => {

  const [note, setNote] = useState('')
  const [receiver, setReceiver] = useState('')
  const [btnEnabled, setBtnEnabled] = useState(true)
  const [showWithdraModal, setShowWithdraModal] = useState(false)
  const [relayer, setRelayer] = useState('')
  const [noteList, setNoteList] = useState<IOption<string>[]>([])

  // one month expires
  const [cookieNotes, setCookieNotes] = useCookieState('notes', {
    defaultValue: '',
    expires: (() => new Date(new Date().setMonth(+new Date().getMonth() + 1)))(),
  })

  useEffect(() => {
    if (cookieNotes === '') return
    let notes = cookieNotes?.split(',')
    if (notes) {
      setNoteList(notes.map((item) => {
        return {
          value: item
        }
      }))
    }
  }, [cookieNotes])

  useEffect(() => {
    if (note === '' || receiver === '') setBtnEnabled(true)
    if (verifyNote(note) && isLamdenKey(receiver)) setBtnEnabled(false)
  }, [note, receiver])

  const balance = useMemo(() => {
    if (note !== '' && verifyNote(note)) {
      let arr = note.split('-')
      return `${moneyFormat(arr[2])} ${arr[1]}`
    }
  }, [note])

  const btnHandle = () => {
    setShowWithdraModal(true)
  }

  return (
    <>
        <div className="title">Withdraw</div>
        <div>
          <div className="note mb20">
            <div className="mb5">
                Note
                <AltPopup 
                    value="This is the note you received during your deposit. It’s a string of random characters that ensures only you will be able to withdraw this deposit." 
                    style={{marginLeft: 10}}>
                    <span className="alt">i</span>
                </AltPopup>
            </div>
            <SelectWithInput className="mb5" style={{width: "100%", height: 50}} options={noteList} onChange={val => {setNote(val)}}/>
            {note === '' ?  undefined : verifyNote(note) ? undefined : <div className="errormsg">Invalid Note</div>}
            <div style={ verifyNote(note) ? undefined:{display: "none"}}>Balance of Note: {balance}</div>
          </div>
          <div className="mb20">
            <div className="mb5">Recipient Address</div>
            <input className="mb5" type="text" onBlur={e => {setReceiver(e.target.value)}}></input>
            {receiver === '' ? undefined : isLamdenKey(receiver) ? undefined : <div className="errormsg">Invalid Lamden Address</div>}
          </div>
          <div className="mb20">
            <div className="mb5">
                Relayer
                <AltPopup 
                    value="Relayers are used as another layer of protection to lower the chance of linking your deposit transaction with your deposit transaction to keep your transaction anonymous." 
                    style={{marginLeft: 10}}>
                    <span className="alt">i</span>
                </AltPopup>
            </div>
            <Select<string> style={{width: "100%", height: 50}} options={relayerList} onChange={(value) => { setRelayer(value) }} />
          </div>
          <Button disabled={btnEnabled} className={'primary'} style={{width: "100%", marginTop: "30px"}} onClick={btnHandle}>Withdraw {balance}</Button>
        </div>
        <WithdrawModal onClose={()=>{setShowWithdraModal(false)}}   show={ showWithdraModal }  relayer={relayer} note={note} to={receiver}/>
    </>
  )
}

const AppPage = () => {

  const [currentFeature, setCurrentFeature] = useState<Feature>('deposit')
  const [ip, setIp] = useState<string>('')
  
  useEffect(()=>{
    getIP().then((ip)=>{
      setIp(ip)
    })
  }, [])

  return (
    <div id="app">
      <div className="title">Send Transactions <span>Anonymously</span></div>
      <div className="legal">This is experimental software, please use Blender at your own risk. <a href="https://www.lamden.io" target="_blank">Learn More</a></div>
      <div className="action">
        <div className="features">
          <div className={currentFeature === 'deposit' ? 'active' : undefined } onClick={()=>{ setCurrentFeature('deposit') }}>Deposit</div>
          <div className={currentFeature === 'withdraw' ? 'active' : undefined } onClick={()=>{ setCurrentFeature('withdraw') }}>Withdraw</div>
        </div>
        <hr/>
        <div className="content">{currentFeature === 'deposit' ? <Deposit /> : <Withdraw />}</div>
      </div>
      <div className="legal">We recsommend using a VPN as another layer of protection. {ip? `Your current IP address is ${ip}.` : undefined}</div>
    </div>
  )
}

export default AppPage
