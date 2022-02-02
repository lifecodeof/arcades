import { Paper, Grid, TextField, Button, MenuItem, Select, InputLabel, FormControl,Autocomplete } from "@mui/material";
import axios from "axios";
import { ChangeEvent, FC, useState } from "react";
import dapp from "../dapp";

export const submit = async (id: string, name: string) => {
    try {
        const signature = await dapp.signer.signMessage(`I am the owner of #${id} ARC`)
        await axios.post(dapp.assetBase + "submit", { name, signature, id })
    } catch (error) {
        dapp.error.emit(error)
    }
}

const SubmitForm: FC<{ ids: number[] }> = ({ ids }) => {
    const [id, setId] = useState<number | string>()
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (setter: Function) => (e: ChangeEvent<HTMLInputElement>) => setter(e.target.value)
    const handleSubmit = () => {
        setLoading(true)
        submit(String(id) || "?", name)
            .then(() => setLoading(false))
    }

    return (
        <Paper variant="outlined" sx={{ p: 2, width: "max-content" }}>
            <Grid container spacing={5} alignItems="center">
                <Grid item>
                    <Autocomplete
                        disablePortal
                        options={ids}
                        sx={{ width: 100 }}
                        renderInput={(params) => <TextField {...params} variant="outlined" label="id" value={id} onChange={handleChange(setId)} />}
                    />
                    
                    {/* <FormControl fullWidth>
                        <InputLabel id="idLabel">id</InputLabel>
                        <Select
                            labelId="idLabel"
                            label="id"
                            value={id || ""}
                            onChange={e => setId(e.target.value)}
                        > {ids.map(id => <MenuItem key={id} value={id}>{id}</MenuItem>)}
                        </Select>
                    </FormControl> */}
                </Grid>
                <Grid item>
                    <TextField variant="outlined" label="name" value={name} onChange={handleChange(setName)} />
                </Grid>
                <Grid item>
                    <Button variant="contained" size="large" onClick={handleSubmit}
                        disabled={loading || id == undefined || name == ""} >Submit{loading ? "ting" : ""}</Button> {/* cspell:disable-line */}
                </Grid>
            </Grid>
        </Paper>
    )
}

export default SubmitForm