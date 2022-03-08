import { io, Socket } from "socket.io-client";

export const createSocketService = () => {
    let testnet_socket: Socket
    let mainnet_socket: Socket

    function start(){
        testnet_socket = io("ws://165.227.181.34:3535");
        mainnet_socket = io("ws://165.22.47.195:3535");
        
        testnet_socket.on('connect', () => {
            console.log("connected to TESTNET wallet block service")
        })

        mainnet_socket.on('connect', () => {
            console.log("connected to MAINNET wallet block service")
        })
    }

    // Currency Balance Services Join and Leave

    function joinCurrencyBalanceFeed(accountVk: string){
        joinBalanceFeed_Mainnet('currency', 'balances', accountVk)
        joinBalanceFeed_Testnet('currency', 'balances', accountVk)
    }

    function leaveCurrencyBalanceFeed(accountVk: string){
        leaveBalanceFeed_Mainnet('currency', 'balances', accountVk)
        leaveBalanceFeed_Testnet('currency', 'balances', accountVk)
    }

    // Token Balance Services Join and Leave
    function joinTokenBalanceFeed(tokenContract: any, accountVk: string, network: string){
        if (network === 'mainnet') joinBalanceFeed_Mainnet(tokenContract, 'balances', accountVk)
        if (network === 'testnet') joinBalanceFeed_Testnet(tokenContract, 'balances', accountVk)
    }

    function leaveTokenBalanceFeed(tokenContract: any, accountVk: string, network: string){
        if (network === 'mainnet') leaveBalanceFeed_Mainnet(tokenContract, 'balances', accountVk)
        if (network === 'testnet') leaveBalanceFeed_Testnet(tokenContract, 'balances', accountVk)
    }

    // Global Joins and Leaves
    function joinBalanceFeed_Mainnet(contract: string, variable: string, key: string){
        // console.log(`join-${contract}.${variable}:${key}`)
        mainnet_socket.emit('join', `${contract}.${variable}:${key}`)
    }

    function joinBalanceFeed_Testnet(contract: string, variable: string, key: string){
        testnet_socket.emit('join', `${contract}.${variable}:${key}`)
        //testnet_socket.emit('join', `new-contracts`)
    }

    function leaveBalanceFeed_Mainnet(contract: string, variable: string, key: string){
        // console.log(`leave-${contract}.${variable}:${key}`)
        mainnet_socket.emit('leave', `${contract}.${variable}:${key}`)
    }

    function leaveBalanceFeed_Testnet(contract: string, variable: string, key: string){
        testnet_socket.emit('leave', `${contract}.${variable}:${key}`)
    }

    start()

    return {
        start,
        joinCurrencyBalanceFeed,
        leaveCurrencyBalanceFeed,
        joinTokenBalanceFeed,
        leaveTokenBalanceFeed,
        testnet_socket_on: (event: string, callback: Function) => testnet_socket.on(event, callback),
        mainnet_socket_on: (event: string, callback: Function) => mainnet_socket.on(event, callback),
        testnet_socket_off: (event: string | undefined) => testnet_socket.off(event),
        mainnet_socket_off: (event: string | undefined) => mainnet_socket.off(event)
    }
}