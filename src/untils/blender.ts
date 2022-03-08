import { sendTransaction } from './walletUntils'
import { contracts, lamdenNetworkInfo } from '../global'
import forge from 'node-forge';
import BN, { BigNumber } from 'bignumber.js'


export const DEFAULT_RELAYER_URL = 'https://relayer.gammaphi.io'

export interface IDeposit {
    nullifier: forge.util.ByteStringBuffer,
    secret: forge.util.ByteStringBuffer,
    nullifierHex: string,
    secretHex: string,
    preimage: forge.util.ByteStringBuffer | undefined,
    commitment: any,
    nullifierHash: any
}


/** Generate random number of specified byte length */
const rbigint = (nbytes: number) => forge.util.createBuffer(forge.random.getBytesSync(nbytes));

/** BigNumber to hex string of specified length */
export const toHex = (number: any) => number.toHex()

/**
 * Create deposit object from secret and nullifier
 */
async function createDeposit(nullifier: forge.util.ByteStringBuffer, secret: forge.util.ByteStringBuffer) {
    let deposit:IDeposit = {
        nullifier, 
        secret,
        nullifierHex: '',
        secretHex: '',
        preimage: undefined,
        commitment: undefined,
        nullifierHash: ''
    }
    deposit.nullifierHex = deposit.nullifier.toHex()
    deposit.secretHex = deposit.secret.toHex()
    deposit.preimage = forge.util.createBuffer(forge.util.hexToBytes(deposit.nullifier.toHex() + deposit.secret.toHex()))
    if (deposit.preimage.toHex() !== deposit.nullifierHex+deposit.secretHex) {
        console.log(deposit.nullifierHex+deposit.secretHex)
        console.log(deposit.preimage.toHex())
        throw Error('Invalid preimage')
    }
    deposit.commitment = await pedersenHash(deposit.preimage)
    deposit.nullifierHash = await pedersenHash(deposit.nullifier)
    return deposit
}


/**
 * Create a random deposit object
 */
export async function createRandomDeposit() {
    return await createDeposit(rbigint(31), rbigint(31))
}


/** 
 * Return note from given data
 */
export function createNote(amount: number, tokenSymbol: string, deposit: IDeposit) {
    return `blender-${tokenSymbol}-${amount}-${toHex(deposit.preimage)}`
}


/**
 * Callback is called with a note and the result of the lamden transaction
 */
export async function blenderDeposit(amount: number, token: Token, deposit: IDeposit, callback?: Function) {
    const contract = contracts[token][amount];

    // make sure contract is valid
    if (!contract) {
        throw Error(`No contract exists for ${token} with denomination ${amount}`)
    }

    // prepare transaction
    const commitment = deposit.commitment
    const txInfo = {
        networkType: lamdenNetworkInfo.networkType,
        contractName: contract,
        methodName: 'deposit',
        kwargs: {
            commitment: commitment,
        },
        stampLimit: lamdenNetworkInfo.stamps,
    }
    sendTransaction(txInfo, callback)    
}


/**
 * Send an async request to a relayer to withdraw funds
 */
export async function blenderWithdraw(note: string, recipient: string, relayer_url=DEFAULT_RELAYER_URL) {
    // extract data from note
    const noteSplit = note.split('-')
    if (noteSplit.length != 4) {
        return
    }
    // prepare POST
    const body = {
        token: noteSplit[1],
        denomination: noteSplit[2],
        note: noteSplit[3],
        recipient: recipient,
    }
    console.log(body)

    // check if nullifier has already been spent
    // TODO

    // send request to relayer
    const res = await fetch(
        `${relayer_url}/relay`, {
            method: 'POST',
            mode: "no-cors",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        },
    )
    if (res.status === 200) {
        let json = await res.json()
        return json
    } else {
        throw Error("Withdraw request returned a non 200 status code.")
    }
}


/**
 * Get the pedersen hash
 */
/**
 * Send an async request to a relayer to withdraw funds
 */
 export async function pedersenHash(data: forge.util.ByteStringBuffer, relayer_url=DEFAULT_RELAYER_URL) {
    // prepare POST
    const body = {
        data: toHex(data)
    }

    // send request to relayer
    const res = await fetch(
        `${relayer_url}/hash`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        },
    )
    if (res.status === 200) {
        let json = await res.json()
        return json.hash
    } else {
        throw Error("Withdraw request returned a non 200 status code.")
    }
}

/**
 * Utility function to approve a token contract
 */
 export function sendTokenApproval (amount: BigNumber, tokenContract: string, lamnadoContract: string, callback: Function | undefined) {
    console.log('callback', typeof callback)
    console.log('Amount: '+amount.toString())
    console.log('Token Contract: '+ tokenContract)
    console.log('Lamnado Contract: '+ lamnadoContract)
    const txInfo = {
        networkType: lamdenNetworkInfo.networkType,
        contractName: tokenContract,
        methodName: 'approve',
        kwargs: {
            amount: { __fixed__: amount.toString() },
            to: lamnadoContract,
        },
        stampLimit: lamdenNetworkInfo.stamps,
    }

    sendTransaction(txInfo, callback)
}


/** Return state for smart contract */
export async function checkContractState(contract: string, variableName: string, keys: string[], default_value: any) {
    try {
        let url = `${lamdenNetworkInfo.apiLink}/current/one/${contract}/${variableName}`;
        if (keys.length > 0) {
            url = `${url}/${keys.join(':')}`
        }
        const res = await fetch(
            url, {
                method: 'GET',
            },
        )
        if (res.status === 200) {
            let json = await res.json()
            let value = json.value
            if (value) {
                if (value.__fixed__) return new BN(value.__fixed__)
                else return value
            } else {
                return default_value
            }
        } else {
            return default_value
        }
    } catch (error) {
        return default_value;
    }
}