import { Paper, Grid } from "@mui/material"
import { FC } from "react"

/** <Grid item> each child */
const BaseForm: FC = ({ children }) => {
    return (
        <Paper variant="outlined" sx={{ p: 2 }}>
            <Grid container spacing={5} alignItems="center" justifyContent="center">
                {children}
            </Grid>
        </Paper>
    )
}

export default BaseForm
