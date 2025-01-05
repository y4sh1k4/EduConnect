import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ConnectionsPage from './pages/ConnectionsPage';
import EventsPage from './pages/EventsPage';
import ProfilePage from './pages/ProfilePage';
import { Web3Provider } from './utils/Web3Provider';
import Chat from './pages/Chat';


function App() {
  return (
    <Web3Provider>
    <Router>
      <div className="min-h-screen bg-[#0A0A0A]">
        <Navbar />
        <main className="pt-0">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/connections" element={<ConnectionsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </main>
      </div>
    </Router>
    </Web3Provider>
  );
}

export default App;