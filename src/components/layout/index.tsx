import React, { useEffect, useState } from 'react'
import Header from './header'
import Footer from './footer'
import { LWC } from '../../untils/walletUntils'
import { WalletContext } from '../../context/walletContext'
import Message from '../message'
import { PageProps } from 'gatsby'
import { createSocketService } from '../../untils/socket'
import { checkContractState } from '../../untils/blender'

const navList = [{
  name: 'HOME',
  value: '/',
},{
  name: 'LANUCH APP',
  value: '/app',
},{
  name: 'FAQ',
  value: '/faq',
},{
  name: 'DOCUMENTATION',
  value: '/doc',
}]

type WalletStatus = "noinstalled" | "locked" | "connected"  

const socketService = createSocketService()

const Layout: React.FC<PageProps> = ({ children, location}) => {
    const { pathname } = location
    const [wallet, setWallet] = useState<string | undefined>(undefined)
    const [walletStaus, setWalletStaus] = useState<WalletStatus | undefined>(undefined)
    const [balance, setBalance] = useState<number | string>(0)

    useEffect(()=>{
      if (walletStaus === "noinstalled") {
        setWallet(undefined)
        Message.pop({
          type: 'error',
          title: 'Wallet Error',
          content: <>
            Please install wallet.
            <a>https://chrome.google.com/webstore/detail/lamden-vault-browser-exte/fhfffofbcgbjjojdnpcfompojdjjhdim</a>
          </>
        })
        setWalletStaus(undefined)
      } else if (walletStaus === "locked") {
        setWallet(undefined)
        Message.pop({
          type: 'error',
          title: 'Wallet Locked',
          content: <>
          Please unlock wallet.
        </>
        })
        setWalletStaus(undefined)
      } if (walletStaus === "connected") {
        if (wallet)
          Message.pop({
            type: 'success',
            title: 'Wallet Connect Success',
            content: `Account ${wallet} is using.`
          })
      }
    }, [walletStaus, wallet])

    useEffect(()=>{
      if (wallet) {
        checkContractState("currency", "balances", [wallet], 0).then((res) => {
          setBalance(res.toString())
        })
        socketService.joinCurrencyBalanceFeed(wallet)
        socketService.joinTokenBalanceFeed("con_phi_lst001", wallet, "mainnet")
        return () => {
          socketService.leaveCurrencyBalanceFeed(wallet)
          socketService.leaveTokenBalanceFeed("con_phi_lst001", wallet, "mainnet")
        }
      }
    }, [wallet])

    const print = (e: any) => {
      console.log(e)
    }
    const handleNewInfo = (e: any) => {
      console.log(e)
      if (e.errors && e.errors.length > 0){
        //Respond to Errors
        return
      }
      if (!e.installed){
        //Prompt user to unlock wallet
        setWalletStaus("noinstalled")
      }
      if (e.locked){
          //Prompt user to unlock wallet
          setWalletStaus("locked")
      } else {
          //Get user's account address
          if (e.wallets[0] !== wallet) {
            setWalletStaus("connected")
            setWallet(e.wallets[0])
          }
      } 
    }

    const handleBalanceUpdate = (res: any, networkType: string) => {
      console.log(res)
    }

    useEffect(() => {
      LWC.events.on('newInfo', handleNewInfo)
      LWC.events.on('txStatus', print)
      socketService.testnet_socket_on('new-state-changes-one', (update: any) => handleBalanceUpdate(update, 'testnet'))
      socketService.mainnet_socket_on('new-state-changes-one', (update: any) => handleBalanceUpdate(update, 'mainnet'))
      return () => { 
        LWC.events.removeListener('newInfo', handleNewInfo)
        LWC.events.removeListener('txStatus', print)
        socketService.testnet_socket_off('new-state-changes-one')
        socketService.mainnet_socket_off('new-state-changes-one')
      }
    },[])

    return (
      <WalletContext.Provider value={{wallet, balance, setWallet}}>
        <div id="layout">
          <Header navList={ navList } pathname={pathname}/>
          <div>
            {children}
          </div>
          <Footer className={`${pathname === "/" ? "home-footer": null}`} />
        </div>
      </WalletContext.Provider>
    )
}

export default Layout