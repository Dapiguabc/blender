import React, { createContext } from 'react'

export interface IWalletContext {
    wallet: string | undefined,
    balance: string | number,
    setWallet: React.Dispatch<string | undefined>
}

export const WalletContext = createContext<IWalletContext>({
    wallet: undefined,
    balance: 0,
    setWallet: (wallet: string | undefined) => {}
})