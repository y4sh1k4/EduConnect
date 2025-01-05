// context/PushProtocolContext.tsx
import { createContext, useEffect, useState, useRef } from 'react';
import { PushAPI, CONSTANTS, MessageWithCID } from '@pushprotocol/restapi';
import { useAccount, useWalletClient } from 'wagmi';

interface PushContextType {
  pushUser: PushAPI | null;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  sendChatRequest: (receiverAddress: string) => Promise<MessageWithCID>;
  acceptChatRequest: (senderAddress: string) => Promise<void>;
  rejectChatRequest: (senderAddress: string) => Promise<void>;
}

export const PushProtocolContext = createContext<PushContextType | null>(null);

const PUSH_INITIALIZED_KEY = 'push_initialized';

export const PushProtocolProvider = ({ children }: { children: React.ReactNode }) => {
  const [pushUser, setPushUser] = useState<PushAPI | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const initializationRef = useRef(false);

  useEffect(() => {
    const initializePush = async () => {
      // Check if already initialized for this session and address
      const storedInitialized = localStorage.getItem(PUSH_INITIALIZED_KEY);
      const storedAddress = localStorage.getItem('push_user_address');
      
      if (
        !address || 
        !walletClient || 
        !isConnected || 
        initializationRef.current ||
        (storedInitialized === 'true' && storedAddress === address)
      ) {
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        initializationRef.current = true;

        const user = await PushAPI.initialize(walletClient, { 
          env: CONSTANTS.ENV.STAGING,
          account: address
        });

        setPushUser(user);
        setIsInitialized(true);
        localStorage.setItem(PUSH_INITIALIZED_KEY, 'true');
        localStorage.setItem('push_user_address', address);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize Push Protocol');
        console.error("Error initializing Push Protocol:", err);
        initializationRef.current = false;
      } finally {
        setIsLoading(false);
      }
    };

    initializePush();
  }, [address, walletClient, isConnected]);

  // Clear initialization state when wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      localStorage.removeItem(PUSH_INITIALIZED_KEY);
      localStorage.removeItem('push_user_address');
      setPushUser(null);
      setIsInitialized(false);
      initializationRef.current = false;
    }
  }, [isConnected]);

  // Rest of your methods remain the same
  const sendChatRequest = async (receiverAddress: string):Promise<MessageWithCID> => {
    if (!pushUser) throw new Error('Push Protocol not initialized');
    setIsLoading(true);
    try {
      const chatResult = await pushUser.chat.send(receiverAddress, {
        content: "Hey! Let's connect and chat!",
        type: 'Text'
      });
      return chatResult;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send chat request');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const acceptChatRequest = async (senderAddress: string) => {
    if (!pushUser) throw new Error('Push Protocol not initialized');
    try {
      await pushUser.chat.accept(senderAddress);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept chat request');
      throw err;
    }
  };

  const rejectChatRequest = async (senderAddress: string) => {
    if (!pushUser) throw new Error('Push Protocol not initialized');
    try {
      await pushUser.chat.reject(senderAddress);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject chat request');
      throw err;
    }
  };


  return (
    <PushProtocolContext.Provider 
      value={{ 
        pushUser,
        isInitialized,
        isLoading,
        error,
        sendChatRequest,
        acceptChatRequest,
        rejectChatRequest,
      }}
    >
      {children}
    </PushProtocolContext.Provider>
  );
};

