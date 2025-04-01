import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileQuestionnaire = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    
    const [formData, setFormData] = useState({
        monthlyIncome: '',
        monthlySavings: '',
        monthlyInvestment: '',
        monthlyExpenses: '',
        existingInvestments: '',
        debtAmount: '',
        investmentGoals: [],
        riskTolerance: '',
        timeHorizon: '',
        employmentStatus: '',
        dependents: '',
        emergencyFund: '',
        taxBracket: '',
        preferredInvestments: []
    });

    const goals = [
        'Retirement',
        'Wealth Growth',
        'Education',
        'Home Purchase',
        'Emergency Fund'
    ];

    const investmentTypes = [
        'Stocks',
        'Mutual Funds',
        'Fixed Deposits',
        'Real Estate',
        'Gold',
        'Government Bonds'
    ];

    const questions = [
        {
            id: 1,
            title: "What is your monthly income?",
            description: "Include your salary and any other regular income sources",
            field: "monthlyIncome",
            component: (
                <div className="transition-all duration-300 hover:scale-102">
                    <label className="block text-lg font-medium text-gray-800 mb-3">
                        Monthly Income (₹)
                    </label>
                    <input
                        type="number"
                        value={formData.monthlyIncome}
                        onChange={(e) => setFormData({...formData, monthlyIncome: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        required
                        min="0"
                    />
                </div>
            )
        },
        {
            id: 2,
            title: "What is your current employment status?",
            description: "This helps us understand your income stability",
            field: "employmentStatus",
            component: (
                <div className="transition-all duration-300">
                    <label className="block text-lg font-medium text-gray-800 mb-3">
                        Employment Status
                    </label>
                    <select
                        value={formData.employmentStatus}
                        onChange={(e) => setFormData({...formData, employmentStatus: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        required
                    >
                        <option value="">Select Status</option>
                        <option value="fulltime">Full-time Employed</option>
                        <option value="parttime">Part-time Employed</option>
                        <option value="selfemployed">Self-employed</option>
                        <option value="business">Business Owner</option>
                        <option value="retired">Retired</option>
                    </select>
                </div>
            )
        },
        {
            id: 3,
            title: "How much do you save monthly?",
            description: "Regular savings after all expenses",
            field: "monthlySavings",
            component: (
                <div className="transition-all duration-300">
                    <label className="block text-lg font-medium text-gray-800 mb-3">
                        Monthly Savings (₹)
                    </label>
                    <input
                        type="number"
                        value={formData.monthlySavings}
                        onChange={(e) => setFormData({...formData, monthlySavings: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        required
                        min="0"
                    />
                </div>
            )
        },
        {
            id: 4,
            title: "What are your monthly expenses?",
            description: "Total regular monthly expenditure",
            field: "monthlyExpenses",
            component: (
                <div className="transition-all duration-300">
                    <label className="block text-lg font-medium text-gray-800 mb-3">
                        Monthly Expenses (₹)
                    </label>
                    <input
                        type="number"
                        value={formData.monthlyExpenses}
                        onChange={(e) => setFormData({...formData, monthlyExpenses: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        required
                        min="0"
                    />
                </div>
            )
        },
        {
            id: 5,
            title: "How much can you invest monthly?",
            description: "Regular amount available for investments",
            field: "monthlyInvestment",
            component: (
                <div className="transition-all duration-300">
                    <label className="block text-lg font-medium text-gray-800 mb-3">
                        Monthly Investment (₹)
                    </label>
                    <input
                        type="number"
                        value={formData.monthlyInvestment}
                        onChange={(e) => setFormData({...formData, monthlyInvestment: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        required
                        min="0"
                    />
                </div>
            )
        },
        { 
            id: 6,
            title: "What are your investment goals?",
            description: "Select all that apply to your financial objectives",
            field: "investmentGoals",
            component: (
                <div className="transition-all duration-300">
                    <label className="block text-lg font-medium text-gray-800 mb-3">
                        Investment Goals
                    </label>
                    <div className="space-y-3">
                        {goals.map(goal => (
                            <label key={goal} className="flex items-center p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-all duration-200">
                                <input
                                    type="checkbox"
                                    checked={formData.investmentGoals.includes(goal)}
                                    onChange={() => handleGoalChange(goal)}
                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="ml-3 text-gray-700">{goal}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )
        },
        {
            id: 7,
            title: "What is your risk tolerance?",
            description: "This determines your investment strategy",
            field: "riskTolerance",
            component: (
                <div className="transition-all duration-300">
                    <label className="block text-lg font-medium text-gray-800 mb-3">
                        Risk Tolerance
                    </label>
                    <select
                        value={formData.riskTolerance}
                        onChange={(e) => setFormData({...formData, riskTolerance: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        required
                    >
                        <option value="">Select Risk Tolerance</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
            )
        },
        {
            id: 8,
            title: "What investment types interest you?",
            description: "Select all investment vehicles you're interested in",
            field: "preferredInvestments",
            component: (
                <div className="transition-all duration-300">
                    <label className="block text-lg font-medium text-gray-800 mb-3">
                        Preferred Investments
                    </label>
                    <div className="space-y-3">
                        {investmentTypes.map(type => (
                            <label key={type} className="flex items-center p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-all duration-200">
                                <input
                                    type="checkbox"
                                    checked={formData.preferredInvestments.includes(type)}
                                    onChange={() => handleInvestmentTypeChange(type)}
                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="ml-3 text-gray-700">{type}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )
        },
        {
            id: 9,
            title: "What is your tax bracket?",
            description: "This helps in tax-efficient investment planning",
            field: "taxBracket",
            component: (
                <div className="transition-all duration-300">
                    <label className="block text-lg font-medium text-gray-800 mb-3">
                        Income Tax Bracket
                    </label>
                    <select
                        value={formData.taxBracket}
                        onChange={(e) => setFormData({...formData, taxBracket: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        required
                    >
                        <option value="">Select Tax Bracket</option>
                        <option value="0">No Tax (₹0 - ₹2.5L)</option>
                        <option value="5">5% (₹2.5L - ₹5L)</option>
                        <option value="20">20% (₹5L - ₹10L)</option>
                        <option value="30">30% (Above ₹10L)</option>
                    </select>
                </div>
            )
        },
        {
            id: 10,
            title: "What is your investment time horizon?",
            description: "Expected duration of investment",
            field: "timeHorizon",
            component: (
                <div className="transition-all duration-300">
                    <label className="block text-lg font-medium text-gray-800 mb-3">
                        Time Horizon
                    </label>
                    <select
                        value={formData.timeHorizon}
                        onChange={(e) => setFormData({...formData, timeHorizon: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        required
                    >
                        <option value="">Select Time Horizon</option>
                        <option value="short">Short Term (0-2 years)</option>
                        <option value="medium">Medium Term (2-5 years)</option>
                        <option value="long">Long Term (5+ years)</option>
                    </select>
                </div>
            )
        }
    ];

    const handleGoalChange = (goal) => {
        setFormData(prev => ({
            ...prev,
            investmentGoals: prev.investmentGoals.includes(goal)
                ? prev.investmentGoals.filter(g => g !== goal)
                : [...prev.investmentGoals, goal]
        }));
    };

    const handleInvestmentTypeChange = (type) => {
        setFormData(prev => ({
            ...prev,
            preferredInvestments: prev.preferredInvestments.includes(type)
                ? prev.preferredInvestments.filter(t => t !== type)
                : [...prev.preferredInvestments, type]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Validate required fields
            if (!formData.monthlyIncome || !formData.riskTolerance || !formData.timeHorizon) {
                alert('Please fill in all required fields');
                return;
            }
    
            // Create complete profile data
            const profileData = {
                ...formData,
                userId: 'user-' + Date.now(),
                monthlyIncome: Number(formData.monthlyIncome),
                monthlySavings: Number(formData.monthlySavings || 0),
                monthlyInvestment: Number(formData.monthlyInvestment || 0),
                investments: [] // Initialize empty investments array
            };
    
            console.log('Submitting profile data:', profileData);
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/profile`, profileData);
            
            console.log('Profile creation response:', response.data);
            
            if (response.data) {
                localStorage.setItem('userId', response.data.userId);
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error creating profile:', error.response?.data || error);
            alert('Error creating profile. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Investment Profile
                        </h2>
                        <span className="text-sm text-gray-500">
                            Question {currentStep + 1} of {questions.length}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                        />
                    </div>
                </div>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (currentStep === questions.length - 1) {
                        handleSubmit(e);
                    } else {
                        setCurrentStep(prev => prev + 1);
                    }
                }} className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {questions[currentStep].title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                            {questions[currentStep].description}
                        </p>
                        {questions[currentStep].component}
                    </div>

                    <div className="flex justify-between pt-4">
                        <button
                            type="button"
                            onClick={() => setCurrentStep(prev => prev - 1)}
                            disabled={currentStep === 0}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
                        >
                            Previous
                        </button>
                        
                        {currentStep === questions.length - 1 ? (
                            <button
                                type="submit"
                                className="w-full btn-primary"
                            >
                                Submit Profile
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                            >
                                Next
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileQuestionnaire;