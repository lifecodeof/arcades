import { Card, CardContent, CardMedia, Chip, Grid, Link, Typography } from "@mui/material"
import axios from "axios"
import { FC, useState } from "react"
import dapp from "../dapp"
import { Nft } from "meta"

const NftList: FC<{ nfts: Nft[] }> = ({ nfts }) => {
    const nftCards = nfts.map(nft => <Grid item key={nft.id}>
        <Card>
            <CardMedia component="img" image={nft.meta.image} sx={{ width: "32rem" }} />
            <CardContent>
                <Typography gutterBottom variant="h5">
                    {nft.meta.name} &#35;{nft.id}
                </Typography>
                <Typography>owner:&nbsp;
                    <Link href={`https://testnet.bscscan.com/address/${nft.owner}`}
                        underline="hover" target="_blank" rel="noopener">{nft.owner}</Link>
                </Typography>
            </CardContent>
        </Card>
    </Grid>
    )

    return (
        <Grid container sx={{ mt: 4, justifyContent: "space-evenly" }}>
            {nftCards}
        </Grid>
    )
}

export default NftList
