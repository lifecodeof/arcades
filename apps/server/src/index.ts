import express from 'express'
import { Deta } from "deta"
import { ethers } from "ethers"
import { json } from 'body-parser'
import { processImage } from './img'
import cors from "cors"
import { Metadata, randomAttributes } from './meta'
import { arcades } from './ethers'

const deta = Deta("a0s0s5hs_nkrFgFqivrcYthYvJAysjwF48JgexGCf") // cspell:disable-line
const db = deta.Base("nfts")
const drive = deta.Drive("nfts")

const app = express()
app.use(json())
app.use(cors({ origin:true }))

app.post("/submit", async (req, res) => {
    const { name, signature, id } = req.body
    if (await db.get(id) != null) return res.status(400).send(`#${id} is already submitted`)
    if (typeof name != "string") return res.status(400).send("name must be string")
    if (name.length != 3) return res.status(400).send("name length must be 3")

    const address = ethers.utils.verifyMessage(`I am the owner of #${id} ARC`, signature)

    const ownerAddress = await arcades.ownerOf(id).catch(() => "err")
    if (ownerAddress != address) return res.status(400).send(`You are not own #${id} ARC`)

    const p1 = processImage(name).then(image => 
        drive.put(id + ".png", { data: image, contentType: "image/png" })
    )

    const p2 = db.put(randomAttributes({
        name, image: `https://${req.hostname}/images/${id}.png`, description: "", external_url: ""
    }) as any, id)

    try {
        await Promise.all([p1, p2])
        return res.sendStatus(201)
    } catch (error) {
        console.error(error)
        return res.sendStatus(500)
    }
})

app.get('/assets/:id', async (req, res) => {
    let data: Metadata = (<unknown>await db.get(req.params.id)) as Metadata
    if (!data) data = {
        name: "clean arcade", description: "", external_url: "",
        image: `https://${req.hostname}/images/clean.png`, attributes: []
    }
    res.json(data)
})

app.get('/images/:id', async (req, res) => {
    try {
        const image = await new Promise<Buffer>(async (resolve, reject) => {
            const chunks: Buffer[] = []
            const blob = await drive.get(req.params.id)
            if (blob == null) return reject()
            const stream = blob.stream()
            stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
            stream.on('error', (err) => reject(err));
            stream.on('end', () => resolve(Buffer.concat(chunks)));
        })
        res.status(200).type("image/png").send(image)
    } catch (error) {
        res.sendStatus(404)
    }
})

export default app
