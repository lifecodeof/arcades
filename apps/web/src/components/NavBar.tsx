import { Container, Toolbar, Typography, Box, Button, AppBar } from "@mui/material";
import { FC } from "react";
import dapp from "../dapp";

const actions = [
    {
        text: "add SCRAP to wallet",
        onClick: () => dapp.registerToken(dapp.scrapToken, "SCRAP", false)
    },
    {
        text: "add Arcades to wallet",
        onClick: () => dapp.registerToken(dapp.arcades, "ARC", true)
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
                    >👾</Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {actions.map((action) => (
                            <Button
                                key={action.text}
                                onClick={action.onClick}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {action.text}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
};

export default NavBar
