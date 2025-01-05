import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ConnectionsPage from './pages/ConnectionsPage';
import EventsPage from './pages/EventsPage';
import ProfilePage from './pages/ProfilePage';
import { Web3Provider } from './utils/Web3Provider';
import Chat from './pages/Chat';

import FriendRequestsPage from './pages/FriendRequestsPage';
import { PushProtocolProvider } from './context/PushProtocolContext';
import RegistrationPage from './pages/RegistrationPage';

function App() {
  return (
    <Web3Provider>
    <PushProtocolProvider>
    <Router>
      <div className="min-h-screen bg-[#0A0A0A]">
        <Navbar />
        <main className="pt-0">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/connections" element={<ConnectionsPage />} />
            <Route path="/requests" element={<FriendRequestsPage />}/> 
            <Route path="/events" element={<EventsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/register" element={<RegistrationPage />} />
            {/* <Route path="/chat" element={<ChatPage />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
    </PushProtocolProvider>
    </Web3Provider>
  );
}

export default App;