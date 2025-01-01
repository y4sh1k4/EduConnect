import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Calendar, UserCircle, Menu, X } from 'lucide-react';
import { NavLink } from './layout/NavLink';

const navItems = [
  { to: "/connections", icon: <Users className="w-5 h-5" />, label: "Connections" },
  { to: "/events", icon: <Calendar className="w-5 h-5" />, label: "Events" },
  { to: "/profile", icon: <UserCircle className="w-5 h-5" />, label: "Profile" }
];

export default function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#262626]/80 border-b border-[#404040] backdrop-blur-xl shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-[#1488FC] p-2 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#1488FC] to-blue-400 text-transparent bg-clip-text">
              EduChain
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                {...item}
                active={location.pathname === item.to}
              />
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-[#1488FC]/10 text-[#1488FC]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-[#262626] border-b border-[#404040]">
          <div className="px-4 py-2 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.to
                    ? 'bg-[#1488FC]/10 text-[#1488FC]'
                    : 'text-gray-400 hover:bg-[#1488FC]/5 hover:text-[#1488FC]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}