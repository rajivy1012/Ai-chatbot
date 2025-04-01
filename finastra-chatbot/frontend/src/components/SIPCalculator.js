import React, { useState, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const SIPCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [returns, setReturns] = useState(10);
  const [tenure, setTenure] = useState(10);
  const [annualIncrease, setAnnualIncrease] = useState(10);
  
  const [results, setResults] = useState({
    investedAmount: 0,
    estimatedReturns: 0,
    totalAmount: 0
  });

  const calculateSIP = useCallback(() => {
    let totalInvestment = 0;
    let totalAmount = 0;
    let monthlyRate = (returns / 100) / 12;
    let currentMonthlyInvestment = monthlyInvestment;

    for (let year = 0; year < tenure; year++) {
      for (let month = 0; month < 12; month++) {
        totalInvestment += currentMonthlyInvestment;
        totalAmount = (totalAmount + currentMonthlyInvestment) * (1 + monthlyRate);
      }
      if (annualIncrease > 0) {
        currentMonthlyInvestment *= (1 + annualIncrease / 100);
      }
    }

    setResults({
      investedAmount: Math.round(totalInvestment),
      estimatedReturns: Math.round(totalAmount - totalInvestment),
      totalAmount: Math.round(totalAmount)
    });
  }, [monthlyInvestment, returns, tenure, annualIncrease]);

  React.useEffect(() => {
    calculateSIP();
  }, [calculateSIP]);

  const formatToLacs = (value) => {
    if (value >= 100000) {
        return `${(value / 100000).toFixed(2)} Lac`;
    }
    return value.toLocaleString('en-IN');
  };

  const pieData = [
    { name: 'Invested Amount', value: results.investedAmount },
    { name: 'Est. Returns', value: results.estimatedReturns }
  ];

  const COLORS = ['#F7C55F', '#FFFFFF'];

  const handleInputChange = (value, setter, type) => {
    const numValue = Number(value);
    if (numValue >= 0) {  // Allow any positive number
      if (type === 'investment') {
        setter(numValue);
      } else if (type === 'returns' && numValue <= 100) {
        setter(numValue);
      } else if (type === 'tenure' && numValue <= 50) {
        setter(numValue);
      } else if (type === 'increase' && numValue <= 100) {
        setter(numValue);
      }
    }
  };

  // For slider updates - keep within reasonable ranges
  const handleSliderChange = (value, setter, type) => {
    const numValue = Number(value);
    if (type === 'investment') {
      setter(Math.min(Math.max(numValue, 0), 1000000));
    } else if (type === 'returns') {
      setter(Math.min(Math.max(numValue, 0), 100));
    } else if (type === 'tenure') {
      setter(Math.min(Math.max(numValue, 0), 50));
    } else if (type === 'increase') {
      setter(Math.min(Math.max(numValue, 0), 100));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">SIP Calculator</h1>
      <p className="text-gray-600 mb-8">
        Find out how much wealth you can generate by doing a particular amount of SIP
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section - Light Theme */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="space-y-8">
            <div>
              <label className="block text-lg font-medium text-gray-900 mb-4">
                Monthly investment (₹)
              </label>
              <div className="flex items-center space-x-4 mb-2">
                <input
                  type="range"
                  value={monthlyInvestment}
                  onChange={(e) => handleSliderChange(e.target.value, setMonthlyInvestment, 'investment')}
                  min="0"
                  max="1000000"
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                />
                <input
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => handleInputChange(e.target.value, setMonthlyInvestment, 'investment')}
                  className="w-32 p-2 border rounded-lg text-right"
                  min="0"
                  placeholder="Enter amount"
                />
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-900 mb-4">
                Returns (%)
              </label>
              <div className="flex items-center space-x-4 mb-2">
                <input
                  type="range"
                  value={returns}
                  onChange={(e) => handleSliderChange(e.target.value, setReturns, 'returns')}
                  min="0"
                  max="100"
                  step="0.1"
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                />
                <input
                  type="number"
                  value={returns}
                  onChange={(e) => handleInputChange(e.target.value, setReturns, 'returns')}
                  className="w-32 p-2 border rounded-lg text-right"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="Enter %"
                />
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-900 mb-4">
                Tenure (Years)
              </label>
              <div className="flex items-center space-x-4 mb-2">
                <input
                  type="range"
                  value={tenure}
                  onChange={(e) => handleSliderChange(e.target.value, setTenure, 'tenure')}
                  min="0"
                  max="50"
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                />
                <input
                  type="number"
                  value={tenure}
                  onChange={(e) => handleInputChange(e.target.value, setTenure, 'tenure')}
                  className="w-32 p-2 border rounded-lg text-right"
                  min="0"
                  max="50"
                  placeholder="Enter years"
                />
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-900 mb-4">
                Annual Increase in SIP (%)
              </label>
              <div className="flex items-center space-x-4 mb-2">
                <input
                  type="range"
                  value={annualIncrease}
                  onChange={(e) => handleSliderChange(e.target.value, setAnnualIncrease, 'increase')}
                  min="0"
                  max="100"
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                />
                <input
                  type="number"
                  value={annualIncrease}
                  onChange={(e) => handleInputChange(e.target.value, setAnnualIncrease, 'increase')}
                  className="w-32 p-2 border rounded-lg text-right"
                  min="0"
                  max="100"
                  placeholder="Enter %"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Section - Dark Theme */}
        <div className="bg-black text-white p-8 rounded-lg shadow-lg relative">
          <div className="grid grid-cols-2 gap-6">
            {/* Left side - Numbers */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <span className="text-gray-400 text-lg">Invested amount</span>
                </div>
                <div className="text-3xl font-bold tracking-tight">
                  <span className="text-base font-normal text-gray-400">₹</span>
                  <span className="text-yellow-400">{formatToLacs(results.investedAmount)}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-white"></div>
                  <span className="text-gray-400 text-lg">Est. Returns</span>
                </div>
                <div className="text-3xl font-bold tracking-tight">
                  <span className="text-base font-normal text-gray-400">₹</span>
                  <span>{formatToLacs(results.estimatedReturns)}</span>
                </div>
              </div>

              <div>
                <div className="text-gray-400 text-lg mb-2">Total amount</div>
                <div className="text-4xl font-bold tracking-tight">
                  <span className="text-base font-normal text-gray-400">₹</span>
                  <span className="text-yellow-400">{formatToLacs(results.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Right side - Pie Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    startAngle={90}
                    endAngle={450}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Invest Now Button */}
          <button className="absolute bottom-8 right-8 bg-yellow-400 text-black px-6 py-2 rounded-full font-medium hover:bg-yellow-300 transition-colors">
            Invest Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SIPCalculator;