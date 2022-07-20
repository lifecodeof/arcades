import { FC, useEffect, useState } from "react"
import { Paper, Typography, Link } from "@mui/material"
import dapp from "../dapp"

const scanUrl = "https://testnet.bscscan.com/address/"

const AddressInfoCard: FC = () => {
    return (
        <Paper variant="outlined" sx={{p:"16px"}}>
            <Typography variant="h5" component="div" color="text.secondary">
                Contract addresses
            </Typography>
            <Typography variant="body2">Arcades (ARC): <Link target="_blank" rel="noopener" href={scanUrl + dapp.arcades.address}>{dapp.arcades.address}</Link></Typography>
            <Typography variant="body2">Scrap Token (SCRAP): <Link target="_blank" rel="noopener" href={scanUrl + dapp.scrapToken.address}>{dapp.scrapToken.address}</Link></Typography>
        </Paper>
    )
}

export default AddressInfoCard
