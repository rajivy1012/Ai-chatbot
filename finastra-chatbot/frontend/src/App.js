import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Clipboard, TrendingUp, LayoutGrid, XCircle, Users } from 'lucide-react';
import ProfileQuestionnaire from './components/ProfileQuestionnaire';
import Dashboard from './components/Dashboard';
import ChatBot from './components/ChatBot';
import MutualFund from './components/MutualFund';
import BreakthroughCalculator from './components/BreakthroughCalculator';
import Market from './components/Market';

import './styles.css';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between">
              <div className="flex space-x-7">
                <Link to="/" className="py-4 px-2 text-gray-700 hover:text-blue-500 transition-colors">Home</Link>
                <Link to="/profile" className="py-4 px-2 text-gray-700 hover:text-blue-500 transition-colors">Profile</Link>
                <Link to="/dashboard" className="py-4 px-2 text-gray-700 hover:text-blue-500 transition-colors">Dashboard</Link>
                <Link to="/chat" className="py-4 px-2 text-gray-700 hover:text-blue-500 transition-colors">Chat</Link>
                <Link to="/MutualFund" className="py-4 px-2 text-gray-700 hover:text-blue-500 transition-colors">Mutual Fund/SIP</Link>
                <Link to="/BreakthroughCalculator" className="py-4 px-2 text-gray-700 hover:text-blue-500 transition-colors">Breakthrough Age Calculator</Link>
                <Link to="/Market" className="py-4 px-2 text-gray-700 hover:text-blue-500 transition-colors">Market</Link>
              </div>
            </div>
          </div>
        </nav>
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<ProfileQuestionnaire />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<ChatBot />} />
            <Route path="/MutualFund" element={<MutualFund />} />
            <Route path="/BreakthroughCalculator" element={<BreakthroughCalculator />} />
            <Route path="/Market" element={<Market />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

const Card = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-blue-700 mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-800 text-center mb-12">
        The right way to approach investing
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card 
          icon={<Clipboard className="w-6 h-6 text-blue-500" />}
          title="Set goals and create a Financial Plan"
          description="Create a personalized plan to achieve your financial objectives"
        />
        
        <Card 
          icon={<TrendingUp className="w-6 h-6 text-blue-500" />}
          title="Invest in Stocks and Mutual Funds"
          description="Build a diversified portfolio with expert guidance"
        />
        
        <Card 
          icon={<LayoutGrid className="w-6 h-6 text-blue-500" />}
          title="Manage your Portfolio"
          description="Track and optimize your investments for financial freedom"
        />
        
        <Card 
          icon={<XCircle className="w-6 h-6 text-blue-500" />}
          title="Discard unproductive investing habits"
          description="Learn to avoid common investment mistakes and pitfalls"
        />
        
        <Card 
          icon={<Users className="w-6 h-6 text-blue-500" />}
          title="Collaborate with a Dedicated Investment Advisor"
          description="Get personalized guidance from experienced professionals"
        />
      </div>

      <div className="bg-blue-50 rounded-lg p-8 text-center mb-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Did you know?</h2>
        <p className="text-gray-700 mb-6">
          Just setting your goals can increase your chances of achieving it by 33%.
        </p>
        <Link
          to="/profile"
          className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          Make a Financial Plan
        </Link>
      </div>
    </div>
  );
};

export default App;