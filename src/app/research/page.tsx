"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Search, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { StockChart } from "@/components/stock-chart"
import { useAuth } from "../contexts/AuthContext"
import Header from "@/components/Header"

export default function ResearchPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedStock, setSelectedStock] = useState<string | null>(null)
    const [currentStockPrice, setCurrentStockPrice] = useState({
        price: 0,
        change: 0
    });

    const auth = useAuth();

    // Mock stock data
    const popularStocks = [
        { ticker: "AAPL", name: "Apple Inc.", price: 175.5, change: 2.35 },
        { ticker: "MSFT", name: "Microsoft Corporation", price: 310.75, change: 1.2 },
        { ticker: "GOOGL", name: "Alphabet Inc.", price: 2250.25, change: -15.3 },
        { ticker: "AMZN", name: "Amazon.com, Inc.", price: 145.2, change: 0.75 },
        { ticker: "TSLA", name: "Tesla, Inc.", price: 240.5, change: -5.25 },
        { ticker: "META", name: "Meta Platforms, Inc.", price: 325.8, change: 4.6 },
    ]

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery) {
            setSelectedStock(searchQuery.toUpperCase())
        }
    }

    const handleStockSelect = (ticker: string) => {
        setSearchQuery(ticker)
        setSelectedStock(ticker)
    }

    const setPrice = (price: number, change: number) => {
        setCurrentStockPrice({
            price,
            change
        })
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header auth={auth} active="research" />
            <main className="flex-1 p-4 md:p-6">
                <h1 className="text-2xl font-bold mb-6">Stock Research</h1>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Search Stocks</CardTitle>
                                <CardDescription>Enter a ticker symbol to research</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSearch} className="space-y-4">
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="text"
                                                placeholder="Enter ticker symbol"
                                                className="pl-8"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                        <Button type="submit">Search</Button>
                                    </div>
                                </form>

                                <div className="mt-6">
                                    <h3 className="text-sm font-medium mb-2">Popular Stocks</h3>
                                    <div className="space-y-2">
                                        {popularStocks.map((stock) => (
                                            <div
                                                key={stock.ticker}
                                                className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                                                onClick={() => handleStockSelect(stock.ticker)}
                                            >
                                                <div>
                                                    <div className="font-medium">{stock.ticker}</div>
                                                    <div className="text-xs text-muted-foreground">{stock.name}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-medium">${stock.price.toFixed(2)}</div>
                                                    <div className={`text-xs ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                                                        {stock.change >= 0 ? "+" : ""}
                                                        {stock.change.toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="md:col-span-2">
                        {selectedStock ? (
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>{selectedStock}</CardTitle>
                                            <CardDescription>
                                                {popularStocks.find((s) => s.ticker === selectedStock)?.name || "Stock Information"}
                                            </CardDescription>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold">
                                                ${currentStockPrice.price}
                                            </div>
                                            <div
                                                className={`text-sm ${currentStockPrice.change >= 0 ? "text-green-600" : "text-red-600"}`}
                                            >
                                                {currentStockPrice.change >= 0 ? "+" : ""}
                                                {currentStockPrice.change.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[400px]">
                                        <StockChart ticker={selectedStock} setPrice={setPrice} />
                                    </div>

                                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-sm">Key Statistics</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-muted-foreground">Market Cap</span>
                                                        <span className="font-medium">$2.45T</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-muted-foreground">P/E Ratio</span>
                                                        <span className="font-medium">28.5</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-muted-foreground">Dividend Yield</span>
                                                        <span className="font-medium">0.55%</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-muted-foreground">52-Week High</span>
                                                        <span className="font-medium">$198.23</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-muted-foreground">52-Week Low</span>
                                                        <span className="font-medium">$124.17</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <div className="flex flex-col gap-4">
                                            <Button className="w-full">Add to Watchlist</Button>
                                            <Button className="w-full" variant="outline">
                                                View Company Profile
                                            </Button>
                                            <div className="flex gap-2">
                                                <Button className="flex-1">Buy</Button>
                                                <Button className="flex-1" variant="outline">
                                                    Sell
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="flex h-full items-center justify-center rounded-lg border border-dashed p-8">
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <Search className="h-10 w-10 text-muted-foreground" />
                                    <h3 className="text-xl font-semibold">Search for a Stock</h3>
                                    <p className="text-muted-foreground">
                                        Enter a ticker symbol to view detailed information and historical price data.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
