import React from 'react';
import { Upload, Plus, X } from 'lucide-react';
import { PinataSDK } from "pinata-web3";
import { useWriteContract } from 'wagmi'
import { c_abi, c_address } from '../utils/ContractDetails';
const pinata = new PinataSDK({
  pinataJwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmYmI2MzgxNS0yYjFlLTQ3NDAtOTQxNy0zYzkzNGE3ZGUyNjkiLCJlbWFpbCI6Im1laG5kaXJhdHRheWFzaGlrYTVAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjMzMGUwNGNhMmJjZjA4OGViMjVkIiwic2NvcGVkS2V5U2VjcmV0IjoiMzgwMWU2NmRjZDc3NTkxM2YzZDc4YjZjZjUxMDBiMTY1M2E1ZWVhOWI1ZDVkODhiMzdkZWEyMDhlYzA1MmZkNyIsImV4cCI6MTc2NzUyODM2NH0.FxsaNl4ae9fYkQKIWiTG44aTDbXCYm9JNGnlYa2AR50",
  pinataGateway: "http://jade-causal-mongoose-539.mypinata.cloud",
});

interface RegistrationFormProps {
  onComplete: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onComplete }) => {
  const { writeContract } = useWriteContract()
  const [formData, setFormData] = React.useState({
    name: '',
    title: '',
    experience: '',
    description: '',
    image: null as File | null, // Changed to allow null initially
    techStack: [] as string[]
  });
  const [newTech, setNewTech] = React.useState('');
  const [Image, setImage]= React.useState("");

  // Image file handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        image: e.target.files[0] // Ensure only one file is set
      }));
    }
  };

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image) {
      console.error("No image selected");
      return;
    }
    try {
      const upload = await pinata.upload.file(formData.image);
      console.log("Uploaded file:", upload);
      setImage(upload.IpfsHash)
      console.log("ipsfs",upload.IpfsHash)
      console.log("ipfs",Image)
      writeContract({ 
        abi:c_abi,
        address: c_address,
        functionName: 'createProfile',
        args: [
          formData.name,
          "http://jade-causal-mongoose-539.mypinata.cloud/ipfs/"+upload.IpfsHash,
          formData.title,
          formData.techStack,
          formData.description
        ],
     })
    } catch (error) {
      console.error("Error uploading file:", error);
    }

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
            <div className="flex items-center justify-center w-full relative">
            {formData.image ?
            <> 
                  <img src={URL.createObjectURL(formData.image)} alt="image" className='w-50 h-52' />
                  <button className='text-white border-white rounded-full px-2 absolute top-0 right-52 border' onClick={()=>setFormData((prev)=>({...prev,image:null}))}>x</button>
            </>
              :
              <>
              <label className="w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-[#1488FC]/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-6">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <p className="text-sm text-gray-400 mt-2">Click to upload image</p>
                </div>
                
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageChange} // Use updated handler
                />
              </label>
              </>
            }
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
};

export default RegistrationForm;
