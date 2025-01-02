import React, { useState, useEffect } from 'react';
import { Client, type Conversation, DecodedMessage } from "@xmtp/xmtp-js";
import { useAccount } from 'wagmi';

interface Message extends DecodedMessage {
  content: string;
  senderAddress: string;
}

interface ConversationMap {
  [address: string]: Conversation;
}

interface MessageMap {
  [address: string]: Message[];
}

const ChatPage: React.FC = () => {
  const [client, setClient] = useState<Client | null>(null);
  const [conversations, setConversations] = useState<ConversationMap>({});
  const [messages, setMessages] = useState<MessageMap>({});
  const [newMessage, setNewMessage] = useState<string>('');
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isXmtpEnabled, setIsXmtpEnabled] = useState<boolean>(false);

  const addresses: string[] = [
    '0xbBe46d87139BaFF33854E0dFd0dc73bE7dF9CE35',
  ];

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      await initializeClient();
    } else {
      setLoading(false);
    }
  };

  const checkXmtpEnabled = async (address: string): Promise<void> => {
    try {
      if (!client) return;
      const isEnabled = await client.canMessage(address);
      setIsXmtpEnabled(isEnabled);
      console.log('XMTP enabled:', isEnabled);
    } catch (error) {
      console.error('Error checking XMTP status:', error);
    }
  };
  const {address}= useAccount()
  const initializeClient = async (): Promise<void> => {
    try {
      setLoading(true);
      
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      const userAddress = address ? address :'';

      const signer = {
        getAddress: async (): Promise<any> => {
          return userAddress;
        },
        signMessage: async (message: string): Promise<string> => {
          return await window.ethereum.request({
            method: 'personal_sign',
            params: [message, userAddress]
          });
        },
      };

      const xmtpClient = await Client.create(signer, { env: 'production' });
      setClient(xmtpClient);
      
      await checkXmtpEnabled(userAddress);
      
      if (isXmtpEnabled) {
        await initializeConversations(xmtpClient);
      }
    } catch (error) {
      console.error('Failed to initialize XMTP client:', error);
      alert('Failed to initialize chat. Please make sure MetaMask is connected.');
    } finally {
      setLoading(false);
    }
  };

  const enableXmtp = async (): Promise<void> => {
    try {
      setLoading(true);
      
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      const userAddress = accounts[0];

      const signer = {
        getAddress: async (): Promise<string> => {
          return userAddress;
        },
        signMessage: async (message: string): Promise<string> => {
          return await window.ethereum.request({
            method: 'personal_sign',
            params: [message, userAddress]
          });
        },
      };

      const xmtpClient = await Client.create(signer, { env: 'production' });
      setClient(xmtpClient);
      setIsXmtpEnabled(true);
      
      await initializeConversations(xmtpClient);
      
      alert('XMTP has been enabled for your address!');
    } catch (error) {
      console.error('Failed to enable XMTP:', error);
      alert('Failed to enable XMTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const initializeConversations = async (xmtpClient: Client): Promise<void> => {
    try {
      const convs: ConversationMap = {};
      const msgs: MessageMap = {};

      for (const address of addresses) {
        try {
          const canMessage = await xmtpClient.canMessage(address);
          if (!canMessage) {
            console.warn(`Address ${address} is not XMTP-enabled`);
            msgs[address] = [{
              content: "This address hasn't enabled XMTP messaging yet. They need to initialize XMTP before you can message them.",
              senderAddress: 'system',
              sent: new Date()
            } as Message];
            continue;
          }

          const conversation = await xmtpClient.conversations.newConversation(address);
          convs[address] = conversation;
          
          const existingMessages = await conversation.messages();
          msgs[address] = existingMessages as Message[];

          const stream = await conversation.streamMessages();
          (async () => {
            for await (const msg of stream) {
              setMessages(prev => ({
                ...prev,
                [address]: [...(prev[address] || []), msg as Message]
              }));
            }
          })();
        } catch (convError) {
          console.error(`Failed to initialize conversation with ${address}:`, convError);
        }
      }

      setConversations(convs);
      setMessages(msgs);
    } catch (error) {
      console.error('Failed to initialize conversations:', error);
    }
  };

  const sendMessage = async (): Promise<void> => {
    if (!selectedAddress || !newMessage.trim() || !client) {
      console.warn('Missing required data for sending message');
      return;
    }

    try {
      let conversation = conversations[selectedAddress];
      
      if (!conversation) {
        const canMessage = await client.canMessage(selectedAddress);
        if (!canMessage) {
          throw new Error(`Cannot message address ${selectedAddress}`);
        }
        
        conversation = await client.conversations.newConversation(selectedAddress);
        setConversations(prev => ({
          ...prev,
          [selectedAddress]: conversation
        }));
      }

      const sent = await conversation.send(newMessage);
      
      setMessages(prev => ({
        ...prev,
        [selectedAddress]: [...(prev[selectedAddress] || []), sent as Message]
      }));

      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen max-h-[600px] bg-white rounded-lg shadow-lg">
      {!client ? (
        <div className="w-full flex items-center justify-center">
          <div className="text-center p-6">
            <h2 className="text-2xl font-bold mb-4">Welcome to XMTP Chat</h2>
            <button
              onClick={initializeClient}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 mb-4"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      ) : !isXmtpEnabled ? (
        <div className="w-full flex items-center justify-center">
          <div className="text-center p-6">
            <h2 className="text-2xl font-bold mb-4">Enable XMTP</h2>
            <p className="text-gray-600 mb-4">
              You need to enable XMTP to start messaging. This is a one-time setup.
            </p>
            <button
              onClick={enableXmtp}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
            >
              Enable XMTP
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="w-1/4 border-r border-gray-200 p-4">
            {addresses.map((address: string) => (
              <button
                key={address}
                className={`w-full text-left px-4 py-2 rounded mb-2 ${
                  selectedAddress === address 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => setSelectedAddress(address)}
              >
                {`${address.slice(0, 6)}...${address.slice(-4)}`}
              </button>
            ))}
          </div>
          
          <div className="flex-1 flex flex-col">
            {selectedAddress ? (
              <>
                <div className="flex-1 p-4 overflow-y-auto">
                  {messages[selectedAddress]?.map((msg: Message, idx: number) => (
                    <div 
                      key={idx} 
                      className={`mb-4 ${
                        msg.senderAddress === 'system'
                          ? 'mx-auto'
                          : msg.senderAddress === client?.address
                          ? 'ml-auto'
                          : 'mr-auto'
                      }`}
                    >
                      <div className={`rounded-lg p-3 max-w-[80%] ${
                        msg.senderAddress === 'system'
                          ? 'bg-yellow-100 text-yellow-800 text-center'
                          : msg.senderAddress === client?.address
                          ? 'bg-blue-500 text-white ml-auto'
                          : 'bg-gray-100'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-200 flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      messages[selectedAddress]?.[0]?.senderAddress === 'system'
                        ? "Can't send messages to this address yet"
                        : "Type a message..."
                    }
                    disabled={messages[selectedAddress]?.[0]?.senderAddress === 'system'}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-black disabled:bg-gray-100 disabled:text-gray-500"
                  />
                  <button 
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || messages[selectedAddress]?.[0]?.senderAddress === 'system'}
                    className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPage;