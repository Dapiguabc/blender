export const connectionRequest = {
    appName: 'Blender',
    version: '1.0.0',
    logo: 'assets/images/logo.png',
    contractName: 'con_phi_lst001',
    networkType: 'mainnet',
}

export const contracts:IContracts = {
    currency: {
        10: 'con_lamnado_currency_10_v1',
        100: 'con_lamnado_currency_100_v1',
        1000: 'con_lamnado_currency_1000_v1',
        10000: 'con_lamnado_currency_10000_v1',
        100000: 'con_lamnado_currency_100000_v1',
    },
    phi: {
        1000: 'con_lamnado_phi_1000_v1',
        10000: 'con_lamnado_phi_10000_v1',
        100000: 'con_lamnado_phi_100000_v1',
        1000000: 'con_lamnado_phi_1000000_v1',
    }
}

export const lamdenNetworkInfo = {
    apiLink: "https://blocks.gammaphi.io",
    blockexplorer: "https://www.tauhq.com",
    networkName: "Lamden Mainnet",
    network_symbol: "TAU",
    networkType: "mainnet",
    stamps: 200
}

export const relayerList = [{value: "https://relayer.gammaphi.io"}]

// apiLink: "https://blocks.gammaphi.io",
// blockexplorer: "https://www.tauhq.com",
// networkName: "Lamden Mainnet",
// network_symbol: "TAU",
// networkType: "mainnet",
// stamps: 200

// apiLink: "http://165.227.181.34:3535",
// blockexplorer: "https://testnet.lamden.io",
// networkName: "Lamden Testnet",
// network_symbol: "dTAU",
// networkType: "testnet",
// stamps: 200