import { useState } from 'react';
import UserCard from '../components/UserCard';
import TechStackFilter from '../components/TechStackFilter';
import { useConnections } from '../hooks/useConnections';
import { useReadContract,useAccount } from 'wagmi';
import { c_abi, c_address } from '../utils/ContractDetails';

interface UserInterface {
  about: string;
  fullName: string;
  ipfsProfilePicture: string;
  techStack: string[];
  title: string;
  userAddress: string;
}

export default function ConnectionsPage() {
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [experienceRange, setExperienceRange] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { handleConnection } = useConnections();
  const {address}= useAccount();
  const mockUsers = useReadContract({
    abi: c_abi,
    address: c_address,
    functionName: "getAllProfiles",
  });

  const users = (mockUsers.data ? mockUsers.data : []) as UserInterface[];

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentUser = users[currentIndex];
    // Since userAddress is the unique identifier in your data structure
    handleConnection(currentUser.userAddress, direction === 'right');
    
    if (currentIndex < users.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="lg:grid lg:grid-cols-12 gap-8">
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24">
              <TechStackFilter
                selectedTech={selectedTech}
                onTechChange={setSelectedTech}
                experienceRange={experienceRange}
                onExperienceChange={setExperienceRange}
              />
            </div>
          </div>
          
          <div className="lg:col-span-9">
            <div className="flex justify-center items-center min-h-[600px] relative">
              {users.map((user, index) => (
                (index >= currentIndex && user.userAddress!=address) && (
                  <div
                    key={user.userAddress}
                    className={`absolute w-full max-w-sm ${
                      index === currentIndex ? 'z-10' : 'z-0'
                    }`}
                    style={{
                      transform: `scale(${1 - (index - currentIndex) * 0.05})`,
                      opacity: 1 - (index - currentIndex) * 0.3,
                      top: `${(index - currentIndex) * 20}px`,
                    }}
                  >
                    <UserCard
                      user={user}
                      onSwipe={handleSwipe}
                      isActive={index === currentIndex}
                    />
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}