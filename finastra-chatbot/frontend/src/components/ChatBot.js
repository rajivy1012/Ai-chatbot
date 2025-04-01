import React, { useState, useEffect, useRef } from 'react';

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const userId = localStorage.getItem('userId');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        try {
            setIsLoading(true);
            const userMessage = { text: input, sender: 'user', type: 'TEXT' };
            setMessages(prev => [...prev, userMessage]);
            setInput('');

            const response = await fetch(`${process.env.REACT_APP_API_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: input,
                    userId: userId
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            const botResponse = {
                text: data.message,
                sender: 'bot',
                type: data.type,
                data: data.data
            };

            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, {
                text: 'Sorry, I encountered an error. Please try again.',
                sender: 'bot',
                type: 'ERROR'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const renderMessage = (msg) => {
        switch (msg.type) {
            case 'STOCK_PRICE':
                return (
                    <div className="flex flex-col">
                        <span>{msg.text}</span>
                        {msg.data && msg.data.price && (
                            <div className="mt-2 p-2 bg-gray-50 rounded-md shadow-sm">
                                <p className="text-sm font-medium">Price: ${msg.data.price['05. price']}</p>
                                <p className="text-sm">Change: {msg.data.price['09. change']}%</p>
                                <p className="text-sm">Volume: {msg.data.price['06. volume']}</p>
                            </div>
                        )}
                    </div>
                );

            case 'INVESTMENT_RECOMMENDATION':
                return (
                    <div className="flex flex-col">
                        <span className="whitespace-pre-line">{msg.text}</span>
                        {msg.data && msg.data.overview && (
                            <div className="mt-2 p-2 bg-gray-50 rounded-md shadow-sm">
                                <h4 className="text-sm font-semibold mb-1">Company Overview</h4>
                                <p className="text-sm">{msg.data.overview.Description}</p>
                            </div>
                        )}
                    </div>
                );

            default:
                return <span className="whitespace-pre-line">{msg.text}</span>;
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-4 py-3 border-b bg-gradient-to-r from-blue-500 to-blue-600">
                    <h2 className="text-lg font-semibold text-white">Finastra AI Assistant</h2>
                </div>

                <div className="h-96 overflow-y-auto p-4 bg-gray-50">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`mb-3 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
                        >
                            <div
                                className={`inline-block max-w-[70%] p-3 rounded-xl shadow-sm
                                    ${msg.sender === 'user'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white text-gray-800'
                                    }`}
                            >
                                {renderMessage(msg)}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="text-center py-2">
                            <div className="inline-block animate-spin text-blue-500">⌛</div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-3 border-t bg-white">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            placeholder="Ask about stocks, investments, or get recommendations..."
                            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={isLoading}
                            className={`px-5 py-2 rounded-lg font-medium transition-colors
                                ${isLoading
                                    ? 'bg-gray-400'
                                    : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
                                } text-white shadow-sm`}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;