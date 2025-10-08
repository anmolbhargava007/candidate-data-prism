// import logo from '@/assets/images/builderai_logo.svg'
import logoDark from '@/assets/images/builderai_logo_dark.svg'
import logo from '@/assets/images/logo2.png'

import { useSelector } from 'react-redux'

// ==============================|| LOGO ||============================== //

const Logo = () => {
    const customization = useSelector((state) => state.customization)

    return (
        <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'row' }}>
            <img
                style={{ objectFit: 'contain', height: 'auto', width: 200 }}
                src={customization.isDarkMode ? logo : logoDark}
                alt='NuAgentOne Logo'
            />
        </div>
    )
}

export default Logo
