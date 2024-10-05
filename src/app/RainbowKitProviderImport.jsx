"use client";
import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
// import { hardhat } from "wagmi/chains";
import { verax } from '../utils/verax' //sepolia
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const customTheme = {
  colors: {
    accentColor: '#3b5998', // Couleur du bouton
    accentColorForeground: '#ffffff', // Couleur du texte du bouton (facultatif)
    modalBackground: '#ffffff', // Fond de la modal
  },
  radii: {
    actionButton: '0.40rem', // Utilisez le radius de base
    connectButton: '0.40rem', // Utilisez le radius de base
    menuButton: '0.40rem', // Utilisez le radius de base
    modal: '0.40rem', // Utilisez le radius de base
    modalMobile: '0.40rem', // Utilisez le radius de base
  },
};

const WALLET_CONNECT_ID = process.env.WALLET_CONNECT_ID || "0b279589361da3acac9869044458d1c7";
console.log("WALLET_CONNECT_ID", WALLET_CONNECT_ID)
const config = getDefaultConfig({
  appName: "Verax",
  projectId: WALLET_CONNECT_ID,
  // chains: [hardhat],
  chains: [verax], //sepolia
  theme: customTheme,
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

const RainbowKitProviderImport = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={customTheme}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default RainbowKitProviderImport;