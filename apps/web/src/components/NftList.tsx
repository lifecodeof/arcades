import { Card, CardContent, CardMedia, Chip, Grid, Link, Typography } from "@mui/material"
import { FC } from "react"
import { Nft } from "../meta"

const NftList: FC<{ nfts: Nft[] }> = ({ nfts }) => {
    const nftCards = nfts.map(nft => {
        const altName = `#${nft.id} ${nft.meta.name}`
        return <Grid item key={nft.id}>
            <Card>
                <CardMedia component="img" image={nft.meta.image} sx={{ width: "32rem" }} alt={altName} />
                <CardContent>
                    <Typography gutterBottom variant="h5">
                        {nft.meta.name}
                        <Chip label={`#${nft.id}`} sx={{ float: "right" }} />
                    </Typography>
                    <Typography>owner:&nbsp;
                        <Link href={`https://testnet.bscscan.com/address/${nft.owner}`}
                            underline="hover" target="_blank" rel="noopener">{nft.owner}</Link>
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    }
    )

    return (
        <Grid container sx={{ mt: 4, justifyContent: "space-evenly" }}>
            {nftCards}
        </Grid>
    )
}

export default NftList
