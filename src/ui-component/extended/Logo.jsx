import logo from '@/assets/images/builderai_logo.svg'
import logoDark from '@/assets/images/builderai_logo_dark.svg'

import { useSelector } from 'react-redux'

// ==============================|| LOGO ||============================== //

const Logo = () => {
    const customization = useSelector((state) => state.customization)

    return (
        <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'row', marginLeft: '10px', gap: '12px' }}>
            <img
                style={{ objectFit: 'contain', height: 'auto', width: 40 }}
                src={customization.isDarkMode ? logo : logoDark}
                alt='BuilderAI'
            />
            <span style={{ 
                fontSize: '24px', 
                fontWeight: '600', 
                color: customization.isDarkMode ? '#00ff88' : '#0a0a0a',
                fontFamily: 'Poppins, sans-serif',
                letterSpacing: '-0.5px'
            }}>
                BuilderAI
            </span>
        </div>
    )
}

export default Logo
