import * as React from 'react';
import { AppBar, Box, Toolbar, Container } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";



const useStyles = makeStyles((theme) => ({
    background: {
        backgroundColor: theme.palette.background.default,
        backgroundImage: 'none'
    },
    wallet: {
        // color: 'white', 
        backgroundColor: theme.palette.primary.main,
        // my: 2,
        // display: 'block'
        lineHeight: '1.2'
    },
}));



function ResponsiveAppBar() {

    const classes = useStyles();

    return (
        <AppBar position="fixed" className={classes.background}>
            <Container maxWidth="false">
                <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                    <Box
                        component="img"
                        sx={{
                            height: 100,
                            display: { xs: 'none', md: 'flex' }
                        }}
                        alt="logo"
                        src={true ? '/img/logo_dark.png' : '/img/logo_light.png'}
                    />

                    <Box
                        component="img"
                        sx={{
                            height: 100,
                            display: { xs: 'flex', md: 'none' }
                        }}
                        alt="logo"
                        src={true ? '/img/logo_dark.png' : '/img/logo_light.png'}
                    />

                    <Box sx={{ flexGrow: 0 }}>
                        <WalletMultiButton className={classes.wallet} />
                    </Box>

                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default ResponsiveAppBar;