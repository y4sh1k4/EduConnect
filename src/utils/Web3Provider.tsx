import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider } from "connectkit";

const config = createConfig({
    chains: [sepolia],
    transports: {
      [sepolia.id]:http()
    },// your app's icon, no bigger than 1024x1024px (max. 1MB)
  })

const queryClient = new QueryClient();

export const Web3Provider = ({ children }:{children:React.ReactNode}) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};