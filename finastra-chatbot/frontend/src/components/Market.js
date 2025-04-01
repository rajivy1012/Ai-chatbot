// frontend/src/components/Market.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Market = () => {
    const [marketData, setMarketData] = useState({
        indices: {
            nifty: null,
            sensex: null
        },
        selectedStock: null,
        stockHistory: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [watchlist, setWatchlist] = useState([]);

    const popularStocks = [
        { symbol: 'TCS.BO', name: 'Tata Consultancy Services' },
        { symbol: 'RELIANCE.BO', name: 'Reliance Industries' },
        { symbol: 'HDFCBANK.BO', name: 'HDFC Bank' },
        { symbol: 'INFY.BO', name: 'Infosys' },
        { symbol: 'ITC.BO', name: 'ITC' },
        { symbol: 'ICICIBANK.BO', name: 'ICICI Bank' }
    ];

    const addToWatchlist = (stock) => {
        if (!watchlist.find(item => item.symbol === stock.symbol)) {
            setWatchlist(prevWatchlist => [...prevWatchlist, stock]);
        }
    };

    const removeFromWatchlist = (symbol) => {
        setWatchlist(prevWatchlist => prevWatchlist.filter(stock => stock.symbol !== symbol));
    };

    const fetchMarketData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/market/indices`);
            setMarketData(prev => ({
                ...prev,
                indices: response.data
            }));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching market data:', error);
            setError('Failed to load market data');
            setLoading(false);
        }
    };

    const fetchStockData = async (symbol) => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/market/stock/${symbol}`);
            setMarketData(prev => ({
                ...prev,
                selectedStock: response.data
            }));
        } catch (error) {
            console.error('Error fetching stock data:', error);
            setError(`Failed to load data for ${symbol}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
        
        try {
            setSearchLoading(true);
            const response = await axios.get(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${process.env.REACT_APP_ALPHA_VANTAGE_API_KEY}`);
            setSearchResults(response.data.bestMatches || []);
        } catch (error) {
            console.error('Error searching stocks:', error);
            setError('Failed to search stocks');
        } finally {
            setSearchLoading(false);
        }
    };
    
    useEffect(() => {
        const savedWatchlist = localStorage.getItem('watchlist');
        if (savedWatchlist) {
            setWatchlist(JSON.parse(savedWatchlist));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }, [watchlist]);
    
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery) {
                handleSearch(searchQuery);
            }
        }, 300);
    
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    useEffect(() => {
        fetchMarketData();
        const interval = setInterval(fetchMarketData, 5000);
        return () => clearInterval(interval);
    }, []);

    const formatNumber = (number) => {
        if (!number) return '0';
        return new Intl.NumberFormat('en-IN').format(number);
    };

    const formatPercentage = (number) => {
        if (!number) return '0%';
        return `${Number(number).toFixed(2)}%`;
    };

    return (
        <div className="space-y-6">
            {/* Search Section */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Search Stocks</h2>
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for stocks (e.g., RELIANCE, TCS, HDFC)"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    
                    {searchLoading && (
                        <div className="absolute right-3 top-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        </div>
                    )}
                    
                    {searchResults.length > 0 && (
                        <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                            {searchResults.map((result) => (
                                <div
                                    key={result['1. symbol']}
                                    className="p-3 hover:bg-gray-50 border-b last:border-b-0"
                                >
                                    <div className="flex justify-between items-center">
                                        <div 
                                            className="cursor-pointer flex-grow"
                                            onClick={() => {
                                                fetchStockData(result['1. symbol']);
                                                setSearchQuery('');
                                                setSearchResults([]);
                                            }}
                                        >
                                            <div className="font-semibold">{result['1. symbol']}</div>
                                            <div className="text-sm text-gray-600">{result['2. name']}</div>
                                        </div>
                                        <button 
                                            className={`px-3 py-1 rounded-full text-sm ${
                                                watchlist.some(item => item.symbol === result['1. symbol'])
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                            }`}
                                            onClick={() => {
                                                if (!watchlist.some(item => item.symbol === result['1. symbol'])) {
                                                    addToWatchlist({
                                                        symbol: result['1. symbol'],
                                                        name: result['2. name']
                                                    });
                                                }
                                            }}
                                        >
                                            {watchlist.some(item => item.symbol === result['1. symbol']) 
                                                ? 'Added' 
                                                : 'Add to Watchlist'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Popular Stocks */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Popular Stocks</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {popularStocks.map(stock => (
                        <button
                            key={stock.symbol}
                            onClick={() => {
                                fetchStockData(stock.symbol);
                                addToWatchlist(stock);
                            }}
                            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                        >
                            <p className="font-semibold">{stock.name}</p>
                            <p className="text-sm text-gray-600">{stock.symbol}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Watchlist Section */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Your Watchlist</h2>
                {watchlist.length === 0 ? (
                    <p className="text-gray-500">Search and add stocks to create your watchlist</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {watchlist.map(stock => (
                            <div key={stock.symbol} 
                                className="p-4 border rounded-lg flex justify-between items-center">
                                <div className="flex-1">
                                    <p className="font-semibold">{stock.name}</p>
                                    <p className="text-sm text-gray-600">{stock.symbol}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => fetchStockData(stock.symbol)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => removeFromWatchlist(stock.symbol)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Selected Stock Details */}
            {marketData.selectedStock && (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-2xl font-bold">
                                {marketData.selectedStock.overview?.Symbol || marketData.selectedStock.price?.['01. symbol']}
                            </h2>
                            <p className="text-gray-600">{marketData.selectedStock.overview?.Name}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold">
                                ₹{formatNumber(marketData.selectedStock.price?.['05. price'])}
                            </p>
                            <p className={`text-lg ${
                                parseFloat(marketData.selectedStock.price?.['09. change']) >= 0 
                                    ? 'text-green-500' 
                                    : 'text-red-500'
                            }`}>
                                {marketData.selectedStock.price?.['09. change']} 
                                ({formatPercentage(marketData.selectedStock.price?.['10. change percent'])})
                            </p>
                        </div>
                    </div>

                    {/* Stock Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                            <p className="text-sm text-gray-600">Open</p>
                            <p className="font-semibold">
                                ₹{formatNumber(marketData.selectedStock.price?.['02. open'])}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">High</p>
                            <p className="font-semibold">
                                ₹{formatNumber(marketData.selectedStock.price?.['03. high'])}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Low</p>
                            <p className="font-semibold">
                                ₹{formatNumber(marketData.selectedStock.price?.['04. low'])}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Volume</p>
                            <p className="font-semibold">
                                {formatNumber(marketData.selectedStock.price?.['06. volume'])}
                            </p>
                        </div>
                    </div>

                    {/* Additional Stock Information */}
                    {marketData.selectedStock.overview && (
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold mb-2">Company Information</h3>
                                <p className="text-sm text-gray-600">{marketData.selectedStock.overview.Description}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold mb-2">Key Metrics</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <p className="text-sm text-gray-600">Market Cap</p>
                                        <p className="font-semibold">₹{formatNumber(marketData.selectedStock.overview.MarketCapitalization)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">P/E Ratio</p>
                                        <p className="font-semibold">{marketData.selectedStock.overview.PERatio}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">52 Week High</p>
                                        <p className="font-semibold">₹{formatNumber(marketData.selectedStock.overview['52WeekHigh'])}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">52 Week Low</p>
                                        <p className="font-semibold">₹{formatNumber(marketData.selectedStock.overview['52WeekLow'])}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Loading and Error States */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="text-center mt-4">Loading market data...</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}
        </div>
    );
};

export default Market;