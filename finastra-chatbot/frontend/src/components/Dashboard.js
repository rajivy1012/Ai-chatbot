// frontend/src/components/Dashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, 
    Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
    BarChart, Bar
} from 'recharts';

const Dashboard = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [portfolioData, setPortfolioData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddInvestmentForm, setShowAddInvestmentForm] = useState(false);
    const [newInvestment, setNewInvestment] = useState({
        symbol: '',
        quantity: '',
        purchasePrice: ''
    });

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    const fetchData = useCallback(async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            navigate('/profile');
            return;
        }

        try {
            setIsLoading(true);
            // Fetch profile data
            const profileResponse = await axios.get(`${process.env.REACT_APP_API_URL}/profile/${userId}`);
            setProfile(profileResponse.data);

            // Sample monthly data - replace with actual API call in production
            const sampleMonthlyData = [
                {
                    income: profileResponse.data.monthlyIncome || 0,
                    expenses: profileResponse.data.monthlyIncome * 0.7 || 0,
                    savings: profileResponse.data.monthlyIncome * 0.3 || 0
                },
            ];
            setMonthlyData(sampleMonthlyData);

            // If profile has investments, fetch their data
            if (profileResponse.data?.investments?.length > 0) {
                const portfolioPromises = profileResponse.data.investments.map(async (investment) => {
                    try {
                        const response = await axios.get(
                            `${process.env.REACT_APP_API_URL}/market-data/${investment.symbol}`
                        );
                        return {
                            symbol: investment.symbol,
                            quantity: investment.quantity,
                            currentPrice: parseFloat(response.data['05. price'] || 0),
                            purchasePrice: investment.purchasePrice,
                            value: investment.quantity * parseFloat(response.data['05. price'] || 0),
                            gain: ((parseFloat(response.data['05. price'] || 0) - investment.purchasePrice) / investment.purchasePrice) * 100
                        };
                    } catch (error) {
                        console.error(`Error fetching data for ${investment.symbol}:`, error);
                        return null;
                    }
                });

                const results = await Promise.all(portfolioPromises);
                const validData = results.filter(item => item !== null);
                setPortfolioData(validData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load dashboard data');
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchData();
        // Refresh data every 5 minutes
        const intervalId = setInterval(fetchData, 300000);
        return () => clearInterval(intervalId);
    }, [fetchData]);

    const handleAddInvestment = async (e) => {
        e.preventDefault();
        try {
            const userId = localStorage.getItem('userId');
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/profile/${userId}/investments`, {
                symbol: newInvestment.symbol,
                quantity: Number(newInvestment.quantity),
                purchasePrice: Number(newInvestment.purchasePrice),
                purchaseDate: new Date()
            });

            if (response.data) {
                setShowAddInvestmentForm(false);
                setNewInvestment({ symbol: '', quantity: '', purchasePrice: '' });
                await fetchData(); // Refresh dashboard data
            }
        } catch (error) {
            console.error('Error adding investment:', error);
            alert('Failed to add investment. Please try again.');
        }
    };

    const AddInvestmentForm = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
                <h3 className="text-xl font-bold mb-4">Add New Investment</h3>
                <form onSubmit={handleAddInvestment}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Stock Symbol</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            value={newInvestment.symbol}
                            onChange={(e) => setNewInvestment({
                                ...newInvestment, 
                                symbol: e.target.value.toUpperCase()
                            })}
                            placeholder="e.g., AAPL"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Quantity</label>
                        <input
                            type="number"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            value={newInvestment.quantity}
                            onChange={(e) => setNewInvestment({
                                ...newInvestment, 
                                quantity: e.target.value
                            })}
                            placeholder="Number of shares"
                            required
                            min="1"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Purchase Price (₹)</label>
                        <input
                            type="number"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            value={newInvestment.purchasePrice}
                            onChange={(e) => setNewInvestment({
                                ...newInvestment, 
                                purchasePrice: e.target.value
                            })}
                            placeholder="Price per share"
                            required
                            min="0.01"
                            step="0.01"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setShowAddInvestmentForm(false)}
                            className="px-4 py-2 border rounded hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Add Investment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl font-semibold text-red-500">{error}</div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl font-semibold text-gray-600">Loading dashboard data...</div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl font-semibold text-gray-600">
                    Please create a profile first.
                    <button 
                        onClick={() => navigate('/profile')}
                        className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Create Profile
                    </button>
                </div>
            </div>
        );
    }

    const chartData = portfolioData.map(item => ({
        name: item.symbol,
        value: item.value,
        gain: item.gain
    }));

    const pieData = portfolioData.map(item => ({
        name: item.symbol,
        value: item.value
    }));

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Investment Dashboard</h1>
                <button 
                    onClick={() => setShowAddInvestmentForm(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add Investment
                </button>
            </div>

            {/* Monthly Comparison Chart */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Monthly Income, Expenses & Savings</h2>
                <div className="h-64">
                    <ResponsiveContainer>
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="income" fill="#8884d8" name="Income" />
                            <Bar dataKey="expenses" fill="#82ca9d" name="Expenses" />
                            <Bar dataKey="savings" fill="#ffc658" name="Savings" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            {/* Profile Overview */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Profile Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-gray-600">Monthly Income</p>
                        <p className="text-2xl font-bold">₹{profile.monthlyIncome?.toLocaleString() || 0}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Risk Tolerance</p>
                        <p className="text-2xl font-bold capitalize">{profile.riskTolerance || 'Not set'}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Time Horizon</p>
                        <p className="text-2xl font-bold capitalize">{profile.timeHorizon || 'Not set'}</p>
                    </div>
                </div>
            </div>

            {portfolioData.length > 0 ? (
                <>
                    {/* Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Performance Chart */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-bold mb-4">Portfolio Performance</h2>
                            <div className="h-[300px]">
                                <ResponsiveContainer>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                                        <Tooltip />
                                        <Legend />
                                        <Line 
                                            yAxisId="left"
                                            type="monotone" 
                                            dataKey="value" 
                                            stroke="#8884d8" 
                                            name="Value (₹)" 
                                        />
                                        <Line 
                                            yAxisId="right"
                                            type="monotone" 
                                            dataKey="gain" 
                                            stroke="#82ca9d" 
                                            name="Gain (%)" 
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Allocation Chart */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-bold mb-4">Portfolio Allocation</h2>
                            <div className="h-[300px]">
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, percent }) => 
                                                `${name} (${(percent * 100).toFixed(1)}%)`
                                            }
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Holdings Table */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Portfolio Holdings</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto">
                                {/* Holdings Table - Continued */}
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gain/Loss</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {portfolioData.map((item) => (
                                        <tr key={item.symbol}>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium">{item.symbol}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">₹{item.currentPrice.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">₹{item.value.toFixed(2)}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap ${
                                                item.gain >= 0 ? 'text-green-500' : 'text-red-500'
                                            }`}>
                                                {item.gain.toFixed(2)}%
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                    <p className="text-gray-600 mb-4">No investment data available.</p>
                    <button 
                        onClick={() => setShowAddInvestmentForm(true)}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Add Your First Investment
                    </button>
                </div>
            )}

            {/* Add Investment Modal */}
            {showAddInvestmentForm && <AddInvestmentForm />}
        </div>
    );
};

export default Dashboard;