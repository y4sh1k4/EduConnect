import React, { Dispatch, SetStateAction } from 'react'
import { ChatUser } from '../pages/Chat'
import { useReadContract } from 'wagmi'
import { c_abi, c_address } from '../utils/ContractDetails'
import { UserInterface } from '../pages/FriendRequestsPage'

const ChatSidebar = ({chat,selectedChat,setSelectedChat}:{chat:ChatUser,selectedChat:string|null,setSelectedChat:Dispatch<SetStateAction<string|null>>}) => {
    const result = useReadContract({
        abi:c_abi,
        address:c_address,
        functionName:'getProfile',
        args:[chat.did.slice(7,)]
    });

    console.log(chat.did.slice(7,))
    const user = result.data?result.data: {
        about: "",
        fullName: "NA",
        ipfsProfilePicture: "https://jade-causal-mongoose-539.mypinata.cloud/ipfs/bafybeihh2boymdcu7fx5gfsr5r2434cvm3jnq6z3525azqylg4rvxnbdxq",
        techStack: [],
        title: "NA",
        userAddress:"NA",
        } as UserInterface
    return (
            <>
                    
                         <div
                            key={chat.did}
                            onClick={() => setSelectedChat(chat.did?chat.did.slice(7,):'0x...')}
                            className={`p-4 cursor-pointer hover:bg-gray-700 transition-colors flex gap-2 h-20  items-center w-full ${
                                selectedChat === chat.did.slice(7,) ? 'bg-gray-700' : ''
                            }`}
                        >
                            <img src={user.ipfsProfilePicture} alt="profile" className='rounded-full w-10 h-10'/>
                            <div className="text-white">{user.fullName}</div>
                            {chat.lastMessage && (
                                <div className="text-gray-400 text-sm truncate">{chat.lastMessage}</div>
                            )}
                        </div>
                        </>
  )
}

export default ChatSidebar