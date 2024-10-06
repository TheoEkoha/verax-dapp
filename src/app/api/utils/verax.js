const RPC = process.env.NEXT_PUBLIC_AVALANCHE_FUJI_RPC || "http://172.210.92.252:9650/ext/bc/YLpJMdt6ujkeuYo4oCHfn511fFzqH27PatVtTSMQZx9yfh3BL/rpc";

export const verax = {
  id: 66666,
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
      address: "0x4475A8FBeF5Cf4a92a484B6f5602A91F3abC72D8",
      blockCreated: 0,
    },
  },
  testnet: true,
};
