import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
         BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { TrendingUp, ArrowDownCircle, Target } from 'lucide-react';

         const BreakthroughCalculator = () => {
            const [step, setStep] = useState(1);
            const [showYearlyDetails, setShowYearlyDetails] = useState(false);
            const [formData, setFormData] = useState({
                age: '',
                monthlyIncome: '',
                monthlyExpenses: {
                    rent: '',
                    food: '',
                    utilities: '',
                    entertainment: '',
                    fuel: '',
                    other: ''
                },
                yearlyExpenses: {
                    travel: '',
                    education: '',
                    gym: '',
                    other: ''
                },
                loans: '',
                investments: {
                    monthlyInvestmentAmount: '',
                    allocation: {
                        equity: '',
                        debt: '',
                        others: ''
                    }
                },
                currentPortfolio: '',
                expectedReturns: ''
            });
        
            const [results, setResults] = useState(null);
            const [sensitivityAnalysis, setSensitivityAnalysis] = useState(null);
            const [suggestions, setSuggestions] = useState(null);
            
            const [assumptions, setAssumptions] = useState({
                lifeExpectancy: 90,
                inflationRate: 6,
                emergencyFunds: 24,
                investmentIncrease: 10,
                sameLifestyle: true
            });
        
            const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
        
            const formatNumber = (number) => {
                return number ? number.toLocaleString() : '0';
            };
        
            const getNumber = (value) => {
                return Number(value) || 0;
            };
        
            const calculateMonthlyTotal = () => {
                const monthlyExp = Object.values(formData.monthlyExpenses).reduce(
                    (acc, val) => acc + (Number(val) || 0), 0
                );
                const yearlyExp = Object.values(formData.yearlyExpenses).reduce(
                    (acc, val) => acc + ((Number(val) || 0) / 12), 0
                );
                return monthlyExp + yearlyExp + Number(formData.loans || 0);
            };
        
            const calculateTargetWealth = () => {
                const currentAge = Number(formData.age);
                const yearlyExpenses = calculateMonthlyTotal() * 12;
                const yearsToTarget = assumptions.lifeExpectancy - currentAge;
                const inflationRate = assumptions.inflationRate / 100;
                const expectedReturns = Number(formData.expectedReturns) / 100;
            
                // Calculate the expenses needed in the final year (age 90)
                const finalYearExpenses = yearlyExpenses * Math.pow(1 + inflationRate, yearsToTarget);
            
                // Calculate required corpus using the "Safe Withdrawal Rate" method
                // Safe Withdrawal Rate = Expected Returns - Inflation
                const safeWithdrawalRate = expectedReturns - inflationRate;
                const requiredCorpus = finalYearExpenses / safeWithdrawalRate;
            
                return requiredCorpus;
            };
            
            const calculateYearByYearProjection = (overrideMonthlyInvestment = null, overrideReturns = null) => {
                const currentAge = Number(formData.age);
                const monthlyInvestment = overrideMonthlyInvestment || Number(formData.investments.monthlyInvestmentAmount);
                const yearlyInvestment = monthlyInvestment * 12;
                const currentPortfolio = Number(formData.currentPortfolio);
                const expectedReturns = overrideReturns || Number(formData.expectedReturns);
                const expectedReturnsDecimal = expectedReturns / 100;
                const inflationRate = assumptions.inflationRate / 100;
                
                const yearlyExpenses = calculateMonthlyTotal() * 12;
                const targetWealth = calculateTargetWealth();
                
                let yearlyData = [];
                let year = 0;
                let currentCorpus = currentPortfolio;
                let currentYearlyInvestment = yearlyInvestment;
                let currentYearlyExpenses = yearlyExpenses;
                let breakthroughAchieved = false;
                
                while (year < 50 && !breakthroughAchieved) {
                    // Calculate expenses for this year
                    currentYearlyExpenses = yearlyExpenses * Math.pow(1 + inflationRate, year);
                    
                    // Calculate investment returns for this year
                    const investmentReturns = currentCorpus * expectedReturnsDecimal;
                    
                    // Add this year's investment and returns to corpus
                    currentCorpus = currentCorpus + investmentReturns + currentYearlyInvestment;
                    
                    // Store data for this year
                    yearlyData.push({
                        year: currentAge + year,
                        age: currentAge + year,
                        corpus: Math.round(currentCorpus),
                        targetWealth: Math.round(targetWealth),
                        yearlyExpenses: Math.round(currentYearlyExpenses),
                        yearlyInvestment: Math.round(currentYearlyInvestment),
                        investmentReturns: Math.round(investmentReturns),
                        potentialYearlyIncome: Math.round(currentCorpus * (expectedReturnsDecimal - inflationRate))
                    });
                    
                    // Check if breakthrough achieved
                    if (currentCorpus >= targetWealth) {
                        breakthroughAchieved = true;
                    }
                    
                    // Increase next year's investment by 10%
                    currentYearlyInvestment *= (1 + assumptions.investmentIncrease / 100);
                    year++;
                }
            
                return {
                    breakthroughAge: breakthroughAchieved ? currentAge + year - 1 : null,
                    yearsNeeded: breakthroughAchieved ? year - 1 : null,
                    targetWealth,
                    finalCorpus: yearlyData[yearlyData.length - 1].corpus,
                    yearlyExpenses: yearlyData[yearlyData.length - 1].yearlyExpenses,
                    monthlyInvestment,
                    yearlyData,
                    success: breakthroughAchieved
                };
            };
            
            const performSensitivityAnalysis = () => {
                const baseInvestment = Number(formData.investments.monthlyInvestmentAmount);
                const baseReturns = Number(formData.expectedReturns);
                let analysis = [];
            
                // Test different investment amounts
                [-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50].forEach(percentChange => {
                    const newInvestment = baseInvestment * (1 + percentChange/100);
                    const result = calculateYearByYearProjection(newInvestment, baseReturns);
                    analysis.push({
                        type: 'Investment',
                        change: percentChange,
                        value: Math.round(newInvestment),
                        yearsNeeded: result.yearsNeeded || 50,
                        breakthroughAge: result.breakthroughAge || 'Not achieved',
                        success: result.success
                    });
                });
            
                // Test different return rates
                [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].forEach(pointChange => {
                    const newReturns = baseReturns + pointChange;
                    const result = calculateYearByYearProjection(null, newReturns);
                    analysis.push({
                        type: 'Returns',
                        change: pointChange,
                        value: newReturns,
                        yearsNeeded: result.yearsNeeded || 50,
                        breakthroughAge: result.breakthroughAge || 'Not achieved',
                        success: result.success
                    });
                });
            
                return analysis;
            };
        
            const generateSuggestions = (baseResult) => {
                const monthlyInvestment = Number(formData.investments.monthlyInvestmentAmount);
                const monthlyIncome = Number(formData.monthlyIncome);
                const monthlyExpenses = calculateMonthlyTotal();
                const currentAge = Number(formData.age);
                
                let suggestions = [];
        
                // If not achieved or takes too long
                if (!baseResult.success || baseResult.yearsNeeded > 30) {
                    // Suggest increasing investment
                    const availableSavings = monthlyIncome - monthlyExpenses;
                    if (monthlyInvestment < availableSavings * 0.8) {
                        const suggestedInvestment = availableSavings * 0.8;
                        const result = calculateYearByYearProjection(suggestedInvestment);
                        suggestions.push({
                            type: 'investment',
                            message: `Increase monthly investment to ₹${Math.round(suggestedInvestment).toLocaleString()}`,
                            impact: result.yearsNeeded ? 
                                `Reduces time to FI by ${baseResult.yearsNeeded - result.yearsNeeded} years` :
                                'Still insufficient for FI'
                        });
                    }
        
                    // Suggest reducing expenses
                    const reducedExpenses = monthlyExpenses * 0.8;
                    const extraInvestment = monthlyInvestment + (monthlyExpenses - reducedExpenses);
                    const resultWithReducedExp = calculateYearByYearProjection(extraInvestment);
                    suggestions.push({
                        type: 'expenses',
                        message: `Reduce monthly expenses by 20% to ₹${Math.round(reducedExpenses).toLocaleString()}`,
                        impact: resultWithReducedExp.yearsNeeded ?
                            `Reduces time to FI by ${baseResult.yearsNeeded - resultWithReducedExp.yearsNeeded} years` :
                            'Still insufficient for FI'
                    });
        
                    // Suggest aggressive portfolio if returns are low
                    if (Number(formData.expectedReturns) < 12) {
                        const resultWithHigherReturns = calculateYearByYearProjection(monthlyInvestment, 14);
                        suggestions.push({
                            type: 'returns',
                            message: 'Consider a more aggressive investment strategy targeting 14% returns',
                            impact: resultWithHigherReturns.yearsNeeded ?
                                `Reduces time to FI by ${baseResult.yearsNeeded - resultWithHigherReturns.yearsNeeded} years` :
                                'Still insufficient for FI'
                        });
                    }
                }
        
                return suggestions;
            };
        
            const calculateBreakthroughAge = () => {
                const baseResult = calculateYearByYearProjection();
                const sensitivityResults = performSensitivityAnalysis();
                const suggestionsResults = generateSuggestions(baseResult);
                
                setResults(baseResult);
                setSensitivityAnalysis(sensitivityResults);
                setSuggestions(suggestionsResults);
            };
        
            const renderProjectionChart = () => {
                if (!results?.yearlyData || results.yearlyData.length === 0) return null;
            
                return (
                    <div className="h-96 w-full">
                        <ResponsiveContainer>
                            <LineChart
                                data={results.yearlyData}
                                margin={{ top: 20, right: 30, left: 80, bottom: 60 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="age" 
                                    label={{ 
                                        value: 'Your Age', 
                                        position: 'bottom',
                                        offset: 40 
                                    }}
                                    tick={{ dy: 10 }}
                                />
                                <YAxis 
                                    tickFormatter={value => `₹${(value/100000).toFixed(1)}L`}
                                    label={{ 
                                        value: 'Amount (in Lakhs)', 
                                        angle: -90, 
                                        position: 'left',
                                        offset: -60 
                                    }}
                                />
                                <Tooltip 
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0]?.payload || {};
                                            return (
                                                <div className="bg-white p-4 border rounded shadow">
                                                    <p className="font-semibold">Age: {label} years</p>
                                                    {payload.map((entry, index) => (
                                                        <div key={index} className="text-sm">
                                                            <p style={{ color: entry.color }}>
                                                                {entry.dataKey === 'corpus' ? 'Your Wealth: ' : 'Target Wealth: '}
                                                                ₹{Number(entry.value || 0).toLocaleString()}
                                                            </p>
                                                            {entry.dataKey === 'corpus' && (
                                                                <div className="text-gray-600 text-xs mt-1">
                                                                    Yearly Investment: ₹{Number(data.yearlyInvestment || 0).toLocaleString()}<br/>
                                                                    Investment Returns: ₹{Number(data.investmentReturns || 0).toLocaleString()}
                                                                </div>
                                                            )}
                                                            {entry.dataKey === 'targetWealth' && (
                                                                <div className="text-gray-600 text-xs mt-1">
                                                                    Yearly Expenses: ₹{Number(data.yearlyExpenses || 0).toLocaleString()}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Legend 
                                    verticalAlign="top" 
                                    height={36}
                                    formatter={(value) => (
                                        <span className="text-sm">
                                            {value === 'corpus' ? 'Your Growing Wealth' : 'Target Wealth Required'}
                                        </span>
                                    )}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="corpus" 
                                    name="corpus"
                                    stroke="#82ca9d" 
                                    strokeWidth={2}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="targetWealth" 
                                    name="targetWealth"
                                    stroke="#8884d8" 
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                );
            };

            const renderYearByYearTable = () => {
                if (!results?.yearlyData) return null;
        
                return (
                    <div className="mt-6 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Age
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Corpus
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Required
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Yearly Investment
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Investment Returns
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Yearly Expenses
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {results.yearlyData.map((data, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {data.age}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ₹{data.corpus.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ₹{data.requiredCorpus.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ₹{data.yearlyInvestment.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ₹{data.investmentReturns.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ₹{data.yearlyExpenses.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            };
        
            const renderSensitivityAnalysis = () => {
                if (!sensitivityAnalysis) return null;
        
                const investmentAnalysis = sensitivityAnalysis.filter(a => a.type === 'Investment');
                const returnsAnalysis = sensitivityAnalysis.filter(a => a.type === 'Returns');
        
                return (
                    <div className="mt-6 space-y-6">
                        <h4 className="text-lg font-semibold">Sensitivity Analysis</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <h5 className="font-medium">Impact of Monthly Investment Changes</h5>
                                <div className="h-64">
                                    <ResponsiveContainer>
                                        <BarChart
                                            data={investmentAnalysis}
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis 
                                                dataKey="change" 
                                                label={{ value: 'Change in Investment (%)', position: 'bottom' }}
                                            />
                                            <YAxis 
                                                label={{ value: 'Years to FI', angle: -90, position: 'left' }}
                                            />
                                            <Tooltip
                                                formatter={(value, name, props) => [
                                                    `${value} years`,
                                                    `Monthly: ₹${props.payload.value.toLocaleString()}`
                                                ]}
                                            />
                                            <Bar dataKey="yearsNeeded" fill="#8884d8">
                                                {investmentAnalysis.map((entry, index) => (
                                                    <Cell 
                                                        key={`cell-${index}`}
                                                        fill={entry.success ? '#82ca9d' : '#ff8042'}
                                                    />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
        
                            <div className="space-y-2">
                                <h5 className="font-medium">Impact of Return Rate Changes</h5>
                                <div className="h-64">
                                    <ResponsiveContainer>
                                        <BarChart
                                            data={returnsAnalysis}
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis 
                                                dataKey="change" 
                                                label={{ value: 'Change in Returns (%)', position: 'bottom' }}
                                            />
                                            <YAxis 
                                                label={{ value: 'Years to FI', angle: -90, position: 'left' }}
                                            />
                                            <Tooltip
                                                formatter={(value, name, props) => [
                                                    `${value} years`,
                                                    `Returns: ${props.payload.value}%`
                                                ]}
                                            />
                                            <Bar dataKey="yearsNeeded" fill="#8884d8">
                                                {returnsAnalysis.map((entry, index) => (
                                                    <Cell 
                                                        key={`cell-${index}`}
                                                        fill={entry.success ? '#82ca9d' : '#ff8042'}
                                                    />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            };
        
            const renderSuggestions = () => {
                if (!suggestions || suggestions.length === 0) return null;
        
                return (
                    <div className="mt-6 space-y-4">
                        <h4 className="text-lg font-semibold">Suggestions to Achieve FI Faster</h4>
                        <div className="space-y-3">
                            {suggestions.map((suggestion, index) => (
                                <div key={index} className="bg-blue-50 p-4 rounded-lg">
                                    <p className="font-medium text-blue-900">{suggestion.message}</p>
                                    <p className="text-sm text-blue-700 mt-1">{suggestion.impact}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            };

            const renderInvestmentPieChart = () => {
                const { equity, debt, others } = formData.investments.allocation;
                const data = [
                    { name: 'Equity', value: Number(equity) || 0 },
                    { name: 'Debt', value: Number(debt) || 0 },
                    { name: 'Others', value: Number(others) || 0 }
                ];
        
                return (
                    <div className="h-64 w-full">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                );
            };
        
            const renderExpensePieChart = () => {
                const monthlyTotal = calculateMonthlyTotal();
                const monthlySavings = Number(formData.monthlyIncome) - monthlyTotal;
        
                const data = [
                    { name: 'Available for Savings', value: monthlySavings },
                    { name: 'Total Expenses', value: monthlyTotal }
                ];
        
                return (
                    <div className="h-64 w-full">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                );
            };
        
    // Update the final results case to include all new components
    const renderStep = () => {
        switch(step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Basic Information</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Current Age</label>
                                <input
                                    type="number"
                                    value={formData.age}
                                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Monthly Income (after tax)</label>
                                <input
                                    type="number"
                                    value={formData.monthlyIncome}
                                    onChange={(e) => setFormData({...formData, monthlyIncome: e.target.value})}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            onClick={() => setStep(2)}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Next
                        </button>
                    </div>
                );
    
            case 2:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Monthly Expenses</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.keys(formData.monthlyExpenses).map((expense) => (
                                <div key={expense}>
                                    <label className="block text-sm font-medium text-gray-700 capitalize">
                                        {expense}
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.monthlyExpenses[expense]}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            monthlyExpenses: {
                                                ...formData.monthlyExpenses,
                                                [expense]: e.target.value
                                            }
                                        })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between">
                            <button
                                onClick={() => setStep(1)}
                                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                );
    
            case 3:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Yearly Expenses</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.keys(formData.yearlyExpenses).map((expense) => (
                                <div key={expense}>
                                    <label className="block text-sm font-medium text-gray-700 capitalize">
                                        {expense}
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.yearlyExpenses[expense]}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            yearlyExpenses: {
                                                ...formData.yearlyExpenses,
                                                [expense]: e.target.value
                                            }
                                        })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            ))}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Monthly Loan/EMI Payments</label>
                            <input
                                type="number"
                                value={formData.loans}
                                onChange={(e) => setFormData({...formData, loans: e.target.value})}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex justify-between">
                            <button
                                onClick={() => setStep(2)}
                                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setStep(4)}
                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                );
    
            case 4:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Expense Summary</h3>
                        <div className="mt-4">
                            <p className="font-medium">Monthly Income: ₹{Number(formData.monthlyIncome).toLocaleString()}</p>
                            <p className="font-medium">Total Monthly Expenses: ₹{calculateMonthlyTotal().toLocaleString()}</p>
                            <p className="font-medium">Available for Savings: ₹{(Number(formData.monthlyIncome) - calculateMonthlyTotal()).toLocaleString()}</p>
                        </div>
                        <div className="flex justify-between">
                            <button
                                onClick={() => setStep(3)}
                                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setStep(5)}
                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                );
    
                case 5:
                    return (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Investment Plan</h3>
                            
                            {/* Monthly Investment Amount */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Monthly Investment Amount</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">₹</span>
                                    </div>
                                    <input
                                        type="number"
                                        value={formData.investments?.monthlyInvestmentAmount}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            investments: {
                                                ...formData.investments,
                                                monthlyInvestmentAmount: e.target.value
                                            }
                                        })}
                                        className="mt-1 block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="0"
                                        required
                                    />
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                    Available for investment: ₹{(Number(formData.monthlyIncome) - calculateMonthlyTotal()).toLocaleString()}
                                </p>
                            </div>
                
                            {/* Current Portfolio Value */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Current Total Portfolio Value</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">₹</span>
                                    </div>
                                    <input
                                        type="number"
                                        value={formData.currentPortfolio}
                                        onChange={(e) => setFormData({...formData, currentPortfolio: e.target.value})}
                                        className="mt-1 block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="0"
                                        required
                                    />
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                    Total value of all your current investments
                                </p>
                            </div>
                            
                            {/* Expected Returns */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Expected Returns (% per annum)</label>
                                <select
                                    value={formData.expectedReturns}
                                    onChange={(e) => setFormData({...formData, expectedReturns: e.target.value})}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select expected returns</option>
                                    <option value="6">6% (Conservative - Mostly FD)</option>
                                    <option value="10">10% (Moderate - Mix of FD, MF, Stocks)</option>
                                    <option value="14">14% (Aggressive - Mostly MF and Stocks)</option>
                                </select>
                            </div>
                
                            {/* Investment Strategy Info */}
                            <div className="bg-blue-50 p-4 rounded-lg mt-4">
                                <h4 className="font-medium text-blue-900 mb-2">Investment Strategy Guide</h4>
                                <ul className="list-disc pl-5 space-y-1 text-sm text-blue-800">
                                    <li>Conservative (6%): Lower risk, suitable for short-term goals</li>
                                    <li>Moderate (10%): Balanced approach for medium-term goals</li>
                                    <li>Aggressive (14%): Higher risk, better for long-term growth</li>
                                </ul>
                            </div>
                
                            <div className="flex justify-between">
                                <button
                                    onClick={() => setStep(4)}
                                    className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setStep(6)}
                                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    );
                
        case 6:
            return (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Assumptions & Advanced Settings</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            {/* Life Expectancy */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Life Expectancy (years)
                                </label>
                                <input
                                    type="number"
                                    min="50"
                                    max="120"
                                    value={assumptions.lifeExpectancy}
                                    onChange={(e) => setAssumptions({
                                        ...assumptions,
                                        lifeExpectancy: Number(e.target.value)
                                    })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Plan for longer life expectancy for safety margin
                                </p>
                            </div>

                            {/* Inflation Rate */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Inflation Rate (%)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="20"
                                    step="0.1"
                                    value={assumptions.inflationRate}
                                    onChange={(e) => setAssumptions({
                                        ...assumptions,
                                        inflationRate: Number(e.target.value)
                                    })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Historical average is 6-7%
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Emergency Fund */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Emergency Fund (months)
                                </label>
                                <input
                                    type="number"
                                    min="3"
                                    max="48"
                                    value={assumptions.emergencyFunds}
                                    onChange={(e) => setAssumptions({
                                        ...assumptions,
                                        emergencyFunds: Number(e.target.value)
                                    })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Recommended: 12-24 months for FI
                                </p>
                            </div>

                            {/* Investment Increase */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Yearly Investment Increase (%)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="50"
                                    value={assumptions.investmentIncrease}
                                    onChange={(e) => setAssumptions({
                                        ...assumptions,
                                        investmentIncrease: Number(e.target.value)
                                    })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Expected yearly increase in your investment amount
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Impact Information */}
                    <div className="bg-blue-50 p-4 rounded-lg mt-6">
                        <h4 className="font-medium text-blue-900 mb-2">Impact of Assumptions</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-blue-800">
                            <li>Higher life expectancy increases required corpus</li>
                            <li>Higher inflation rate means you need more savings</li>
                            <li>More emergency funds provide better security</li>
                            <li>Regular investment increases speed up FI journey</li>
                        </ul>
                    </div>

                    <div className="flex justify-between">
                        <button
                            onClick={() => setStep(5)}
                            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => {
                                calculateBreakthroughAge();
                                setStep(7);
                            }}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Calculate
                        </button>
                    </div>
                </div>
            );

            case 7:
                if (!results?.yearlyData) {
                    return (
                        <div className="text-center py-8">
                            <p className="text-gray-600">Please complete all previous steps to see your results.</p>
                            <button
                                onClick={() => setStep(1)}
                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Start Over
                            </button>
                        </div>
                    );
                }
    
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-center">Your Financial Independence Analysis</h3>
                        
                        <div className="bg-blue-50 p-6 rounded-lg">
                            {results.breakthroughAge ? (
                                <>
                                    <h4 className="text-xl font-semibold text-blue-900 mb-4">
                                        Your Financial Freedom Age: {results.breakthroughAge} years
                                    </h4>
                                    <p className="text-blue-800">
                                        You will achieve financial freedom in {results.yearsNeeded} years
                                    </p>
                                </>
                            ) : (
                                <h4 className="text-xl font-semibold text-red-900 mb-4">
                                    Financial freedom not achievable within 50 years with current plan
                                </h4>
                            )}
                        </div>
    
                        {/* Render the chart */}
                        {renderProjectionChart()}
                        
                        {/* Current Situation */}
                        <div className="mb-6 p-4 bg-blue-50 rounded">
                            <h5 className="font-medium mb-2">Your Current Situation</h5>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-600">Current Yearly Expenses</p>
                                    <p className="font-medium">₹{(calculateMonthlyTotal() * 12).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Current Portfolio</p>
                                    <p className="font-medium">₹{Number(formData.currentPortfolio || 0).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Monthly Investment</p>
                                    <p className="font-medium">₹{Number(formData.investments?.monthlyInvestmentAmount || 0).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
    
                        {/* Target and Final Numbers */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h5 className="font-semibold mb-2">Target Wealth</h5>
                                <p className="text-2xl">₹{Math.round(results.targetWealth || 0).toLocaleString()}</p>
                                <p className="text-sm text-gray-600">Total wealth needed for financial freedom</p>
                                <ul className="list-disc pl-5 mt-2 text-sm text-gray-600">
                                    <li>Expected Returns: {formData.expectedReturns}%</li>
                                    <li>Inflation: {assumptions.inflationRate}%</li>
                                    <li>Real Returns: {Number(formData.expectedReturns) - assumptions.inflationRate}%</li>
                                </ul>
                            </div>
                            
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h5 className="font-semibold mb-2">Final Numbers at Age {results.breakthroughAge || 'N/A'}</h5>
                                <div className="space-y-2">
                                    {results.yearlyData && results.yearlyData.length > 0 && (
                                        <>
                                            <p>
                                                <span className="text-gray-600">Final Portfolio: </span>
                                                <span className="font-medium">₹{Math.round(results.yearlyData[results.yearlyData.length - 1].corpus || 0).toLocaleString()}</span>
                                            </p>
                                            <p>
                                                <span className="text-gray-600">Yearly Returns: </span>
                                                <span className="font-medium">₹{Math.round(results.yearlyData[results.yearlyData.length - 1].investmentReturns || 0).toLocaleString()}</span>
                                            </p>
                                            <p>
                                                <span className="text-gray-600">Yearly Expenses: </span>
                                                <span className="font-medium">₹{Math.round(results.yearlyData[results.yearlyData.length - 1].yearlyExpenses || 0).toLocaleString()}</span>
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
    
                        {/* Year by Year Details Button */}
                        <button
                            onClick={() => setShowYearlyDetails(prev => !prev)}
                            className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded flex justify-between items-center"
                        >
                            <span>View Year-by-Year Details</span>
                            <span>{showYearlyDetails ? '▼' : '▶'}</span>
                        </button>
    
                        {/* Year by Year Details Table */}
                        {showYearlyDetails && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Portfolio Value</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Yearly Returns</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Yearly Expenses</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {results.yearlyData.map((year, index) => (
                                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="px-4 py-2 text-sm">{year.age || 0}</td>
                                                <td className="px-4 py-2 text-sm">₹{(year.corpus || 0).toLocaleString()}</td>
                                                <td className="px-4 py-2 text-sm">₹{(year.investmentReturns || 0).toLocaleString()}</td>
                                                <td className="px-4 py-2 text-sm">₹{(year.yearlyExpenses || 0).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                      
{/* Sensitivity Analysis Section */}
<div className="mt-8">
  <h4 className="text-xl font-semibold mb-4">Sensitivity Analysis</h4>
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Investment Amount Impact */}
    <div className="bg-white p-6 rounded-lg shadow-lg border">
      <h5 className="text-lg font-medium mb-4">Impact of Investment Changes</h5>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sensitivityAnalysis?.filter(a => a.type === 'Investment') || []}
            margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="change" 
              label={{ value: 'Change in Monthly Investment (%)', position: 'bottom' }}
            />
            <YAxis label={{ value: 'Years to FI', angle: -90, position: 'left' }} />
            <Tooltip
              formatter={(value, name, props) => [
                `${value} years`,
                `Monthly: ₹${props.payload.value.toLocaleString()}`
              ]}
            />
            <Bar dataKey="yearsNeeded" fill="#2563eb">
              {(sensitivityAnalysis?.filter(a => a.type === 'Investment') || []).map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.success ? '#16a34a' : '#dc2626'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>Green bars indicate successful scenarios that achieve FI</p>
        <p>Red bars indicate scenarios where FI takes longer than 50 years</p>
      </div>
    </div>

    {/* Return Rate Impact */}
    <div className="bg-white p-6 rounded-lg shadow-lg border">
      <h5 className="text-lg font-medium mb-4">Impact of Return Rate Changes</h5>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sensitivityAnalysis?.filter(a => a.type === 'Returns') || []}
            margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="change" 
              label={{ value: 'Change in Return Rate (%)', position: 'bottom' }}
            />
            <YAxis label={{ value: 'Years to FI', angle: -90, position: 'left' }} />
            <Tooltip
              formatter={(value, name, props) => [
                `${value} years`,
                `Returns: ${props.payload.value}%`
              ]}
            />
            <Bar dataKey="yearsNeeded" fill="#2563eb">
              {(sensitivityAnalysis?.filter(a => a.type === 'Returns') || []).map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.success ? '#16a34a' : '#dc2626'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>See how small changes in return rates can significantly impact your FI timeline</p>
      </div>
    </div>
  </div>
</div>

{/* Suggestions Section */}
<div className="mt-8">
  <h4 className="text-xl font-semibold mb-4">Path to Earlier Financial Independence</h4>
  {suggestions && suggestions.length > 0 ? (
    <div className="space-y-4">
      {suggestions.map((suggestion, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-lg border">
          <div className="flex items-start space-x-4">
            <div className={`p-2 rounded-full ${
              suggestion.type === 'investment' 
                ? 'bg-blue-100 text-blue-500'
                : suggestion.type === 'expenses'
                ? 'bg-green-100 text-green-500'
                : 'bg-purple-100 text-purple-500'
            }`}>
              {suggestion.type === 'investment' ? (
                <TrendingUp className="h-6 w-6" />
              ) : suggestion.type === 'expenses' ? (
                <ArrowDownCircle className="h-6 w-6" />
              ) : (
                <Target className="h-6 w-6" />
              )}
            </div>
            <div>
              <h5 className="font-medium text-lg">{suggestion.message}</h5>
              <p className="text-gray-600 mt-1">{suggestion.impact}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="bg-white p-6 rounded-lg shadow-lg border">
      <p className="text-gray-600">
        Your current plan is well optimized for achieving financial independence.
        Continue to stay consistent with your investments and monitor your progress regularly.
      </p>
    </div>
  )}
</div>
                        {/* Action Buttons */}
                        <div className="flex justify-between mt-6">
                            <button
                                onClick={() => setStep(1)}
                                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                            >
                                Recalculate
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                            >
                                Print Report
                            </button>
                        </div>
                    </div>
                );
    
            default:
                return null;
        }
    };
    
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center mb-8">Financial Independence Calculator</h2>
            <div className="bg-white rounded-lg shadow-lg p-6">
                {renderStep()}
            </div>
        </div>
    );
};

export default BreakthroughCalculator;