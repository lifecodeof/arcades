import { Contract, ethers } from "ethers"
import ARC from "./artifacts/contracts/Arcades.sol/Arcades.json"
import SCRAP from "./artifacts/contracts/ScrapToken.sol/ScrapToken.json"
import addresses from "./artifacts/contract-addresses.json"
import { Arcades, ScrapToken } from "../typechain"

declare let window: Window & typeof globalThis & { ethereum: any, dapp: dApp };

export class dApp {
    arcades: Arcades
    scrapToken: ScrapToken
    provider: ethers.providers.Web3Provider
    signer: ethers.providers.JsonRpcSigner
    assetBase = "https://zi9xsu.deta.dev/"

    constructor() {
        window.ethereum.request({ method: 'eth_requestAccounts' })
        this.provider = new ethers.providers.Web3Provider(window.ethereum)
        this.signer = this.provider.getSigner()
        this.arcades = new ethers.Contract(addresses.metalTag, ARC.abi, this.signer) as Arcades
        this.scrapToken = new ethers.Contract(addresses.scrapToken, SCRAP.abi, this.signer) as ScrapToken
    }

    registerToken(token: Contract, symbol: string, isNFT: boolean) {
        return window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20', // Initially only supports ERC20, but eventually more!
                options: {
                    address: token.address, // The address that the token is at.
                    symbol: symbol, // A ticker symbol or shorthand, up to 5 chars.
                    decimals: isNFT ? 0 : 18, // The number of decimals in the token
                    image: "https://5.imimg.com/data5/VM/XJ/HU/SELLER-3837880/nickel-alloy-nuts-bolts-500x500.jpg", // A string url of the token logo
                },
            },
        });
    }
}

const instance = new dApp()
window.dapp = instance
export default instance
