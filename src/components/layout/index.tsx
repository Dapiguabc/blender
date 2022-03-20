import React, { useEffect, useState } from 'react'
import Header from './header'
import Footer from './footer'
import { LWC } from '../../untils/walletUntils'
import { Wallet, WalletContext } from '../../context/walletContext'
import Message from '../message'
import { PageProps } from 'gatsby'
import { createSocketService } from '../../untils/socket'
import { checkContractState } from '../../untils/blender'

const navList = [{
  name: 'HOME',
  value: '/',
},{
  name: 'LAUNCH APP',
  value: '/app',
},{
  name: 'FAQ',
  value: '/faq',
},{
  name: 'DOCUMENTATION',
  value: '/doc',
}]

const socketService = createSocketService()

const Layout: React.FC<PageProps> = (props) => {
    const { children, location } = props
    const { pathname } = location
    const [wallet, setWallet] = useState<Wallet>({
      installed: false,
      locked: true,
      connected: false,
      account: '',
      currencyBalance: 0
    })
    const [inital, setInital] = useState(false)

    useEffect(() => {
      if (!inital) return
      if (wallet.connected) {
        Message.pop({
          type: 'success',
          title: 'Wallet Connect Success',
          content: `Account ${wallet.account} is using.`
        })
      } 
    }, [inital, wallet.connected])

    useEffect(()=>{
      if (!inital) return
      if (wallet.account) {
        checkContractState("currency", "balances", [wallet.account], 0).then((res) => {
          setWallet({
            ...wallet,
            currencyBalance: res.toString()
          })
        })
        socketService.joinCurrencyBalanceFeed(wallet.account)
        socketService.joinTokenBalanceFeed("con_phi_lst001", wallet.account, "mainnet")
        return () => {
          socketService.leaveCurrencyBalanceFeed(wallet.account)
          socketService.leaveTokenBalanceFeed("con_phi_lst001", wallet.account, "mainnet")
        }
      }
    }, [inital, wallet.account])

    const print = (e: any) => {
      console.log(e)
    }
    const handleNewInfo = (e: any) => {
      console.log(e)
      if (e.errors && e.errors.length > 0){
        //Respond to Errors
        return
      }
      if (e.installed) {
        if (e.locked) {
          Message.pop({
            type: 'error',
            title: 'Wallet Locked',
            content: <>
            Please unlock wallet.
          </>
          })
        }
      } else {
        Message.pop({
          type: 'error',
          title: 'Wallet Not Installed',
          content: <>
            Please install wallet.
            <a>https://chrome.google.com/webstore/detail/lamden-vault-browser-exte/fhfffofbcgbjjojdnpcfompojdjjhdim</a>
          </>
        })
      }
      let connected = e.installed && !e.locked ? true : false
      setWallet({
        ...wallet,
        installed: e.installed,
        locked: e.locked,
        connected: connected,
        account: e.wallets[0],
      })
      setInital(true)
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
      <WalletContext.Provider value={{wallet, setWallet, pageProps: props}}>
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