// "use client"
// import React, { useState, useEffect } from 'react';
// import { ethers } from 'ethers';
// import { Client } from "@xmtp/xmtp-js";
// import { useAccount } from 'wagmi';
// import { Search, Settings, Send, MessageSquare } from 'lucide-react';

// // Replace these with your actual addresses
// const PRESET_ADDRESSES = [
//   "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", // vitalik.eth
//   "0xB3f952A5b7E6D2a5b186F5A16Ff5E35C0b50251C", // Example address 2
//   "0x99999999999999999999999999999999999999999", // Example address 3
//   // Add more addresses as needed
// ];

// const Chat = () => {
//   // XMTP and Wallet state
//   const [client, setClient] = useState<Client | null>(null);
//   const [wallet, setWallet] = useState<ethers.Signer | null>(null);
//   const [isInitializingXMTP, setIsInitializingXMTP] = useState(false);

//   // Contacts and conversations state
//   const [conversations, setConversations] = useState(new Map());
//   const [availableContacts, setAvailableContacts] = useState<Array<{
//     address: string;
//     isXmtpEnabled: boolean;
//     ensName?: string;
//   }>>([]);
//   const [filteredContacts, setFilteredContacts] = useState([]);
  
//   // UI state
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   const { address: userAddress } = useAccount();

//   // Initialize wallet connection
//   const initializeWallet = async () => {
//     try {
//       if (!window.ethereum) {
//         throw new Error("Please install MetaMask!");
//       }

//       await window.ethereum.request({
//         method: 'wallet_requestPermissions',
//         params: [{ eth_accounts: {} }]
//       });

//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
//       setWallet(signer);

//     } catch (error) {
//       console.error('Error connecting wallet:', error);
//       setError(error.message);
//     }
//   };

//   // Initialize XMTP client
//   const initializeXMTP = async () => {
//     try {
//       setIsInitializingXMTP(true);
//       setError('');

//       if (!wallet) {
//         throw new Error('Please connect your wallet first');
//       }

//       const xmtp = await Client.create(wallet, { env: 'production' });
//       setClient(xmtp);

//       // Load existing conversations
//       const existingConversations = await xmtp.conversations.list();
//       const conversationsMap = new Map();
//       existingConversations.forEach(conv => {
//         conversationsMap.set(conv.peerAddress.toLowerCase(), conv);
//       });
//       setConversations(conversationsMap);

//       // Verify XMTP-enabled addresses
//       await verifyXmtpAddresses(xmtp);

//     } catch (error) {
//       console.error('Error initializing XMTP:', error);
//       setError(error.message);
//     } finally {
//       setIsInitializingXMTP(false);
//     }
//   };

//   // Verify which addresses are XMTP-enabled
//   const verifyXmtpAddresses = async (xmtpClient) => {
//     try {
//       setIsLoading(true);
//       const verifiedAddresses = [];

//       for (const address of PRESET_ADDRESSES) {
//         try {
//           const isXmtpEnabled = await xmtpClient.canMessage(address);
//           const provider = new ethers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/your-api-key');
//           const ensName = await provider.lookupAddress(address);
          
//           verifiedAddresses.push({
//             address,
//             isXmtpEnabled,
//             ensName
//           });
//         } catch (error) {
//           console.error(`Error verifying address ${address}:`, error);
//           verifiedAddresses.push({
//             address,
//             isXmtpEnabled: false
//           });
//         }
//       }

//       setAvailableContacts(verifiedAddresses);
//       setFilteredContacts(verifiedAddresses);
//     } catch (error) {
//       console.error('Error verifying addresses:', error);
//       setError('Failed to verify XMTP-enabled addresses');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle search functionality
//   const handleSearch = (query: string) => {
//     setSearchQuery(query);
//     const filtered = availableContacts.filter(contact =>
//       contact.address.toLowerCase().includes(query.toLowerCase()) ||
//       (contact.ensName && contact.ensName.toLowerCase().includes(query.toLowerCase()))
//     );
//     setFilteredContacts(filtered);
//   };

//   // Load or start a conversation
//   const selectConversation = async (address: string) => {
//     try {
//       setIsLoading(true);
//       setError('');
//       setMessages([]);

//       let conversation = conversations.get(address.toLowerCase());
      
//       if (!conversation) {
//         conversation = await client.conversations.newConversation(address);
//         setConversations(prev => new Map(prev).set(address.toLowerCase(), conversation));
//       }

//       const messages = await conversation.messages();
//       setMessages(messages);
//       setSelectedAddress(address);

//       // Start streaming messages
//       streamMessages(conversation);
//     } catch (error) {
//       console.error('Error loading conversation:', error);
//       setError('Failed to load conversation');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Stream messages for real-time updates
//   const streamMessages = async (conversation) => {
//     try {
//       const stream = await conversation.streamMessages();
//       for await (const msg of stream) {
//         setMessages(prevMessages => {
//           const msgExists = prevMessages.find(m => m.id === msg.id);
//           if (msgExists) return prevMessages;
//           return [...prevMessages, msg].sort((a, b) => a.sent.getTime() - b.sent.getTime());
//         });
//       }
//     } catch (error) {
//       console.error('Error streaming messages:', error);
//     }
//   };

//   // Send a message
//   const sendMessage = async () => {
//     if (!selectedAddress || !newMessage.trim()) return;

//     try {
//       setIsLoading(true);
//       const conversation = conversations.get(selectedAddress.toLowerCase());
//       await conversation.send(newMessage);
//       setNewMessage('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//       setError('Failed to send message');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Scroll to bottom when new messages arrive
//   useEffect(() => {
//     const messageContainer = document.getElementById('message-container');
//     if (messageContainer) {
//       messageContainer.scrollTop = messageContainer.scrollHeight;
//     }
//   }, [messages]);

