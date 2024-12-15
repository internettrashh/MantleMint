// src/utils/mantle.ts
import { defineChain } from "@thirdweb-dev/chains";

export const mantleTestnet = defineChain({
  id: 5001,
  name: "Mantle Testnet",
  network: "mantle-testnet",
  nativeCurrency: {
    name: "BIT",
    symbol: "BIT",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.mantle.xyz"],
    },
    public: {
      http: ["https://rpc.testnet.mantle.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "Mantle Explorer",
      url: "https://explorer.testnet.mantle.xyz",
    },
  },
  testnet: true,
});

export const mantleMainnet = defineChain({
  id: 5000,
  name: "Mantle",
  network: "mantle",
  nativeCurrency: {
    name: "BIT",
    symbol: "BIT",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.mantle.xyz"],
    },
    public: {
      http: ["https://rpc.mantle.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "Mantle Explorer",
      url: "https://explorer.mantle.xyz",
    },
  },
  testnet: false,
});