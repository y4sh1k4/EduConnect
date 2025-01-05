import { useEffect, useState } from 'react'
import { PushAPI, CONSTANTS } from '@pushprotocol/restapi';
import { useAccount, useWalletClient } from 'wagmi';
import ChatSidebar from '../components/ChatSidebar';
// import { c_abi, c_address } from '../utils/ContractDetails';

interface Message {
    messageContent: string;
    fromDID: string;
    timestamp: number;
}

export interface ChatUser {
    did: string;
    walletAddress?: string;
    lastMessage?: string;
}

const Chat = () => {
    const { data: walletClient } = useWalletClient();
    const [user, setUser] = useState<PushAPI | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatList, setChatList] = useState<ChatUser[]>([]);
    const [selectedChat, setSelectedChat] = useState<string | null>(null);
    const { address } = useAccount();

    // Load chat list
    const signMessage = async()=>{
        const userAlice = await PushAPI.initialize(walletClient, {
            env: CONSTANTS.ENV.STAGING,
        });
        setUser(userAlice);
        const stream = await userAlice.initStream([CONSTANTS.STREAM.CHAT])
        stream.on(CONSTANTS.STREAM.CHAT,(message)=>{
            console.log("message",message.message.content)
        })
        stream.connect();
        const aliceChats = await userAlice.chat.list('CHATS');
        console.log("chat list",aliceChats);
        setChatList(aliceChats);
        setSelectedChat(aliceChats[0].did.slice(7,));
        const accepted = await userAlice.chat.accept("0x09D9a6EdfE066fc24F46bA8C2b21736468f2967D");
        console.log(accepted);
        const chats = await userAlice.chat.history(selectedChat?selectedChat:aliceChats[0].did.slice(7,));
        console.log("history of messages",chats);
        setMessages(chats.reverse());
    }

    useEffect(()=>{
        const loadChats = async ()=>{
            const chats:Message[] = await user?.chat.history(selectedChat?selectedChat:"") as Message[];
            console.log("history of messages",chats);
            setMessages(chats.reverse());
        }
        loadChats();
    },[selectedChat])

    const sendMessage = async () => {
        try {
            if(!user){
                console.log("User not available");
            }
            const response = await user?.chat.send(selectedChat?selectedChat:'', {
                content: newMessage,
                type: 'Text'
            });
            
            if (response?.messageObj) {
                setMessages(prev => [...prev, {
                    messageContent:newMessage,
                    timestamp:response.timestamp,
                    fromDID:response.fromDID
                } as Message]);
                setNewMessage(''); // Clear input after sending
            }
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    }

    // Load chat history
    useEffect(() => {
        const loadChats = async () => {
            if(user==null){
                await signMessage();  
            }
        };
        loadChats();
    });
    
    return (
        <div className="flex h-screen bg-gray-900">
            {/* Sidebar */}
            <div className="w-80 border-r border-gray-700 bg-gray-800">
                <div className="p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">Chats</h2>
                </div>
                <div className="overflow-y-auto h-[calc(100vh-4rem)] flex flex-col items-center ">
                    {chatList.map((chat) => (
                        <ChatSidebar chat={chat} selectedChat={selectedChat} setSelectedChat={setSelectedChat}/>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="bg-gray-800 p-4 border-b border-gray-700">
                            <h2 className="text-xl font-bold text-white">
                                Chat with {selectedChat.slice(0, 6)}...{selectedChat.slice(-4)}
                            </h2>
                        </div>

                        {/* Messages Container */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-900 space-y-4">
                            {messages&&messages.map((msg, index) => (
                                <div key={index} 
                                     className={`flex ${msg.fromDID.slice(7,) === address ? 'justify-end' : 'justify-start'} relative`}>
                                    <div className={`max-w-[70%] flex flex-col p-3 rounded-lg ${
                                        msg.fromDID.slice(7,) === address 
                                        ? 'bg-blue-600 text-white rounded-br-none ' 
                                        : 'bg-gray-700 text-white rounded-bl-none relative left-0 mb-2'
                                    }`}>
                                        <p>{msg.messageContent}</p>
                                        <p className="text-xs mt-1 opacity-70">
                                            {new Date(msg.timestamp).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Message Input */}
                        <div className="bg-gray-800 p-4 border-t border-gray-700">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 p-2 rounded-lg bg-gray-700 text-white border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                />
                                <button 
                                    onClick={sendMessage}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    disabled={!newMessage.trim()}
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-900 text-gray-400">
                        Select a chat to start messaging
                    </div>
                )}
            </div>
        </div>
    );
}

export default Chat;