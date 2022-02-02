import { Container, Toolbar, Typography, Box, Button, AppBar, Divider } from "@mui/material";
import { FC } from "react";
import dapp from "../dapp";

const actions = [
    {
        text: "add Arcades to wallet",
        onClick: () => dapp.registerToken(dapp.arcades, "ARC", true)
    },
    {
        text: "add SCRAP to wallet",
        onClick: () => dapp.registerToken(dapp.scrapToken, "SCRAP", false)
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
