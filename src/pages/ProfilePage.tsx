import { Mail, Github, Linkedin, Code2 } from 'lucide-react';
import { useAccount, useReadContract } from 'wagmi';
import { c_abi,c_address} from '../utils/Contractdetails';
interface userInterface{
  about: string,
  fullName: string,
  ipfsProfilePicture: string,
  techStack: string[],
  title: string,
  userAddress: string
}

export default function ProfilePage() {
const {address} = useAccount();

const result = useReadContract({
  abi:c_abi,
  address:c_address,
  functionName:'getProfile',
  args:[address]
})
console.log("data",result.data );
const user = (result.data?result.data:{
about: "",
fullName: "NA",
ipfsProfilePicture: "https://jade-causal-mongoose-539.mypinata.cloud/ipfs/bafybeihh2boymdcu7fx5gfsr5r2434cvm3jnq6z3525azqylg4rvxnbdxq",
techStack: [],
title: "NA",
userAddress:"NA",
}) as userInterface;
console.log("img",user.ipfsProfilePicture)
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="relative h-48 bg-[#1488FC]">
          <img
            src={"https://jade-causal-mongoose-539.mypinata.cloud/ipfs/bafybeihh2boymdcu7fx5gfsr5r2434cvm3jnq6z3525azqylg4rvxnbdxq"}
            alt={user.fullName}
            className="absolute bottom-0 left-8 transform translate-y-1/2 w-32 h-32 rounded-full border-4 border-[#262626] object-cover"
          />
        </div>

        <div className="mt-16 p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white">{user.fullName}</h1>
              <p className="text-xl text-gray-400 mt-1">{user.title}</p>
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

            <div className="mb-6">
              <div className="flex items-center mb-2">
                <Code2 className="w-5 h-5 mr-2 text-[#1488FC]" />
                <span className="font-semibold text-gray-300">Tech Stack</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.techStack.map((tech) => (
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
              <p className="text-gray-400">{user.about}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}