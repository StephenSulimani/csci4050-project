'use client'

import { StockChart } from '@/components/StockChart';
import { useState } from 'react';

export default function StockTickerPage() {
    const [ticker, setTicker] = useState('AAPL');
    const [currentTicker, setCurrentTicker] = useState('AAPL');

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setCurrentTicker(ticker);
    };

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Stock Ticker Viewer</h1>

                <div className="p-6 rounded-lg shadow-sm mb-6">
                    <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={ticker}
                                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                                placeholder="Enter stock ticker (e.g. AAPL)"
                                className="w-full px-4 py-2 border rounded-md"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                        >
                            Update
                        </button>
                    </form>

                    <div className="p-4 rounded-md">
                        <p className="mb-4 font-medium">Currently viewing: {currentTicker}</p>

                        {/* Stock Chart Component */}
                        <StockChart ticker={currentTicker} />
                    </div>
                </div>
            </div>
        </div>
    );
}
