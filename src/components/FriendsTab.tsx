import React from 'react'
import { useReadContract } from 'wagmi'
import { c_abi, c_address } from '../utils/ContractDetails'
import { UserInterface } from '../pages/FriendRequestsPage'
import { useNavigate } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'

const FriendsTab = ({friendAddress}:{friendAddress:string}) => {
    const result = useReadContract({
        abi:c_abi,
        address:c_address,
        functionName:'getProfile',
        args:[friendAddress]
    })
    const navigate = useNavigate();
    const friend = result.data as UserInterface;
  return (
    <>
    {friend && (
                <div 
                  key={friend.userAddress}
                  className="glass-card p-6 rounded-xl flex items-center justify-between group hover:border-[#1488FC]/30 hover:shadow-lg hover:shadow-[#1488FC]/5 transition-all duration-300"
                >
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <img
                        src={friend.ipfsProfilePicture}
                        alt={friend.fullName}
                        className="w-16 h-16 rounded-full object-cover border-2 border-[#404040] group-hover:border-[#1488FC]/50 transition-colors"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#262626]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-[#1488FC] transition-colors">
                        {friend.fullName}
                      </h3>
                      <p className="text-gray-400">{friend.title}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => navigate("/chat")}
                    className="px-4 py-2 rounded-lg bg-[#1488FC]/10 text-[#1488FC] hover:bg-[#1488FC]/20 transition-all duration-300 flex items-center space-x-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Chat</span>
                  </button>
                </div>
    )}
    </>
  )
}

export default FriendsTab