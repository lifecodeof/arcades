import { Button, Grid, Paper, TextField } from '@mui/material';
import { BigNumber, ethers } from 'ethers';
import { ChangeEvent, FC, useState } from 'react'
import dapp from "../../dapp";
import NameInput from '../NameInput';
import { submit } from './SubmitForm';
import BaseForm from './BaseForm';

const mint = async (to: string, name: string, onMint: Function) => {
    try {
        const tx = await (await dapp.arcades.mint(to, { value: ethers.utils.parseEther("0.005") })).wait()
        const tokenId: BigNumber = tx.events?.find(e => e.event == "Transfer")?.args?.tokenId
        const id = tokenId.toString()
        onMint()
        await submit(id, name)
    } catch (error) {
        dapp.error.emit(error)
    }
}

const MintForm: FC<{ onSubmit: Function }> = ({ onSubmit }) => {
    const [mintTo, setMintTo] = useState("")
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [btnText, setBtnText] = useState("Mint")

    const handleChange = (setter: Function) => (e: ChangeEvent<HTMLInputElement>) => setter(e.target.value)
    const handleSubmit = () => {
        setLoading(true)
        setBtnText("Minting")
        mint(mintTo, name, () => setBtnText("Scribing"))
            .then(() => onSubmit())
            .then(() => setBtnText("Mint"))
            .then(() => setLoading(false))
    }

    return (
            <BaseForm>
                <Grid item>
                    <TextField variant="outlined" label="address" value={mintTo} onChange={handleChange(setMintTo)} />
                </Grid>
                <Grid item>
                    <NameInput value={name} onChange={handleChange(setName)} />
                </Grid>
                <Grid item>
                    <Button variant="contained" size="large" onClick={handleSubmit}
                        disabled={loading || mintTo == "" || name == ""} >{btnText}</Button>
                </Grid>
            </BaseForm>
    )



    // <form>
    //     <fieldset>
    //         <label htmlFor="to">To</label>
    //         <input type="text" placeholder="address" id="to" onChange={handleChange(setMintTo)} />
    //         <label htmlFor="name">Name</label>
    //         <input type="text" placeholder="name" id="name" onChange={handleChange(setName)} />
    //         <input className="button-primary" type="submit" value="Mint" onClick={handleSubmit} />
    //     </fieldset>
    // </form>

}

export default MintForm
