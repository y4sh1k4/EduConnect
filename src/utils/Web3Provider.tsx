"use client"
import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { ReactNode } from "react";
import { defineChain } from 'viem'

const openCampus = defineChain({
  id: 656476, // Correct chain ID for Open Campus Codex Sepolia
  network: 'open-campus-codex-sepolia',
  name: 'Open Campus Codex Sepolia',
  nativeCurrency: { 
    name: 'Open Campus Codex Sepolia', 
    symbol: 'OP', 
    decimals: 18
  },
  rpcUrls: {
    default: { 
      http: ['https://lb.drpc.org/ogrpc?network=open-campus-codex-sepolia&dkey=AvdUpBeMqkYSjPsYOd4pkGLjqR4BynsR77KAIlZWwHzR'] 
    },
    public: {
      http: ['https://lb.drpc.org/ogrpc?network=open-campus-codex-sepolia&dkey=AvdUpBeMqkYSjPsYOd4pkGLjqR4BynsR77KAIlZWwHzR']
    }
  },
  blockExplorers: {
    default: {
      name: 'Open Campus Explorer',
      url: 'https://explorer.open-campus-testnet.xyz'
    }
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 0
    }
  },
  testnet: true
});

const config = createConfig(
  getDefaultConfig({
    chains: [openCampus],
    transports: {
      [openCampus.id]: http('https://lb.drpc.org/ogrpc?network=open-campus-codex-sepolia&dkey=AvdUpBeMqkYSjPsYOd4pkGLjqR4BynsR77KAIlZWwHzR')
    },
    walletConnectProjectId: '6f874c8f7977f91d15dc079c51a4fe87',
    appName: "EduConnect",
    appDescription: "Your App Description",
    appUrl: "https://family.co",
    appIcon: "https://family.co/logo.png",
  }),
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }:{children:ReactNode}) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};