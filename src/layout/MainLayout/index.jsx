import { Outlet } from 'react-router-dom'

// material-ui
import { styled, useTheme } from '@mui/material/styles'
import { AppBar, Box, CssBaseline, Toolbar } from '@mui/material'

// project imports
import Header from './Header'
import { headerHeight } from '@/store/constant'

// styles
const Main = styled('main')(({ theme }) => ({
    ...theme.typography.mainContent,
    backgroundColor: 'transparent',
    width: '100%',
    minHeight: `calc(100vh - ${headerHeight}px)`,
    flexGrow: 1,
    padding: '20px',
    marginTop: `${headerHeight}px`,
    [theme.breakpoints.down('md')]: {
        padding: '16px'
    },
    [theme.breakpoints.down('sm')]: {
        padding: '10px'
    }
}))

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
    const theme = useTheme()

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <CssBaseline />
            {/* header */}
            <AppBar
                enableColorOnDark
                position='fixed'
                color='inherit'
                elevation={0}
                sx={{
                    bgcolor: theme.palette.background.default,
                    borderBottom: '1px solid',
                    borderColor: theme.palette.divider
                }}
            >
                <Toolbar 
                    sx={{ 
                        minHeight: `${headerHeight}px !important`,
                        height: `${headerHeight}px`,
                        px: { xs: 2, sm: 3, md: 4 }
                    }}
                >
                    <Header />
                </Toolbar>
            </AppBar>

            {/* main content */}
            <Main theme={theme}>
                <Outlet />
            </Main>
        </Box>
    )
}

export default MainLayout
