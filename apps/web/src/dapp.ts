import { Contract, ethers } from "ethers"
import ARC from "./artifacts/contracts/Arcades.sol/Arcades.json"
import SCRAP from "./artifacts/contracts/ScrapToken.sol/ScrapToken.json"
import addresses from "./artifacts/contract-addresses.json"
import { Arcades, ScrapToken } from "./typechain/index"
import mitt from "mitt"
import { AxiosError } from "axios"

type Events = {
    error: Error
    connect: string
}

declare let window: Window & typeof globalThis & { ethereum: any, dapp: dApp };

export class dApp {
    arcades: Arcades
    scrapToken: ScrapToken
    provider: ethers.providers.BaseProvider
    signer: ethers.providers.JsonRpcSigner | undefined
    assetBase = "https://zi9xsu.deta.dev/"
    walletConnected: boolean = false
    events = mitt<Events>()

    constructor() {
        this.provider = new ethers.providers.JsonRpcProvider({
            url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
        })

        this.arcades = new ethers.Contract(addresses.arcades, ARC.abi, this.provider) as Arcades
        this.scrapToken = new ethers.Contract(addresses.scrapToken, SCRAP.abi, this.provider) as ScrapToken
    }

    async connectWallet() {
        if (!window.ethereum) return this.events.emit("error", new Error("No wallet provider was found"))
        await (<Promise<string[]>>window.ethereum.request({ method: 'eth_requestAccounts' }))
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
        this.provider = web3Provider

        this.signer = web3Provider.getSigner()
        this.arcades = this.arcades.connect(this.signer)
        this.scrapToken = this.scrapToken.connect(this.signer)

        const n = await web3Provider.detectNetwork()
        if (n.chainId != 97) {
            this.events.emit("error", new Error(`You are on ${n.name} network please switch to BSC Testnet`))
            this.switchNetworks()
        } else {
            this.walletConnected = true
            this.events.emit("connect", await this.signer.getAddress())
        }
    }

    registerToken(token: Contract, symbol: string, isNFT: boolean, image: string) {
        return window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20', // Initially only supports ERC20, but eventually more!
                options: {
                    address: token.address, // The address that the token is at.
                    symbol: symbol, // A ticker symbol or shorthand, up to 5 chars.
                    decimals: isNFT ? 0 : 18, // The number of decimals in the token
                    image, // A string url of the token logo
                },
            },
        });
    }

    private async switchNetworks() {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x61' }],
            });
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if ((<any>switchError).code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: '0x61',
                                chainName: 'BSC Testnet',
                                rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
                            },
                        ],
                    });
                } catch (addError) {
                    // handle "add" error
                }
            }
            // handle other "switch" errors
        }
    }
}

const instance = new dApp()
window.dapp = instance
export default instance
