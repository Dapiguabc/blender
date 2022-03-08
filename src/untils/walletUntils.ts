import WalletController from 'lamden_wallet_controller'
import { connectionRequest } from '../global'

export const LWC = new WalletController(connectionRequest)

// Check if wallet is installed and will automatically connect to wallet if installe.
export const checkWalletIsInstalled = async (): Promise<boolean> => {
    return await LWC.walletIsInstalled()
    .then((installed: boolean) => {
        if (installed) { 
            return true  
        } else {
            console.log("The wallet is not installed!!!")
            return false
        }
    })
} 

export const getWalletInfo  = async () => {
    await LWC.getInfo()
}

export const sendTransaction = async (txInfo: any, handleResults?: Function): Promise<void> => {
    LWC.sendTransaction(txInfo, handleResults)
}
