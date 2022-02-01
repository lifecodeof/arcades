import { readFileSync } from 'fs'
import { Arcades } from '../typechain/Arcades'
import { join } from 'path'
import { ethers } from "ethers"

const readJson = (...paths: string[]) => JSON.parse(readFileSync(join(__dirname, ...paths)).toString())
const ARC = readJson("..", "artifacts", "Arcades.json")
const addresses = readJson("..", "artifacts", "contract-addresses.json")

const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545")
export const arcades = new ethers.Contract(addresses.arcades, ARC.abi, provider) as Arcades
