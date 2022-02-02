import { join } from "path"
import Jimp from "jimp/es"
import Color from "color"

export const imagesDir = join(__dirname, "..", "images")

/** min and max included */
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)

export const processImage = async (
    text: string,
    bgHue: number | null = null
) => {
    if (text.length != 3) throw new Error("text length must be 3")
    const bgColor = Color.hsv(bgHue || random(0, 360), 26, 91)
    const bg = await Jimp.read(600, 600, bgColor.hex())
    const arcade = await Jimp.read(join(imagesDir, `Arcade.png`))
    const font = await Jimp.loadFont(join(imagesDir, "font", `font.fnt`))

    return await bg
        .composite(arcade, 0, 0)
        .print(font, 234, 249, text)
        .getBufferAsync(Jimp.MIME_PNG)
}
