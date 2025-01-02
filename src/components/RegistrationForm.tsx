import React, { useState } from 'react';
import { Upload, Plus, X } from 'lucide-react';

interface RegistrationFormProps {
  onComplete: () => void;
}

export default function RegistrationForm({ onComplete }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    experience: '',
    description: '',
    image: '',
    techStack: [] as string[]
  });
  const [newTech, setNewTech] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    onComplete();
  };

  const addTechStack = () => {
    if (newTech && !formData.techStack.includes(newTech)) {
      setFormData(prev => ({
        ...prev,
        techStack: [...prev.techStack, newTech]
      }));
      setNewTech('');
    }
  };

  const removeTech = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.filter(t => t !== tech)
    }));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-[#1488FC] to-blue-400 text-transparent bg-clip-text">
        Complete Your Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card p-6 rounded-xl space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Profile Image</label>
            <div className="flex items-center justify-center w-full">
              <label className="w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-[#1488FC]/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-6">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <p className="text-sm text-gray-400 mt-2">Click to upload image</p>
                </div>
                <input type="file" className="hidden" accept="image/*" />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-[#1A1A1A] border border-gray-600 text-white focus:border-[#1488FC] transition-colors"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-[#1A1A1A] border border-gray-600 text-white focus:border-[#1488FC] transition-colors"
              placeholder="Blockchain Developer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Years of Experience</label>
            <input
              type="number"
              value={formData.experience}
              onChange={e => setFormData(prev => ({ ...prev, experience: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-[#1A1A1A] border border-gray-600 text-white focus:border-[#1488FC] transition-colors"
              placeholder="2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tech Stack</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTech}
                onChange={e => setNewTech(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-[#1A1A1A] border border-gray-600 text-white focus:border-[#1488FC] transition-colors"
                placeholder="React, Solidity, etc."
              />
              <button
                type="button"
                onClick={addTechStack}
                className="p-2 bg-[#1488FC]/10 text-[#1488FC] rounded-lg hover:bg-[#1488FC]/20 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.techStack.map(tech => (
                <span
                  key={tech}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#1488FC]/10 text-[#1488FC] border border-[#1488FC]/20"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTech(tech)}
                    className="ml-2 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">About You</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-[#1A1A1A] border border-gray-600 text-white focus:border-[#1488FC] transition-colors"
              rows={4}
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-8 py-3 bg-[#1488FC] rounded-lg font-semibold hover:bg-[#1488FC]/80 transition-colors"
        >
          Complete Registration
        </button>
      </form>
    </div>
  );
}