import { FC, useEffect, useState } from "react"
import { Paper, Typography } from "@mui/material"
import dapp from "../dapp"

const AddressInfoCard: FC = () => {
    return (
        <Paper variant="outlined" sx={{p:"16px"}}>
            <Typography variant="h5" component="div" color="text.secondary">
                Contract addresses
            </Typography>
            <Typography variant="body2">Arcades (ARC): {dapp.arcades.address}</Typography>
            <Typography variant="body2">Scrap Token (SCRAP): {dapp.arcades.address}</Typography>
        </Paper>
    )
}

export default AddressInfoCard