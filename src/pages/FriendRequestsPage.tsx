import { Check, X, UserPlus, MessageCircle, Users } from 'lucide-react';
import { useFriendRequests } from '../hooks/useFriendRequests';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { c_abi, c_address } from '../utils/Contractdetails';
import { useState } from 'react';
import FriendsTab from '../components/FriendsTab';
import { usePushProtocol } from '../hooks/usePushProtocol';

export interface UserInterface {
  about: string;
  fullName: string;
  ipfsProfilePicture: string;
  techStack: string[];
  title: string;
  userAddress: string;
}

export default function FriendsAndRequestsPage() {
  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends');
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const {acceptChatRequest,rejectChatRequest} = usePushProtocol();
  const requests = useReadContract({
    abi: c_abi,
    address: c_address,
    functionName: 'getPendingRequests',
    args: [address]
  });
  
  const friends = useReadContract({
    abi: c_abi,
    address: c_address,
    functionName: 'getFriends',
    args: [address]
  });

  const user = (requests.data ? requests.data : []) as UserInterface[];
  const friendsList = (friends.data ? friends.data : []) as string[];
  console.log(friendsList);
  const { handleReject, handleAccept } = useFriendRequests(user);
  
  const handleAcceptRequest = (id: string) => {
    writeContract({
      abi: c_abi,
      address: c_address,
      functionName: 'acceptFriendRequest',
      args: [id]
    });
    acceptChatRequest(id);
  };

  const handleChat = (friendAddress: string) => {
    // Implement chat functionality
    console.log('Starting chat with:', friendAddress);
  };

  const TabButton = ({ tab, current, icon: Icon, count }: { 
    tab: 'friends' | 'requests';
    current: string;
    icon: any;
    count: number;
  }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${
        activeTab === tab 
          ? 'bg-[#1488FC] text-white'
          : 'bg-[#1488FC]/10 text-[#1488FC] hover:bg-[#1488FC]/20'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-semibold">
        {tab.charAt(0).toUpperCase() + tab.slice(1)}
      </span>
      {count > 0 && (
        <span className="bg-white/20 px-2 py-1 rounded-full text-sm">
          {count}
        </span>
      )}
    </button>
  );

  const EmptyState = ({ type, icon: Icon, message }: {
    type: string;
    icon: any;
    message: string;
  }) => (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-[#1488FC]/10 rounded-full flex items-center justify-center">
          <Icon className="w-8 h-8 text-[#1488FC]" />
        </div>
        <h2 className="text-2xl font-semibold text-white">No {type}</h2>
        <p className="text-gray-400">{message}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-4 mb-8">
        <TabButton 
          tab="friends" 
          current={activeTab} 
          icon={Users} 
          count={friendsList.length} 
        />
        <TabButton 
          tab="requests" 
          current={activeTab} 
          icon={UserPlus} 
          count={user.length} 
        />
      </div>

      {activeTab === 'friends' && (
        <>
          {friendsList.length === 0 ? (
            <EmptyState 
              type="friends" 
              icon={Users} 
              message="Add some friends to get started"
            />
          ) : (
            <div className="grid gap-4">
              {friendsList.map((friend) => (
                <FriendsTab friendAddress={friend}/>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'requests' && (
        <>
          {user.length === 0 ? (
            <EmptyState 
              type="pending requests" 
              icon={UserPlus} 
              message="Friend requests will appear here"
            />
          ) : (
            <div className="grid gap-4">
              {user.map((request) => (
                <div 
                  key={request.userAddress} 
                  className="glass-card p-6 rounded-xl flex items-center justify-between group hover:border-[#1488FC]/30 hover:shadow-lg hover:shadow-[#1488FC]/5 transition-all duration-300"
                >
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <img
                        src={request.ipfsProfilePicture}
                        alt={request.fullName}
                        className="w-16 h-16 rounded-full object-cover border-2 border-[#404040] group-hover:border-[#1488FC]/50 transition-colors"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#262626]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-[#1488FC] transition-colors">
                        {request.fullName}
                      </h3>
                      <p className="text-gray-400">{request.title}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleAcceptRequest(request.userAddress)}
                      className="px-4 py-2 rounded-lg bg-[#1488FC]/10 text-[#1488FC] hover:bg-[#1488FC]/20 transition-all duration-300 flex items-center space-x-2 group/accept"
                    >
                      <Check className="w-5 h-5 group-hover/accept:scale-110 transition-transform" />
                      <span>Accept</span>
                    </button>
                    <button
                      onClick={() => rejectChatRequest(request.userAddress)}
                      className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all duration-300 flex items-center space-x-2 group/reject"
                    >
                      <X className="w-5 h-5 group-hover/reject:scale-110 transition-transform" />
                      <span>Decline</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}