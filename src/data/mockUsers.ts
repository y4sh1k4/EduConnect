import { User } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    title: 'Senior Blockchain Developer',
    experience: 5,
    techStack: ['Solidity', 'Web3', 'React', 'Node.js'],
    bio: 'Passionate about building decentralized applications and contributing to the Web3 ecosystem.',
    connections: [],
  },
  {
    id: '2',
    name: 'David Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    title: 'Full Stack Developer',
    experience: 3,
    techStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
    bio: 'Building scalable web applications with modern technologies. Open source contributor.',
    connections: [],
  },
  {
    id: '3',
    name: 'Sarah Miller',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    title: 'Smart Contract Engineer',
    experience: 4,
    techStack: ['Solidity', 'Ethereum', 'JavaScript', 'Hardhat'],
    bio: 'Focused on DeFi protocols and smart contract security. Previously at ConsenSys.',
    connections: [],
  },
  {
    id: '4',
    name: 'Michael Park',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    title: 'Frontend Developer',
    experience: 2,
    techStack: ['React', 'Next.js', 'TailwindCSS', 'TypeScript'],
    bio: 'Creating beautiful and responsive user interfaces. Love working with React and modern CSS.',
    connections: [],
  },
  {
    id: '5',
    name: 'Emma Wilson',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    title: 'Backend Developer',
    experience: 6,
    techStack: ['Node.js', 'Python', 'AWS', 'Docker'],
    bio: 'Experienced in building scalable microservices and cloud architecture.',
    connections: [],
  }
];