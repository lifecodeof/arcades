import { FormControl, TextField } from "@mui/material"
import { FC, useState } from "react"

const NameInput: FC<{
    onChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>,
    value: unknown
}> = ({ onChange, value }) => {
    const [error, setError] = useState(false)

    const handleChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = e => {
        if (!(e.target.value.length == 3 || e.target.value.length == 0)) setError(true)
        else setError(false)
        e.target.value = e.target.value.toUpperCase()
        onChange(e)
    }

    return (
        <TextField
            id="name-input"
            label="name"
            value={value}
            onChange={handleChange}
            aria-describedby="name-input-text"
            error={error}
            { ...(error ? {helperText:"must be 3 chars"} : {})}
        />
    )
}

export default NameInput