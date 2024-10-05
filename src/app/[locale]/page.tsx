"use client";

import { useTranslations } from 'next-intl'
import Button from './components/Button'
import { ConnectButton } from '@rainbow-me/rainbowkit'


import OwnerComponent from "./components/Owner";
import UserComponent from "./components/User";

import { contractAddress, contractAbi } from "../../constants";
import { useOwnerContext } from "../../context/owner";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const {
    owner,
    ownerLoading,
    refetchOwner,
    ownerPending,
    contractOwner,
    setOwner,
  } = useOwnerContext();

  const {
    data: isAcompagnyOwner,
    error: errorisAcompagnyOwner,
    isPending: isPendingIsAcompagnyOwner,
    refetch: refetchIsAcompagnyOwner,
  } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "isAcompagnyOwner",
    account: address,
  });

  const {
    data: isAcustomer,
    error: errorIsAcustomer,
    isPending: isPendingIsAcustomer,
    refetch: refetchIsAcustomer,
  } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "isAcustomer",
    account: address,
  });

  console.log("contractOwner ", contractOwner)
  const t = useTranslations('')
  return (
    <div>
      {
        address ? (<>{address === contractOwner ? <OwnerComponent /> : <UserComponent isAcustomer={isAcustomer} isAcompagnyOwner={isAcompagnyOwner}/>}</>) : 
        (
          <>
            <section className='flex flex-col items-center justify-center py-24'>
        <h1 className='text-center text-7xl font-extrabold leading-tight'>
          {t('An')}{' '}
          <span className='bg-span-bg bg-clip-text text-transparent'>
            {t('Booster')}
          </span>
          <br />
          {t('to_Your_NextJS_Apps')}
        </h1>
        <div className='my-6 px-20 text-center text-2xl text-text-secondary'>
          {t(
            'An_approachable_performant_and_versatile_boilerplate_for_building_SSR_applications'
          )}
        </div>
        <div className='mt-4 flex flex-row gap-4'>
          <ConnectButton showBalance={true}/>
        </div>
            </section>
            <section className='bg-background-secondary py-20 max-lg:py-10'>
              <div className='mx-auto grid max-w-screen-lg grid-cols-3 gap-7 px-8 py-5 max-lg:max-w-fit max-lg:grid-cols-1 max-lg:gap-10'>
                <div className='text-center'>
                  <h2 className='mb-3  text-xl font-semibold'>{t('Approachable')}</h2>
                  <p className='text-text-secondary max-lg:max-w-[500px]'>
                    {t(
                      'Add_components_without_sending_additional_client_side_JavaScript_Built_on_the_latest_React_features'
                    )}
                  </p>
                </div>
                <div className='text-center'>
                  <h2 className='mb-3 text-xl font-semibold'>{t('Versatile')}</h2>
                  <p className='text-text-secondary max-lg:max-w-[500px]'>
                    {t(
                      'Automatic_Image_Font_and_Script_Optimizations_for_improved_UX_and_Core_Web_Vitals'
                    )}
                  </p>
                </div>
                <div className='text-center'>
                  <h2 className='mb-3 text-xl font-semibold'>{t('Performant')}</h2>
                  <p className='text-text-secondary max-lg:max-w-[500px]'>
                    {t(
                      'A_rich_incredibly_adoptable_template_that_scales_between_a_small_showcase_website_and_a_full_size_app'
                    )}
                  </p>
                </div>
              </div>
            </section>
          </>
        )
      }
    </div>
  )
}
