import BigNumber from 'bignumber.js'
import { PageProps } from 'gatsby'
import React, { createContext } from 'react'

export type WalletStatus =  "locked" | "connected"  

export type Wallet = {
    installed: boolean
    locked: boolean
    connected: boolean
    account: string
    currencyBalance: string | number | BigNumber
}

export interface IWalletContext {
    wallet: Wallet,
    setWallet: React.Dispatch<Wallet>,
    pageProps?: PageProps
}

export const WalletContext = createContext<IWalletContext>({
    wallet: {
        installed: false,
        locked: true,
        connected: false,
        account: '',
        currencyBalance: 0
    },
    setWallet: (wallet: Wallet) => {}
})