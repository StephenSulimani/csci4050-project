"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, LineChart, Plus, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PortfolioChart } from "@/components/portfolio-chart"
import { BuyOrderForm } from "@/components/buy-order-form"
import { SellOrderForm } from "@/components/sell-order-form"

export default function PortfolioPage({ params }: { params: { id: string } }) {
    const [activeTab, setActiveTab] = useState("holdings")



    // Mock data for the portfolio
    const portfolio = {
        id: params.id,
        name:
            params.id === "1"
                ? "Growth Portfolio"
                : params.id === "2"
                    ? "Dividend Portfolio"
                    : params.id === "3"
                        ? "Tech Stocks"
                        : "Blue Chips",
        totalValue: params.id === "1" ? 12450.75 : params.id === "2" ? 8750.5 : params.id === "3" ? 15680.3 : 9870.45,
        startingCapital: params.id === "1" ? 10000 : params.id === "2" ? 8000 : params.id === "3" ? 12000 : 10000,
        percentReturn: params.id === "1" ? 24.51 : params.id === "2" ? 9.38 : params.id === "3" ? 30.67 : -1.3,
        cashAvailable: params.id === "1" ? 2340.25 : params.id === "2" ? 1250.5 : params.id === "3" ? 3200.1 : 4500.2,
        holdings: [
            {
                ticker: "AAPL",
                shares: 10,
                avgCost: 150.25,
                currentPrice: 175.5,
            },
            {
                ticker: "MSFT",
                shares: 5,
                avgCost: 280.1,
                currentPrice: 310.75,
            },
            {
                ticker: "GOOGL",
                shares: 3,
                avgCost: 2100.5,
                currentPrice: 2250.25,
            },
            {
                ticker: "AMZN",
                shares: 8,
                avgCost: 135.75,
                currentPrice: 145.2,
            },
        ],
    }

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                <div className="flex items-center gap-2 font-semibold">
                    <Wallet className="h-6 w-6" />
                    <span>Paper Trading App</span>
                </div>
                <nav className="ml-auto flex gap-2">
                    <Button asChild variant="ghost" size="sm">
                        <Link href="/research">Research</Link>
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                        <Link href="/">Portfolios</Link>
                    </Button>
                </nav>
            </header>
            <div className="flex items-center gap-4 border-b bg-muted/40 px-4 py-3 md:px-6">
                <Button asChild variant="ghost" size="icon">
                    <Link href="/">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Link>
                </Button>
                <h1 className="text-lg font-semibold">{portfolio.name}</h1>
            </div>
            <main className="flex-1 p-4 md:p-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                            <LineChart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                ${portfolio.totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <p className="text-xs text-muted-foreground">Current portfolio value</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Starting Capital</CardTitle>
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                $
                                {portfolio.startingCapital.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </div>
                            <p className="text-xs text-muted-foreground">Initial investment</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Return</CardTitle>
                            <LineChart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${portfolio.percentReturn >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {portfolio.percentReturn >= 0 ? "+" : ""}
                                {portfolio.percentReturn.toFixed(2)}%
                            </div>
                            <p className="text-xs text-muted-foreground">Since inception</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Cash Available</CardTitle>
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                $
                                {portfolio.cashAvailable.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </div>
                            <p className="text-xs text-muted-foreground">Available for trading</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Portfolio Performance</CardTitle>
                            <CardDescription>Historical value over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <PortfolioChart portfolioId={portfolio.id} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <div className="flex items-center justify-between">
                            <TabsList>
                                <TabsTrigger value="holdings">Holdings</TabsTrigger>
                                <TabsTrigger value="orders">Orders</TabsTrigger>
                                <TabsTrigger value="history">History</TabsTrigger>
                            </TabsList>
                            <div className="flex gap-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Buy Stock
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Buy Stock</DialogTitle>
                                            <DialogDescription>Place a buy order for a stock in your portfolio.</DialogDescription>
                                        </DialogHeader>
                                        <BuyOrderForm portfolioId={portfolio.id} cashAvailable={portfolio.cashAvailable} />
                                    </DialogContent>
                                </Dialog>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline">Sell Stock</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Sell Stock</DialogTitle>
                                            <DialogDescription>Place a sell order for a stock in your portfolio.</DialogDescription>
                                        </DialogHeader>
                                        <SellOrderForm portfolioId={portfolio.id} holdings={portfolio.holdings} />
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                        <TabsContent value="holdings" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Current Holdings</CardTitle>
                                    <CardDescription>Stocks currently in your portfolio</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Ticker</TableHead>
                                                <TableHead>Shares</TableHead>
                                                <TableHead>Avg. Cost</TableHead>
                                                <TableHead>Current Price</TableHead>
                                                <TableHead>Current Value</TableHead>
                                                <TableHead>Gain/Loss</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {portfolio.holdings.map((holding) => {
                                                const currentValue = holding.shares * holding.currentPrice
                                                const costBasis = holding.shares * holding.avgCost
                                                const gainLoss = currentValue - costBasis
                                                const gainLossPercent = (gainLoss / costBasis) * 100

                                                return (
                                                    <TableRow key={holding.ticker}>
                                                        <TableCell className="font-medium">{holding.ticker}</TableCell>
                                                        <TableCell>{holding.shares}</TableCell>
                                                        <TableCell>${holding.avgCost.toFixed(2)}</TableCell>
                                                        <TableCell>${holding.currentPrice.toFixed(2)}</TableCell>
                                                        <TableCell>${currentValue.toFixed(2)}</TableCell>
                                                        <TableCell className={gainLoss >= 0 ? "text-green-600" : "text-red-600"}>
                                                            ${gainLoss.toFixed(2)} ({gainLossPercent >= 0 ? "+" : ""}
                                                            {gainLossPercent.toFixed(2)}%)
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex gap-2">
                                                                <Dialog>
                                                                    <DialogTrigger asChild>
                                                                        <Button variant="outline" size="sm">
                                                                            Buy
                                                                        </Button>
                                                                    </DialogTrigger>
                                                                    <DialogContent>
                                                                        <DialogHeader>
                                                                            <DialogTitle>Buy {holding.ticker}</DialogTitle>
                                                                            <DialogDescription>Add more shares to your position.</DialogDescription>
                                                                        </DialogHeader>
                                                                        <BuyOrderForm
                                                                            portfolioId={portfolio.id}
                                                                            cashAvailable={portfolio.cashAvailable}
                                                                            defaultTicker={holding.ticker}
                                                                        />
                                                                    </DialogContent>
                                                                </Dialog>
                                                                <Dialog>
                                                                    <DialogTrigger asChild>
                                                                        <Button variant="outline" size="sm">
                                                                            Sell
                                                                        </Button>
                                                                    </DialogTrigger>
                                                                    <DialogContent>
                                                                        <DialogHeader>
                                                                            <DialogTitle>Sell {holding.ticker}</DialogTitle>
                                                                            <DialogDescription>Sell shares from your position.</DialogDescription>
                                                                        </DialogHeader>
                                                                        <SellOrderForm
                                                                            portfolioId={portfolio.id}
                                                                            holdings={portfolio.holdings}
                                                                            defaultTicker={holding.ticker}
                                                                        />
                                                                    </DialogContent>
                                                                </Dialog>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="orders" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Open Orders</CardTitle>
                                    <CardDescription>Your pending buy and sell orders</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-6 text-muted-foreground">No open orders at this time</div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="history" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Transaction History</CardTitle>
                                    <CardDescription>Your past trades and transactions</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Ticker</TableHead>
                                                <TableHead>Shares</TableHead>
                                                <TableHead>Price</TableHead>
                                                <TableHead>Total</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>2023-04-15</TableCell>
                                                <TableCell>Buy</TableCell>
                                                <TableCell>AAPL</TableCell>
                                                <TableCell>10</TableCell>
                                                <TableCell>$150.25</TableCell>
                                                <TableCell>$1,502.50</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>2023-04-10</TableCell>
                                                <TableCell>Buy</TableCell>
                                                <TableCell>MSFT</TableCell>
                                                <TableCell>5</TableCell>
                                                <TableCell>$280.10</TableCell>
                                                <TableCell>$1,400.50</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>2023-04-05</TableCell>
                                                <TableCell>Buy</TableCell>
                                                <TableCell>GOOGL</TableCell>
                                                <TableCell>3</TableCell>
                                                <TableCell>$2,100.50</TableCell>
                                                <TableCell>$6,301.50</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>2023-04-01</TableCell>
                                                <TableCell>Buy</TableCell>
                                                <TableCell>AMZN</TableCell>
                                                <TableCell>8</TableCell>
                                                <TableCell>$135.75</TableCell>
                                                <TableCell>$1,086.00</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    )
}
