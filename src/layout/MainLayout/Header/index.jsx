import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { useNavigate, NavLink, useLocation } from 'react-router-dom'

// material-ui
import { Button, Box, Switch, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material'
import { useTheme, styled } from '@mui/material/styles'

// project imports
import LogoSection from '../LogoSection'
import ProfileSection from './ProfileSection'
import WorkspaceSwitcher from '@/layout/MainLayout/Header/WorkspaceSwitcher'
import OrgWorkspaceBreadcrumbs from '@/layout/MainLayout/Header/OrgWorkspaceBreadcrumbs'
import PricingDialog from '@/ui-component/subscription/PricingDialog'
import { menuItems } from '@/menu-items'

// assets
import { IconX, IconSparkles, IconChevronDown } from '@tabler/icons-react'

// store
import { store } from '@/store'
import { SET_DARKMODE } from '@/store/actions'
import { useConfig } from '@/store/context/ConfigContext'
import { enqueueSnackbar as enqueueSnackbarAction, closeSnackbar as closeSnackbarAction } from '@/store/actions'
import { logoutSuccess } from '@/store/reducers/authSlice'

// API
import accountApi from '@/api/account.api'

// Hooks
import useApi from '@/hooks/useApi'
import useNotifier from '@/utils/useNotifier'

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 56,
    height: 30,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(4px)',
        '&.Mui-checked': {
            color: '#149BA1',
            transform: 'translateX(20px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                    '#0a0a0a'
                )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: '#0d2f32'
            }
        }
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: '#149BA1',
        width: 28,
        height: 28,
        '&:before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                '#0a0a0a'
            )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`
        }
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#0d2f32',
        borderRadius: 20 / 2
    }
}))

const NavButton = styled(Button)(({ theme, active }) => ({
    color: active ? '#149BA1' : theme.palette.text.primary,
    fontWeight: active ? 600 : 500,
    fontSize: '0.9rem',
    padding: '8px 16px',
    borderRadius: '8px',
    textTransform: 'none',
    position: 'relative',
    transition: 'all 0.2s ease',
    fontFamily: '"Poppins", sans-serif',
    '&:hover': {
        backgroundColor: 'rgba(20, 155, 161, 0.1)',
        color: '#149BA1'
    },
    '&::after': active ? {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '70%',
        height: '2px',
        backgroundColor: '#149BA1',
        borderRadius: '2px 2px 0 0'
    } : {}
}))

const Header = () => {
    const theme = useTheme()
    const navigate = useNavigate()
    const location = useLocation()

    const customization = useSelector((state) => state.customization)
    const logoutApi = useApi(accountApi.logout)

    const [isDark, setIsDark] = useState(customization.isDarkMode)
    const dispatch = useDispatch()
    const { isEnterpriseLicensed, isCloud } = useConfig()
    const currentUser = useSelector((state) => state.auth.user)
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
    const [isPricingOpen, setIsPricingOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const [activeDropdown, setActiveDropdown] = useState(null)

    useNotifier()

    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    const changeDarkMode = () => {
        dispatch({ type: SET_DARKMODE, isDarkMode: !isDark })
        setIsDark((isDark) => !isDark)
        localStorage.setItem('isDarkMode', !isDark)
    }

    const signOutClicked = () => {
        logoutApi.request()
        enqueueSnackbar({
            message: 'Logging out...',
            options: {
                key: new Date().getTime() + Math.random(),
                variant: 'success',
                action: (key) => (
                    <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                        <IconX />
                    </Button>
                )
            }
        })
    }

    useEffect(() => {
        try {
            if (logoutApi.data && logoutApi.data.message === 'logged_out') {
                store.dispatch(logoutSuccess())
                window.location.href = logoutApi.data.redirectTo
            }
        } catch (e) {
            console.error(e)
        }
    }, [logoutApi.data])

    const handleMenuOpen = (event, groupId) => {
        setAnchorEl(event.currentTarget)
        setActiveDropdown(groupId)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
        setActiveDropdown(null)
    }

    const handleNavClick = (url) => {
        navigate(url)
        handleMenuClose()
    }

    // Get all navigation items
    const allNavItems = menuItems.items.flatMap(group => 
        group.children?.flatMap(child => child.children || []) || []
    )

    return (
        <>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
                <LogoSection />
            </Box>

            {/* Navigation Menu */}
            {isAuthenticated && (
                <Box sx={{ 
                    display: { xs: 'none', lg: 'flex' }, 
                    alignItems: 'center', 
                    gap: 0.5,
                    flexGrow: 1 
                }}>
                    {allNavItems.slice(0, 8).map((item) => (
                        <NavButton
                            key={item.id}
                            active={location.pathname === item.url ? 1 : 0}
                            onClick={() => handleNavClick(item.url)}
                            startIcon={item.icon && <item.icon size={18} />}
                        >
                            {item.title}
                        </NavButton>
                    ))}
                    
                    {allNavItems.length > 8 && (
                        <>
                            <NavButton
                                onClick={(e) => handleMenuOpen(e, 'more')}
                                endIcon={<IconChevronDown size={16} />}
                            >
                                More
                            </NavButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={activeDropdown === 'more'}
                                onClose={handleMenuClose}
                                PaperProps={{
                                    sx: {
                                        mt: 1,
                                        bgcolor: theme.palette.background.paper,
                                        border: '1px solid',
                                        borderColor: theme.palette.divider,
                                        borderRadius: '8px',
                                        minWidth: 200
                                    }
                                }}
                            >
                                {allNavItems.slice(8).map((item) => (
                                    <MenuItem
                                        key={item.id}
                                        onClick={() => handleNavClick(item.url)}
                                        sx={{
                                            py: 1.5,
                                            px: 2,
                                            color: location.pathname === item.url ? '#149BA1' : theme.palette.text.primary,
                                            fontWeight: location.pathname === item.url ? 600 : 400,
                                            '&:hover': {
                                                backgroundColor: 'rgba(20, 155, 161, 0.1)'
                                            }
                                        }}
                                    >
                                        {item.icon && (
                                            <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                                                <item.icon size={18} />
                                            </ListItemIcon>
                                        )}
                                        <ListItemText primary={item.title} />
                                    </MenuItem>
                                ))}
                            </Menu>
                        </>
                    )}
                </Box>
            )}

            <Box sx={{ flexGrow: 1 }} />
            {isEnterpriseLicensed && isAuthenticated && <WorkspaceSwitcher />}
            {isCloud && isAuthenticated && <OrgWorkspaceBreadcrumbs />}
            {isCloud && currentUser?.isOrganizationAdmin && (
                <Button
                    variant='contained'
                    sx={{
                        mr: 2,
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #149BA1 0%, #0d7076 100%)',
                        color: '#ffffff',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        px: 2.5,
                        py: 1,
                        boxShadow: '0 4px 12px rgba(20, 155, 161, 0.3)',
                        transition: 'all 0.3s ease',
                        fontFamily: '"Poppins", sans-serif',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #117a7f 0%, #0a5559 100%)',
                            boxShadow: '0 6px 16px rgba(20, 155, 161, 0.4)',
                            transform: 'translateY(-2px)'
                        }
                    }}
                    onClick={() => setIsPricingOpen(true)}
                    startIcon={<IconSparkles size={18} />}
                >
                    Upgrade
                </Button>
            )}
            {isPricingOpen && isCloud && (
                <PricingDialog
                    open={isPricingOpen}
                    onClose={(planUpdated) => {
                        setIsPricingOpen(false)
                        if (planUpdated) {
                            navigate('/')
                            navigate(0)
                        }
                    }}
                />
            )}
            <MaterialUISwitch checked={isDark} onChange={changeDarkMode} />
            <Box sx={{ ml: 2 }}>
                <ProfileSection handleLogout={signOutClicked} />
            </Box>
        </>
    )
}

export default Header
