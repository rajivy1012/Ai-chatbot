import React, { useEffect, useState } from 'react';
import SIPCalculator from './SIPCalculator';
import { ChevronDown, PiggyBank, LineChart, Target, Activity, TrendingUp } from 'lucide-react';

const FeatureCard = ({ Icon, title, description }) => (
  <div className="p-6 bg-white rounded-lg shadow-lg transform hover:scale-105 transition-transform">
    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <Icon className="w-8 h-8 text-blue-600" />
    </div>
    <h3 className="text-2xl font-semibold text-gray-900 mb-3 text-center">{title}</h3>
    <p className="text-gray-600 text-center text-lg">{description}</p>
  </div>
);

const MutualFundPage = () => {
  // ... keep useState and useEffect hooks the same ...
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      if (position > 100) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContent = () => {
    const contentSection = document.getElementById('understanding-section');
    contentSection.scrollIntoView({ behavior: 'smooth' });
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Calculator Section - keep as is */}
      <section className="min-h-screen relative pt-24 pb-16 px-4 flex flex-col">
        <div className="flex-grow">
          <SIPCalculator />
        </div>
        
        {showScrollIndicator && (
          <div onClick={scrollToContent} className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center cursor-pointer animate-bounce">
            <p className="text-gray-600 text-lg mb-2">Scroll to learn more</p>
            <ChevronDown className="w-8 h-8 text-blue-600 mx-auto" />
          </div>
        )}
      </section>

      {/* Understanding Section */}
      <section id="understanding-section" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Understanding SIP & Mutual Funds</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-semibold text-blue-900 mb-4">What is a Systematic Investment Plan (SIP)?</h3>
              <p className="text-gray-600 mb-4 text-lg">
                A Systematic Investment Plan (SIP) is a method of investing a fixed amount regularly in mutual funds. 
                Think of it as a recurring deposit where your money is invested in market-linked instruments.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 text-lg">
                <li>Invest fixed amounts monthly/quarterly</li>
                <li>Benefit from rupee cost averaging</li>
                <li>Start with as little as ₹500 per month</li>
                <li>Automated investments for disciplined saving</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-semibold text-blue-900 mb-4">What are Mutual Funds?</h3>
              <p className="text-gray-600 mb-4 text-lg">
                Mutual funds pool money from multiple investors to invest in stocks, bonds, and other securities. 
                They're professionally managed and offer diversification benefits.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 text-lg">
                <li>Professional fund management</li>
                <li>Diversification across multiple securities</li>
                <li>Various fund options for different goals</li>
                <li>Regulated by SEBI for investor protection</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Power of Compounding Section */}
      <section className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">The Power of Compounding</h2>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-3xl font-semibold text-blue-900 mb-6 text-center">
              How ₹10,000 monthly SIP can grow over time
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {/* Growth Cards */}
              <div className="p-6 bg-blue-50 rounded-lg transform hover:scale-105 transition-all duration-300">
                <p className="text-xl font-semibold text-blue-900">After 10 Years</p>
                <p className="text-4xl font-bold text-indigo-600 mb-2">₹20.2 Lacs</p>
                <p className="text-lg text-gray-600">At 12% p.a. returns</p>
              </div>
              <div className="p-6 bg-blue-50 rounded-lg transform hover:scale-105 transition-all duration-300">
                <p className="text-xl font-semibold text-blue-900">After 20 Years</p>
                <p className="text-4xl font-bold text-indigo-600 mb-2">₹75.7 Lacs</p>
                <p className="text-lg text-gray-600">At 12% p.a. returns</p>
              </div>
              <div className="p-6 bg-blue-50 rounded-lg transform hover:scale-105 transition-all duration-300">
                <p className="text-xl font-semibold text-blue-900">After 30 Years</p>
                <p className="text-4xl font-bold text-indigo-600 mb-2">₹2.65 Crores</p>
                <p className="text-lg text-gray-600">At 12% p.a. returns</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages of SIP Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Advantages of SIP Investment</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <FeatureCard
              Icon={PiggyBank}
              title="Disciplined Saving"
              description="Regular investments help build a disciplined approach to saving and wealth creation"
            />
            <FeatureCard
              Icon={Activity}
              title="Rupee Cost Averaging"
              description="Buy more units when prices are low and fewer when prices are high"
            />
            <FeatureCard
              Icon={Target}
              title="Goal-Based Investing"
              description="Align your investments with specific financial goals and time horizons"
            />
          </div>
        </div>
      </section>

      {/* Save 10% Section */}
      <section className="py-12 bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">The 10% Rule of Wealth Creation</h2>
            <p className="text-2xl mb-8 opacity-90">
              Saving just 10% of your monthly income through SIP can help you build substantial wealth over time.
            </p>
            <div className="bg-white/10 rounded-lg p-8 backdrop-blur-sm">
              <p className="text-xl mb-4">
                If your monthly income is ₹50,000, investing ₹5,000 monthly for 30 years at 12% returns can grow to
              </p>
              <p className="text-6xl font-bold text-yellow-400 mb-3">₹1.32 Crores</p>
              <p className="text-lg opacity-80">*Returns are indicative and not guaranteed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Coming Soon</h2>
          <p className="text-2xl text-gray-600 mb-8">
            We're working on bringing you real-time data on India's best-performing mutual funds and SIPs.
          </p>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <div className="p-6 bg-gray-50 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <LineChart className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Top Performing Funds</h3>
              <p className="text-lg text-gray-600">Real-time performance data of top mutual funds in India</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <TrendingUp className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Market Analysis</h3>
              <p className="text-lg text-gray-600">Expert insights and market trends analysis</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MutualFundPage;