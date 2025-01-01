import React from 'react';
import { Event } from '../types';
import { Calendar, MapPin } from 'lucide-react';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-white">{event.title}</h3>
        
        <div className="flex items-center mb-4 text-gray-300">
          <Calendar className="w-5 h-5 mr-2 text-[#1488FC]" />
          <span>{event.date}</span>
          <MapPin className="w-5 h-5 ml-4 mr-2 text-[#1488FC]" />
          <span>{event.type}</span>
        </div>

        <p className="text-gray-400 mb-4">{event.description}</p>

        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {event.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-[#1488FC]/10 border border-[#1488FC]/20 text-[#1488FC] rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <a
          href={event.registrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center px-6 py-2 bg-[#1488FC] text-white rounded-lg hover:bg-[#1488FC]/80 transition-colors"
        >
          Register Now
        </a>
      </div>
    </div>
  );
}