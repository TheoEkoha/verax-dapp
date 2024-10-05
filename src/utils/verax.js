const RPC = process.env.NEXT_PUBLIC_AVALANCHE_FUJI_RPC || "http://172.210.92.252:9650/ext/bc/YLpJMdt6ujkeuYo4oCHfn511fFzqH27PatVtTSMQZx9yfh3BL/rpc"; // Remplacez par votre RPC

export const verax = {
  id: 66666, // ID de la chaîne pour Avalanche Fuji
  name: "Vierzon",
  nativeCurrency: { name: "Vierzon", symbol: "VRZN", decimals: 18 },
  rpcUrls: {
    default: {
      http: [RPC], // URL RPC
    },
  },
  blockExplorers: {
    default: {
      name: "SnowTrace",
      url: "https://cchain.explorer.avax-test.network",
      apiUrl: "https://api.snowtrace.com/api", // API pour SnowTrace
    },
  },
  contracts: {
    myContract: {
      address: "0x5DB9A7629912EBF95876228C24A848de0bfB43A9", // Votre adresse de contrat
      blockCreated: 0, // Ajustez en fonction de la création du contrat si nécessaire
    },
  },
  testnet: true, // Indique que c'est un testnet
};
