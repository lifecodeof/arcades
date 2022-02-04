import { Grid, Autocomplete, TextField, Button } from "@mui/material"
import { formatEther } from "ethers/lib/utils"
import { FC, useEffect, useState } from "react"
import dapp from "../../dapp"
import BaseForm from "./BaseForm"

const recycle = async (id: string) => await (await dapp.arcades.recycle(id)).wait()

const RecycleForm: FC<{ ids: number[], onSubmit: Function }> = ({ ids, onSubmit }) => {
    const [id, setId] = useState("")
    const [loading, setLoading] = useState(false)
    const [refundAmount, setRefundAmount] = useState("?")

    useEffect(() => { dapp.arcades.refundAmount().then(formatEther).then(setRefundAmount) })

    const handleSubmit = () => {
        setLoading(true)
        recycle(id || "?")
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
            </Grid>
            <Grid item>
                <Button variant="contained" size="large" onClick={handleSubmit}
                    disabled={loading || id == ""} >
                    Recycl{loading ? "ing" : "e"} {/* cspell:disable-line */}
                    (+{refundAmount} SCRAP)
                </Button>
            </Grid>
        </BaseForm>
    )
}

export default RecycleForm
