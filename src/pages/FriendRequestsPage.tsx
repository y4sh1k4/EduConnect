import { Check, X, UserPlus } from 'lucide-react';
import { useFriendRequests } from '../hooks/useFriendRequests';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { c_abi, c_address } from '../utils/Contractdetails';
interface userInterface{
    about: string,
    fullName: string,
    ipfsProfilePicture: string,
    techStack: string[],
    title: string,
    userAddress: string
  }

export default function FriendRequestsPage() {
    const {address}= useAccount();
    const {writeContract}= useWriteContract();
    const requests= useReadContract({
        abi:c_abi,
        address:c_address,
        functionName:'getPendingRequests',
        args:[address]
    })
    const user = (requests.data?requests.data:[]) as userInterface[];
    console.log("friend request",user)
    const { handleReject ,handleAccept} = useFriendRequests(user);
    const handleAcceptRequest=(id:string)=>{
        writeContract({
            abi:c_abi,
            address:c_address,
            functionName:'acceptFriendRequest',
            args:[id]
        })
        handleAccept(id)
    }

  if (user.length === 0) {
    return (
  <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-[#1488FC]/10 rounded-full flex items-center justify-center">
            <UserPlus className="w-8 h-8 text-[#1488FC]" />
          </div>
          <h2 className="text-2xl font-semibold text-white">No pending requests</h2>
          <p className="text-gray-400">Friend requests will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1488FC] to-blue-400 text-transparent bg-clip-text">
            Friend Requests
          </h1>
          <p className="text-gray-400 mt-2">You have {user.length} pending requests</p>
        </div>
        <div className="bg-[#1488FC]/10 px-4 py-2 rounded-lg">
          <span className="text-[#1488FC] font-semibold">{user.length}</span>
          <span className="text-gray-400 ml-1">Pending</span>
        </div>
      </div>
      
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
                onClick={() => handleReject(request.userAddress)}
                className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all duration-300 flex items-center space-x-2 group/reject"
              >
                <X className="w-5 h-5 group-hover/reject:scale-110 transition-transform" />
                <span>Decline</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );    
}