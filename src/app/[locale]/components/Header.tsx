'use client'
import { Link } from '@/src/navigation'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import GithubIcon from '../../icons/github'
import LogoIcon from '../../icons/logo'
import Box from "@mui/material/Box";
import LangSwitcher from './LangSwitcher'
import ThemeSwitch from './ThemeSwitch'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useEffect } from 'react';

interface Props {
  locale: string
}


export const Header: FC<Props> = ({ locale }) => {

  // useEffect(() => {
  //   // Charger dynamiquement le script côté client
  //   const script = document.createElement('script');
  //   script.src = '/web3-login.js';
  //   script.async = true;
  //   document.body.appendChild(script);

  //   return () => {
  //     // Nettoyer le script si nécessaire lors du démontage du composant
  //     document.body.removeChild(script);
  //   };
  // }, []);

  const t = useTranslations('')
  return (
    <div className='mx-auto flex max-w-screen-2xl flex-row items-center justify-between p-5'>
      <Link lang={locale} href='/'>
        <div className='flex flex-row items-center'>
          <div className='mb-2 h-14 w-14'>
          <Box sx={{ mb: 2, width: 56, height: 86 }}>
            <LogoIcon/>
            </Box>
          </div>
          <strong className='mx-2 select-none'>Verax</strong>
        </div>
      </Link>
      <div className='flex flex-row items-center gap-3'>
        <nav className='mr-10 inline-flex gap-5'>
        </nav>
          <Box sx={{ flexGrow: 0 }}>
            <ConnectButton showBalance={true}/>
          </Box>
          {/* <div id="connect">OKOKOKOKOKOKOKOKOKOKOKOKOO</div> */}
      </div>
    </div>
  )
}