//   return (
//     <div className="h-screen bg-gray-50 text-black">
//       <div className="h-full flex">
//         {/* Sidebar */}
//         <div className="w-80 bg-white text-gray-800 flex flex-col border-r border-gray-200">
//           {/* Sidebar Header */}
//           <div className="p-4 bg-white flex justify-between items-center border-b border-gray-100">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
//                 {userAddress ? userAddress.slice(0, 2) : '?'}
//               </div>
//               <div className="font-medium truncate text-gray-700">
//                 {userAddress ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : 'Not Connected'}
//               </div>
//             </div>
//             <Settings className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
//           </div>

//           {/* Search */}
//           <div className="p-4">
//             <div className="relative">
//               <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 placeholder="Search addresses"
//                 className="w-full bg-gray-50 text-gray-700 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100"
//               />
//             </div>
//           </div>

//           {/* Contacts List */}
//           <div className="flex-1 overflow-y-auto">
//             {!wallet ? (
//               <div className="p-6 text-center">
//                 <button
//                   onClick={initializeWallet}
//                   className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
//                 >
//                   Connect Wallet
//                 </button>
//               </div>
//             ) : !client ? (
//               <div className="p-6 text-center">
//                 <button
//                   onClick={initializeXMTP}
//                   className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
//                 >
//                   Initialize XMTP
//                 </button>
//               </div>
//             ) : (
//               <div className="space-y-2 p-4">
//                 {filteredContacts.map((contact) => (
//                   <button
//                     key={contact.address}
//                     onClick={() => contact.isXmtpEnabled && selectConversation(contact.address)}
//                     className={`w-full text-left p-4 rounded-lg hover:bg-gray-50 ${
//                       selectedAddress === contact.address ? 'bg-blue-50' : ''
//                     } ${!contact.isXmtpEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
//                     disabled={!contact.isXmtpEnabled}
//                   >
//                     <div className="flex items-center space-x-3">
//                       <div className={`w-12 h-12 rounded-full ${
//                         contact.isXmtpEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
//                       } flex items-center justify-center`}>
//                         {contact.address.slice(0, 2)}
//                       </div>
//                       <div>
//                         {contact.ensName && (
//                           <div className="font-medium text-gray-900">{contact.ensName}</div>
//                         )}
//                         <div className="font-medium text-gray-700">
//                           {`${contact.address.slice(0, 6)}...${contact.address.slice(-4)}`}
//                         </div>
//                         <div className={`text-sm ${
//                           contact.isXmtpEnabled ? 'text-green-600' : 'text-red-600'
//                         }`}>
//                           {contact.isXmtpEnabled ? 'XMTP Enabled' : 'Not XMTP Enabled'}
//                         </div>
//                       </div>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Main Chat Area */}
//         <div className="flex-1 flex flex-col bg-white">
//           {selectedAddress ? (
//             <>
//               {/* Chat Header */}
//               <div className="p-4 bg-white text-gray-800 flex items-center justify-between border-b border-gray-200">
//                 <div className="flex items-center space-x-3">
//                   <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
//                     {selectedAddress.slice(0, 2)}
//                   </div>
//                   <div>
//                     {availableContacts.find(c => c.address === selectedAddress)?.ensName && (
//                       <div className="font-medium text-gray-900">
//                         {availableContacts.find(c => c.address === selectedAddress)?.ensName}
//                       </div>
//                     )}
//                     <div className="font-medium text-gray-700">
//                       {`${selectedAddress.slice(0, 6)}...${selectedAddress.slice(-4)}`}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Messages */}
//               <div 
//                 id="message-container"
//                 className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50"
//               >
//                 {messages.map((msg, index) => (
//                   <div
//                     key={index}
//                     className={`flex ${msg.senderAddress === userAddress ? 'justify-end' : 'justify-start'}`}
//                   >
//                     <div
//                       className={`max-w-[70%] rounded-xl px-6 py-3 shadow-sm ${
//                         msg.senderAddress === userAddress
//                           ? 'bg-blue-600 text-white'
//                           : 'bg-white text-gray-800'
//                       }`}
//                     >
//                       <div className="text-sm">
//                         {msg.content}
//                       </div>
//                       <div className={`text-xs ${msg.senderAddress === userAddress ? 'text-blue-100' : 'text-gray-400'} text-right mt-1`}>
//                         {new Date(msg.sent).toLocaleTimeString()}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Message Input */}
//               <div className="bg-white p-4 border-t border-gray-200">
//                 <div className="flex items-center space-x-4">
//                   <input
//                     type="text"
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     onKeyPress={(e) => {
//                       if (e.key === 'Enter' && !e.shiftKey) {
//                         e.preventDefault();
//                         sendMessage();
//                       }
//                     }}
//                     placeholder="Type a message"
//                     className="flex-1 p-3 bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-100"
//                   />
//                   <button
//                     onClick={sendMessage}
//                     disabled={isLoading || !newMessage.trim()}
//                     className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:opacity-50"
//                   >
//                     <Send className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//             </>
//           ) : (
//             // No chat selected state
//             <div className="flex-1 flex items-center justify-center bg-gray-50">
//               <div className="text-center">
//                 <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-6">
//                   <MessageSquare className="w-12 h-12" />
//                 </div>
//                 <h3 className="text-2xl font-medium text-gray-800">Welcome to XMTP Chat</h3>
//                 <p className="text-gray-500 mt-2">Select a contact to start messaging</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chat;