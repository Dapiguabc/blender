import React, { useState, useContext } from 'react'
import { Link } from 'gatsby'
import LogoIcon from '../icons/logo'
import Button from '../button'
import { checkWalletIsInstalled, getWalletInfo } from '../../untils/walletUntils' 
import { WalletContext } from '../../context/walletContext'
import { formatAccountAddress, moneyFormat } from '../../untils/commonUntils'
import NavIcon from '../icons/layout/navIcon'
import CloseCircleIcon from '../icons/closeCircleIcon'
import BN from 'bignumber.js'

export const Nav = ({ navList, className, pathname}: any) => {
    
    return (
        <nav className={className}>
        {
            navList.map((nav: any, index: number) => {
                return <li 
                        key={ index } 
                        className={ pathname === nav.value ? 'selected' : '' } >
                        {nav.name === "DOCUMENTATION" ? <a href='https://docs.lamden.io' target='_blank'>{nav.name}</a> : <Link to={nav.value}>{nav.name}</Link>}
                    </li>
            })
        }
        </nav>
    )
}

const Header = ({ navList, pathname }: any) => {
    const { wallet, setWallet, balance } = useContext(WalletContext)
    const [showMenu, setShowMenu] = useState(false)

    const handleClick = async () => {
        if (wallet && wallet !== '') {
            setWallet(undefined)
        } else {
            await checkWalletIsInstalled()
        }
    }

    const handleMenuClick = () => {
        setShowMenu(!showMenu)
    }

    return ( 
        <header >
            <div className='header-title'><LogoIcon /><span>Blender</span></div>
            <div className='menu-btn' onClick={handleMenuClick}>{showMenu ? <CloseCircleIcon width='32px' height='32px' color='#efefef' /> : <NavIcon />}</div>
            <Nav pathname={pathname} className={showMenu ? "show" : null} navList={navList} />
            <div className='wallet-btn'>
                <Button className='primary' onClick={handleClick}>{wallet ? 'Disconnect Wallet' : 'Conenct Wallet'}</Button>
                { wallet ? 
                    <div className='wallet-info'><a className='link' href='' target='_blank'>{formatAccountAddress(wallet)}</a>{' | '}{`${moneyFormat(new BN(balance).toFixed(4))} TAU`}</div>
                    :
                    undefined
                }
            </div>
        </header>
    )
}

export default Header