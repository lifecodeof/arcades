import { Container, Toolbar, Typography, Box, Button, AppBar, Divider } from "@mui/material";
import { FC } from "react";
import dapp from "../dapp";
import ARC_icon from "../images/Arcade.png"
import SCRAP_icon from "../images/Scrap.png"

const getURI = (i: string) => location.protocol + location.host + i

const actions = [
    {
        text: "add Arcades to wallet",
        onClick: () => dapp.registerToken(dapp.arcades, "ARC", true, getURI(ARC_icon))
    },
    {
        text: "add SCRAP to wallet",
        onClick: () => dapp.registerToken(dapp.scrapToken, "SCRAP", false, getURI(SCRAP_icon))
    }
]

    const NavBar: FC = () => {
        return (
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
                        >👾 Arcades</Typography>
                        <Divider orientation="vertical" variant="middle" flexItem />
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {actions.map((action) => (
                                <Button
                                    key={action.text}
                                    onClick={action.onClick}
                                    sx={{ my: 2, color: 'white', display: 'block', ml: 2 }}
                                >
                                    {action.text}
                                </Button>
                            ))}
                        </Box>
                        <Typography fontStyle="italic" fontWeight="lighter">
                            Arcades are special nfts that you name. And it can be recycled to turn into scrap tokens
                        </Typography>
                    </Toolbar>
                </Container>
            </AppBar>
        )
    };

    export default NavBar
