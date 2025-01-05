import { useState } from 'react';

interface userInterface{
    about: string,
    fullName: string,
    ipfsProfilePicture: string,
    techStack: string[],
    title: string,
    userAddress: string
  }

// const mockRequests: FriendRequest[] = [
//   {
//     id: '1',
//     name: 'Emma Thompson',
//     avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
//     title: 'Senior Blockchain Developer'
//   },
//   {
//     id: '2',
//     name: 'Alex Chen',
//     avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
//     title: 'Smart Contract Engineer'
//   },
//   {
//     id: '3',
//     name: 'Sarah Wilson',
//     avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
//     title: 'Full Stack Developer'
//   }
// ];

export function useFriendRequests(mockRequests:userInterface[]) {
  const [requests, setRequests] = useState<userInterface[]>(mockRequests);

  const handleAccept = (id: string) => {
    setRequests(prev => prev.filter(request => request.userAddress !== id));
    // Here you would typically make an API call to accept the request
  };

  const handleReject = (id: string) => {
    setRequests(prev => prev.filter(request => request.userAddress !== id));
    // Here you would typically make an API call to reject the request
  };

  return {
    requests,
    handleAccept,
    handleReject
  };
}