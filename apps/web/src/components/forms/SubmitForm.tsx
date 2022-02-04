import { Grid, TextField, Button, Autocomplete } from "@mui/material";
import axios from "axios";
import { ChangeEvent, FC, useState } from "react";
import dapp from "../../dapp";
import NameInput from "../NameInput";
import BaseForm from "./BaseForm";

export const submit = async (id: string, name: string) => {
    try {
        const signature = await dapp.signer?.signMessage(`I am the owner of #${id} ARC`)
        await axios.post(dapp.assetBase + "submit", { name, signature, id })
    } catch (error) {
        dapp.error.emit(error)
    }
}

const SubmitForm: FC<{ ids: number[], onSubmit: Function }> = ({ ids, onSubmit }) => {
    const [id, setId] = useState("")
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (setter: Function) => (e: ChangeEvent<HTMLInputElement>) => setter(e.target.value)
    const handleSubmit = () => {
        setLoading(true)
        submit(id || "?", name)
            .then(() => setLoading(false))
            .then(() => onSubmit())
    }

    return (
        <BaseForm>
            <Grid item>
                <Autocomplete
                    disablePortal freeSolo
                    options={ids.map(i => i.toString())}
                    sx={{ width: 100 }}
                    inputValue={id}
                    onInputChange={(_event, newInputValue) => {
                        setId(newInputValue);
                    }}
                    renderInput={(params) => <TextField {...params} variant="outlined" label="id" />}
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
                <NameInput value={name} onChange={handleChange(setName)} />
            </Grid>
            <Grid item>
                <Button variant="contained" size="large" onClick={handleSubmit}
                    disabled={loading || id == "" || name == ""} >Submit{loading ? "ting" : ""}</Button> {/* cspell:disable-line */}
            </Grid>
        </BaseForm>
    )
}

export default SubmitForm