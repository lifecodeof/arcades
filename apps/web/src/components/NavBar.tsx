import { Container, Toolbar, Typography, Box, Button, AppBar, Divider } from "@mui/material";
import { FC, useState } from "react";
import dapp from "../dapp";

const getURI = (i: string) => location.protocol + location.host + i

const actions = [
    {
        text: "add Arcades to wallet",
        onClick: () => dapp.registerToken(dapp.arcades, "ARC", true, getURI("/images/Arcades.png"))
    },
    {
        text: "add SCRAP to wallet",
        onClick: () => dapp.registerToken(dapp.scrapToken, "SCRAP", false, getURI("/images/Scrap.png"))
    }
]


const NavBar: FC = () => {
    const buttonStyle = { my: 2, color: 'white', display: 'block', ml: 2 }
    const [connecting, setConnecting] = useState(false)
    const getActions = () => actions.map(action => <Button
        key={action.text}
        onClick={action.onClick}
        sx={buttonStyle}>
        {action.text}</Button>
    )

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
                    >Arcades</Typography>
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {connecting ? <Button disabled={true} sx={buttonStyle}>Connecting...</Button> :
                            (dapp.walletConnected ? getActions() :
                                <Button onClick={() => {
                                    setConnecting(true)
                                    dapp.connectWallet().then(() => setConnecting(false));
                                }} sx={buttonStyle}>
                                    connect wallet (BSC testnet)
                                </Button>
                            )}
                    </Box>
                    <Typography fontStyle="italic" fontWeight="lighter">
                        Arcades are special NFT's that you name and it can be recycled to turn into SCRAP tokens.
                    </Typography>
                </Toolbar>
            </Container>
        </AppBar>
    )
};

export default NavBar
