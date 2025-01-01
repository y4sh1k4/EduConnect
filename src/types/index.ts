export interface User {
  id: string;
  name: string;
  avatar: string;
  title: string;
  experience: number;
  techStack: string[];
  bio: string;
  connections: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'virtual' | 'in-person';
  techStack: string[];
  registrationUrl: string;
  image: string;
}