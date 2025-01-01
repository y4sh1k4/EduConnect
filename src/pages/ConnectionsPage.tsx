import React, { useState } from 'react';
import UserCard from '../components/UserCard';
import TechStackFilter from '../components/TechStackFilter';
import { mockUsers } from '../data/mockUsers';
import { useConnections } from '../hooks/useConnections';

export default function ConnectionsPage() {
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [experienceRange, setExperienceRange] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { handleConnection } = useConnections();

  const filteredUsers = mockUsers.filter((user) => {
    const techMatch = selectedTech.length === 0 || 
      selectedTech.some(tech => user.techStack.includes(tech));
    const experienceMatch = user.experience >= experienceRange;
    return techMatch && experienceMatch;
  });

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentUser = filteredUsers[currentIndex];
    handleConnection(currentUser.id, direction === 'right');
    
    if (currentIndex < filteredUsers.length - 1) {
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
              {filteredUsers.map((user, index) => (
                index >= currentIndex && (
                  <div
                    key={user.id}
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