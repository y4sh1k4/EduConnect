import React from 'react';

interface TechStackFilterProps {
  selectedTech: string[];
  onTechChange: (tech: string[]) => void;
  experienceRange: number;
  onExperienceChange: (value: number) => void;
}

export default function TechStackFilter({
  selectedTech,
  onTechChange,
  experienceRange,
  onExperienceChange,
}: TechStackFilterProps) {
  const techOptions = [
    'React', 'TypeScript', 'Node.js', 'Python', 'Java', 'Blockchain',
    'Solidity', 'Web3', 'Smart Contracts', 'DeFi'
  ];

  return (
    <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#333333]">
      <h3 className="text-lg font-semibold mb-4 text-white">Filters</h3>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Tech Stack
        </label>
        <div className="space-y-2">
          {techOptions.map((tech) => (
            <label key={tech} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedTech.includes(tech)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onTechChange([...selectedTech, tech]);
                  } else {
                    onTechChange(selectedTech.filter((t) => t !== tech));
                  }
                }}
                className="rounded border-gray-600 bg-[#333333] text-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-300">{tech}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Minimum Experience (years): {experienceRange}
        </label>
        <input
          type="range"
          min="0"
          max="15"
          value={experienceRange}
          onChange={(e) => onExperienceChange(Number(e.target.value))}
          className="w-full h-2 bg-[#333333] rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
}