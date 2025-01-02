import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Code2, Users, Brain, ArrowRight } from 'lucide-react';
import RegistrationForm from '../components/RegistrationForm';
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
export default function HomePage() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const navigate = useNavigate();
  const { address} = useAccount();

  const handleWalletConnect = () => {
    setIsWalletConnected(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {!showRegistration ? (
        <div className="relative">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-[#1488FC]/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-600/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-16 relative">
            <div className="text-center mb-16">
              <div className="inline-block p-2 px-4 rounded-full bg-[#1488FC]/10 border border-[#1488FC]/20 text-[#1488FC] text-sm mb-4 animate-bounce">
                🚀 The Future of Web3 Collaboration
              </div>
              <h1 className="text-4xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#1488FC] via-blue-400 to-[#1488FC] text-transparent bg-clip-text">
                Connect. Learn.
                <br />
                Build Together.
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Join an exclusive community of blockchain developers, share knowledge,
                and create the next generation of Web3 applications.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "Connect with Peers",
                  description: "Find and connect with like-minded developers in the blockchain space."
                },
                {
                  icon: <Code2 className="w-8 h-8" />,
                  title: "Share Knowledge",
                  description: "Exchange ideas and learn from experienced blockchain developers."
                },
                {
                  icon: <Brain className="w-8 h-8" />,
                  title: "Build Together",
                  description: "Collaborate on projects and create innovative blockchain solutions."
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="glass-card p-8 rounded-xl text-center transform hover:scale-105 transition-all duration-300 hover:shadow-[#1488FC]/10 hover:shadow-2xl group"
                >
                  <div className="inline-block p-4 rounded-xl bg-gradient-to-br from-[#1488FC]/10 to-[#1488FC]/5 mb-4 group-hover:from-[#1488FC]/20 group-hover:to-[#1488FC]/10 transition-all">
                    <div className="text-[#1488FC] group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center space-y-4">
              {!address ? (
                <div className=" inline-flex items-center gap-2">
                <ConnectKitButton />
                </div>
              ) : (
                <button
                  onClick={() => setShowRegistration(true)}
                  className="px-8 py-4 bg-gradient-to-r from-[#1488FC] to-blue-500 rounded-lg font-semibold hover:from-[#1488FC]/90 hover:to-blue-500/90 transition-all transform hover:scale-105 inline-flex items-center gap-2 shadow-lg shadow-[#1488FC]/20"
                >
                  Get Started <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Statistics Section */}
            <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "10K+", label: "Developers" },
                { number: "5K+", label: "Projects" },
                { number: "1M+", label: "Connections" },
                { number: "100+", label: "Countries" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-[#1488FC] mb-2">{stat.number}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <RegistrationForm onComplete={() => navigate('/profile')} />
      )}
    </div>
  );
}