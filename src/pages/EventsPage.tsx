import React, { useState } from 'react';
import EventCard from '../components/EventCard';
import { Event } from '../types';

const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Web3 Hackathon 2024',
    description: 'Join us for a 48-hour hackathon focused on building the future of Web3.',
    date: 'March 15-17, 2024',
    type: 'virtual',
    techStack: ['Solidity', 'Web3', 'Smart Contracts'],
    registrationUrl: 'https://example.com/hackathon',
    image: 'https://images.unsplash.com/photo-1515169067868-5387ec356754',
  },
];

export default function EventsPage() {
  const [selectedTech, setSelectedTech] = useState<string[]>([]);

  const filteredEvents = MOCK_EVENTS.filter((event) =>
    selectedTech.length === 0 ||
    selectedTech.some(tech => event.techStack.includes(tech))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Upcoming Events</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}