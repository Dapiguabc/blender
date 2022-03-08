import * as React from "react"
import WalletIcon from "../components/icons/home/walletIcon"
import DepositIcon from "../components/icons/home/depositIcon"
import WithdrawIcon from "../components/icons/home/withdrawIcon"

const IndexPage = () => {
  return (
    <div id="home">
      <div className="desc">
        <div className="title">Send Transactions <span>Anonymously</span></div>
        <div className="body">Blender is a smart contract on the <a href="https://www.lamden.io" target="_blank">Lamden</a> blockchain that makes it possible to send transactions anonymously — your withdraw address will never know where it originated.</div>
      </div>
      <div className="features">
        <div className="feature">
          <div className="main">
            <div className="logo"><WalletIcon /></div>
            <div className="title">Connect Wallet</div>
            <div className="body">Connect your <a href="good">Lamden Wallet</a> to the Blender dApp. This will be the account you use to deposit TAU.</div>
          </div>
          <div className="foot"><a href="good">Connect Wallet</a></div>
        </div>
        <div className="feature">
          <div className="main">
            <div className="logo"><DepositIcon /></div>
            <div className="title">Deposit TAU</div>
            <div className="body">Deposit your TAU into one of the predetermined amounts. Your deposit will be blended into the crowd to remain anonymous.</div>
          </div>
          <div className="foot"><a href="good">Deposit</a></div>
        </div>
        <div className="feature">
          <div className="main">
            <div className="logo"><WithdrawIcon /></div>
            <div className="title">Withdraw Anonymously</div>
            <div className="body">Use the note you received during your deposit and enter the withdraw address that will receives TAU anonymously from the smart contract.</div>
          </div>
          <div className="foot"><a href="good">Withdraw</a></div>
        </div>
      </div>
    </div>
  )
}

export default IndexPage
