import { User } from '../types';
import { Code2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useSwipe } from '../hooks/useSwipe';
import { useWriteContract } from 'wagmi';
import { c_abi, c_address } from '../utils/Contractdetails';

interface UserCardProps {
  user: User;
  onSwipe: (direction: 'left' | 'right') => void;
  isActive: boolean;
}

export default function UserCard({ user, onSwipe, isActive }: UserCardProps) {
  const { writeContract } = useWriteContract()
  
  const handleSwipeComplete = async (direction: 'left' | 'right') => {
    if (direction === 'right') {
      try {
        await sendFriendRequest(user.userAddress);
      } catch (error) {
        console.error('Failed to send friend request:', error);
      }
    }
    onSwipe(direction);
  };

  const {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    translateX,
    isDragging,
  } = useSwipe({
    onSwipeComplete: handleSwipeComplete,
    isActive,
  });

  const sendFriendRequest = (id: string) => {
    writeContract({ 
      abi: c_abi,
      address: c_address,
      functionName: 'sendFriendRequest',
      args: [id],
    })
  }

  const rotation = (translateX / 100) * 10;
  const opacity = Math.min(Math.abs(translateX) / 100, 1);

  return (
    <div 
      className={`w-full ${!isActive && 'pointer-events-none'}`}
      onMouseDown={e => handleTouchStart(e.clientX, e.clientY)}
      onMouseMove={e => handleTouchMove(e.clientX, e.clientY)}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      onTouchStart={e => handleTouchStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={e => handleTouchMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="glass-card w-full rounded-xl overflow-hidden cursor-grab shadow-2xl"
        style={{
          transform: isDragging ? `translateX(${translateX}px) rotate(${rotation}deg)` : '',
          transition: isDragging ? 'none' : 'all 0.3s ease-out',
        }}
      >
        {translateX > 0 && (
          <div 
            className="absolute top-4 left-4 bg-[#1488FC] rounded-full p-2 z-10 transition-opacity shadow-lg shadow-[#1488FC]/20"
            style={{ opacity }}
          >
            <ThumbsUp className="w-6 h-6 text-white" />
          </div>
        )}
        {translateX < 0 && (
          <div 
            className="absolute top-4 right-4 bg-red-500 rounded-full p-2 z-10 transition-opacity shadow-lg shadow-red-500/20"
            style={{ opacity }}
          >
            <ThumbsDown className="w-6 h-6 text-white" />
          </div>
        )}

        <img
          src={user.ipfsProfilePicture}
          alt={user.name}
          className="w-full h-48 sm:h-64 object-cover"
        />
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2 text-white">{user.fullName}</h2>
          <p className="text-gray-400 mb-4">{user.title}</p>

          <div className="mb-4">
            <div className="flex items-center mb-2">
              <Code2 className="w-5 h-5 mr-2 text-[#1488FC]" />
              <span className="font-semibold text-gray-300">Tech Stack</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-[#1488FC]/10 border border-[#1488FC]/20 text-[#1488FC] rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <p className="text-gray-400 mb-6">{user.about}</p>

          <div className="text-sm text-gray-500 text-center">
            Swipe right to connect, left to pass
          </div>
        </div>
      </div>
    </div>
  );
}