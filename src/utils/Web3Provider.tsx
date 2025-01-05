"use client"
import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider} from "connectkit";
import { ReactNode } from "react";
import { defineChain } from 'viem'

const openCampus = defineChain({
  id: 656476, // Correct chain ID for Open Campus Codex Sepolia
  network: 'open-campus-codex-sepolia',
  name: 'Open Campus Codex Sepolia',
  nativeCurrency: { 
    name: 'Open Campus Codex Sepolia', 
    symbol: 'EDU', 
    decimals: 18
  },
  rpcUrls: {
    default: { 
      http: ['https://open-campus-codex-sepolia.drpc.org'] 
    },
    public: {
      http: ['https://open-campus-codex-sepolia.drpc.org']
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
  {
    chains: [openCampus],
    transports: {
      [openCampus.id]: http('https://open-campus-codex-sepolia.drpc.org')
    }
  },
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