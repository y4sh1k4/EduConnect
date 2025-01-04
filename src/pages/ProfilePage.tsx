import { useReadContract } from 'wagmi';
import { c_abi,c_address } from '../utils/Contractdetails';
import { User } from '../types';
import { Mail, Github, Linkedin, Code2, Briefcase } from 'lucide-react';
import { useAccount } from 'wagmi';
export default function ProfilePage() {
  const {address}= useAccount()
  const MOCK_USER= useReadContract({
    abi:c_abi,
    address:c_address,
    functionName:'getProfile',
    args:[address]
  })
  const user= MOCK_USER?MOCK_USER.data:[];
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="relative h-48 bg-[#1488FC]">
          <img
            src={user[1]}
            alt={user[0]}
            className="absolute bottom-0 left-8 transform translate-y-1/2 w-32 h-32 rounded-full border-4 border-[#262626] object-cover"
          />
        </div>

        <div className="mt-16 p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white">{user[0]}</h1>
              <p className="text-xl text-gray-400 mt-1">{user[2]}</p>
            </div>
            <button className="px-6 py-2 bg-[#1488FC] text-white rounded-lg hover:bg-[#1488FC]/80 transition-colors">
              Edit Profile
            </button>
          </div>

          <div className="flex items-center mt-6 space-x-4">
            <a href="#" className="text-gray-400 hover:text-[#1488FC] transition-colors">
              <Mail className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#1488FC] transition-colors">
              <Github className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#1488FC] transition-colors">
              <Linkedin className="w-6 h-6" />
            </a>
          </div>

          <div className="mt-8">
            {/* <div className="flex items-center mb-4 text-gray-300">
              <Briefcase className="w-5 h-5 mr-2 text-[#1488FC]" />
              <span>{MOCK_USER.experience} years of experience</span>
            </div> */}

            <div className="mb-6">
              <div className="flex items-center mb-2">
                <Code2 className="w-5 h-5 mr-2 text-[#1488FC]" />
                <span className="font-semibold text-gray-300">Tech Stack</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {user[3].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-[#1488FC]/10 border border-[#1488FC]/20 text-[#1488FC] rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2 text-white">About</h2>
              <p className="text-gray-400">{user[4]}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}