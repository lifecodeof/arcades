import { Paper, Grid, TextField, Button } from "@mui/material";
import axios from "axios";
import { ChangeEvent, FC, useState } from "react";
import dapp from "../dapp";

export const submit = async (id: string, name: string) => {
    const signature = await dapp.signer.signMessage(`I am the owner of #${id} ARC`)
    await axios.post(dapp.assetBase + "submit", { name, signature, id })
}

const SubmitForm: FC = () => {
    const [id, setId] = useState("")
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (setter: Function) => (e: ChangeEvent<HTMLInputElement>) => setter(e.target.value)
    const handleSubmit = () => {
        setLoading(true)
        submit(id, name)
            .then(() => setLoading(false))
    }

    return (
        <Paper variant="outlined" sx={{ p: 2, width: "max-content" }}>
            <Grid container spacing={5} alignItems="center">
                <Grid item>
                    <TextField variant="outlined" label="id" value={id} onChange={handleChange(setId)} />
                </Grid>
                <Grid item>
                    <TextField variant="outlined" label="name" value={name} onChange={handleChange(setName)} />
                </Grid>
                <Grid item>
                    <Button variant="contained" size="large" onClick={handleSubmit}
                        disabled={loading || id == "" || name == ""} >Scrib{loading ? "ing" : "e"}</Button> {/* cspell:disable-line */}
                </Grid>
            </Grid>
        </Paper>
    )
}

export default SubmitForm