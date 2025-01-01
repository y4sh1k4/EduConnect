import React from 'react';
import { Link } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

export function NavLink({ to, icon, label, active }: NavLinkProps) {
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-2 rounded-lg transition-all hover:scale-105 ${
        active
          ? 'text-[#1488FC] bg-[#1488FC]/10 shadow-lg shadow-[#1488FC]/10'
          : 'text-gray-400 hover:text-[#1488FC] hover:bg-[#1488FC]/5'
      }`}
    >
      {icon}
      <span className="ml-2 font-medium">{label}</span>
    </Link>
  );
}