import React from 'react';
import { Mail, Github, Linkedin, Code2 } from 'lucide-react';
import { useAccount, useReadContract } from 'wagmi';
const abi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_from",
				"type": "address"
			}
		],
		"name": "acceptFriendRequest",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_date",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "_isHackathon",
				"type": "bool"
			}
		],
		"name": "createEvent",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_fullName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_ipfsProfilePicture",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_title",
				"type": "string"
			},
			{
				"internalType": "string[]",
				"name": "_techStack",
				"type": "string[]"
			},
			{
				"internalType": "string",
				"name": "_about",
				"type": "string"
			}
		],
		"name": "createProfile",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "eventId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "isHackathon",
				"type": "bool"
			}
		],
		"name": "EventCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			}
		],
		"name": "FriendRequestAccepted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			}
		],
		"name": "FriendRequestSent",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "fullName",
				"type": "string"
			}
		],
		"name": "ProfileCreated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			}
		],
		"name": "sendFriendRequest",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "allProfiles",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user1",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_user2",
				"type": "address"
			}
		],
		"name": "checkFriendship",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "events",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "date",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "organizer",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "isHackathon",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "friendships",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllProfiles",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "fullName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "ipfsProfilePicture",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "title",
						"type": "string"
					},
					{
						"internalType": "string[]",
						"name": "techStack",
						"type": "string[]"
					},
					{
						"internalType": "string",
						"name": "about",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "userAddress",
						"type": "address"
					}
				],
				"internalType": "struct EduConnect.ProfileView[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getEventCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getEvents",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "date",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "organizer",
						"type": "address"
					},
					{
						"internalType": "bool",
						"name": "isHackathon",
						"type": "bool"
					}
				],
				"internalType": "struct EduConnect.Event[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "getFriendCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "getFriends",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "getProfile",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "fullName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "ipfsProfilePicture",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "title",
						"type": "string"
					},
					{
						"internalType": "string[]",
						"name": "techStack",
						"type": "string[]"
					},
					{
						"internalType": "string",
						"name": "about",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "userAddress",
						"type": "address"
					}
				],
				"internalType": "struct EduConnect.ProfileView",
				"name": "_profile",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string[]",
				"name": "_techStack",
				"type": "string[]"
			}
		],
		"name": "getProfileByTech",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "fullName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "ipfsProfilePicture",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "title",
						"type": "string"
					},
					{
						"internalType": "string[]",
						"name": "techStack",
						"type": "string[]"
					},
					{
						"internalType": "string",
						"name": "about",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "userAddress",
						"type": "address"
					}
				],
				"internalType": "struct EduConnect.ProfileView[]",
				"name": "_filteredProfiles",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "hasProfile",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "profiles",
		"outputs": [
			{
				"internalType": "string",
				"name": "fullName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "ipfsProfilePicture",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "about",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

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
  abi,
  address:"0xDF933Cd647f69198D44cC0C6e982568534546f33",
  functionName:'getProfile',
  args:[address]
})
console.log(result.data );
const user = (result.data?result.data:{
about: "",
fullName: "NA",
ipfsProfilePicture: "https://jade-causal-mongoose-539.mypinata.cloud/ipfs/bafybeihh2boymdcu7fx5gfsr5r2434cvm3jnq6z3525azqylg4rvxnbdxq",
techStack: [],
title: "NA",
userAddress:"NA",
}) as userInterface;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="relative h-48 bg-[#1488FC]">
          <img
            src={user.ipfsProfilePicture}
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