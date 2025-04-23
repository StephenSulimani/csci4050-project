"use client"

import Link from "next/link"
import { ArrowUpRight, DollarSign, TrendingUp, Wallet, ArrowLeft, LineChart, Plus, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"
import { IPortfolio } from "../api/portfolio/route"
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
import { CreatePortfolioForm } from "@/components/create-portfolio-form"

const totalReturn = (portfolio: IPortfolio) => {
    return ((portfolio.total_value - portfolio.starting_capital) / portfolio.starting_capital) * 100
}


export default function DashboardPage() {
    const router = useRouter();
    const auth = useAuth();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        console.log(auth.loggedIn);
        if (!auth.loading && !auth.loggedIn) {
            router.push('/login');
        }
    }, [auth.loggedIn, auth.loading, router])

    const [portfolios, setPortfolios] = useState<IPortfolio[]>([]);
    const [currentPortfolio, setCurrentPortfolio] = useState<IPortfolio | null>(null);

    const [deleteSemaphore, setDeleteSemaphore] = useState(false);

    const [showingPortfolio, setShowingPortfolio] = useState<boolean>(false);

    useEffect(() => {
        async function fetchPortfolios() {
            const response = await fetch('/api/portfolio', {
                method: 'GET',
                credentials: "include"
            });
            const data = await response.json();
            setPortfolios(data.message.portfolios);
        }
        fetchPortfolios();
        console.log('fetching portfolios!')
    }, [open, deleteSemaphore])

    useEffect(() => {
        if (showingPortfolio && currentPortfolio) {
            setCurrentPortfolio(portfolios.filter(portfolio => portfolio.id === currentPortfolio.id)[0]);
        }
    }, [showingPortfolio, portfolios, currentPortfolio])

    // Mock data for portfolios
    //

    const deletePortfolio = async (id: string) => {
        const response = await fetch(`/api/portfolio/${id}`, {
            method: 'DELETE',
            credentials: "include"
        });

        setPortfolios(portfolios.filter(portfolio => portfolio.id !== id))


        setDeleteSemaphore(!deleteSemaphore);

        console.log('deletin')
    }


    const mainMenu = () => {
        setShowingPortfolio(false);
    }

    if (showingPortfolio && currentPortfolio) {
        return (
            <PortfolioView portfolio={currentPortfolio} mainMenu={mainMenu} updateState={() => setDeleteSemaphore(!deleteSemaphore)} />
        )
    }


    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                <div className="flex items-center gap-2 font-semibold">
                    <Wallet className="h-6 w-6" />
                    <span>Gnail Trades</span>
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
            <main className="flex-1 p-4 md:p-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                $
                                {portfolios
                                    .reduce((sum, portfolio) => sum + portfolio.total_value, 0)
                                    .toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <p className="text-xs text-muted-foreground">Across {portfolios.length} portfolios</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Starting Capital</CardTitle>
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                $
                                {portfolios
                                    .reduce((sum, portfolio) => sum + portfolio.starting_capital, 0)
                                    .toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <p className="text-xs text-muted-foreground">Initial investment</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Average Return</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {(portfolios.reduce((sum, portfolio) => sum + totalReturn(portfolio), 0) / portfolios.length).toFixed(
                                    2,
                                )}
                                %
                            </div>
                            <p className="text-xs text-muted-foreground">Across all portfolios</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Cash Available</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                $
                                {portfolios
                                    .reduce((sum, portfolio) => sum + portfolio.cash, 0)
                                    .toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <p className="text-xs text-muted-foreground">Available for trading</p>
                        </CardContent>
                    </Card>
                </div>
                <h2 className="mt-8 mb-4 text-xl font-semibold">Your Portfolios</h2>
                <Dialog open={open} onOpenChange={(e) => setOpen(e.open)}>
                    <DialogTrigger asChild>
                        <Button className="my-3">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Portfolio
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Portfolio</DialogTitle>
                        </DialogHeader>
                        <CreatePortfolioForm close={() => setOpen(false)} />
                    </DialogContent>
                </Dialog>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {portfolios.map((portfolio) => (
                        <Card key={portfolio.id}>
                            <CardHeader>
                                <CardTitle>
                                    <div className="flex flex-row justify-between">
                                        <span>{portfolio.name}</span>
                                        <Trash className="h-4 w-4 cursor-pointer hover:text-red-600 transition duration-300" onClick={() => deletePortfolio(portfolio.id)} />
                                    </div>
                                </CardTitle>
                                <CardDescription>
                                    Started with $
                                    {portfolio.starting_capital.toLocaleString("en-US", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Total Value:</span>
                                        <span className="font-bold">
                                            $
                                            {portfolio.total_value.toLocaleString("en-US", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Return:</span>
                                        <span className={`font-bold ${totalReturn(portfolio) >= 0 ? "text-green-600" : "text-red-600"}`}>
                                            {totalReturn(portfolio) >= 0 ? "+" : ""}
                                            {totalReturn(portfolio).toFixed(2)}%
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Cash Available:</span>
                                        <span className="font-bold">
                                            $
                                            {portfolio.cash.toLocaleString("en-US", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full" onClick={() => {
                                    setCurrentPortfolio(portfolio);
                                    setShowingPortfolio(true);
                                }}>
                                    <span>
                                        View Portfolio <ArrowUpRight className="ml-2 h-4 w-4" />
                                    </span>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    )
}

function PortfolioView(props: { portfolio: IPortfolio, mainMenu: () => void, updateState: () => void }) {
    const portfolio = props.portfolio;
    const [activeTab, setActiveTab] = useState("holdings")
    const [buyOpen, setBuyOpen] = useState(false);
    const [sellOpen, setSellOpen] = useState(false);
    const [buyPerOpen, setBuyPerOpen] = useState(
        portfolio.stocks.reduce((acc, item) => {
            acc[item.ticker] = false;
            return acc;
        })
    );
    const [sellPerOpen, setSellPerOpen] = useState(
        portfolio.stocks.reduce((acc, item) => {
            acc[item.ticker] = false;
            return acc;
        })
    );

    const updateSellPerOpen = (ticker: str) => {
        const updated = sellPerOpen;
        // If ticker is in updated
        if (updated[ticker]) {
            updated[ticker] = !updated[ticker];

        }

        setSellPerOpen(updated);
    }

    const updateBuyPerOpen = (ticker: str) => {
        const updated = buyPerOpen;
        if (updated[ticker]) {

            updated[ticker] = !updated[ticker];
        }
        setBuyPerOpen(updated);
    }

    const { updateState } = props;

    useEffect(() => {
        //updateState();
        /*setBuyPerOpen(
            portfolio.stocks.reduce((acc, item) => {
                acc[item.ticker] = false;
                return acc;
            }))
        setSellPerOpen(
            portfolio.stocks.reduce((acc, item) => {
                acc[item.ticker] = false;
                return acc;
            })
        )*/
    }, [buyOpen, sellOpen, sellPerOpen, buyPerOpen])

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                <div className="flex items-center gap-2 font-semibold">
                    <Wallet className="h-6 w-6" />
                    <span>Gnail Trades</span>
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
                <Button asChild variant="ghost" size="icon" onClick={props.mainMenu}>
                    <div>
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>

                    </div>
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
                                ${portfolio.total_value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                                {portfolio.starting_capital.toLocaleString("en-US", {
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
                            <div className={`text-2xl font-bold ${totalReturn(portfolio) >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {totalReturn(portfolio) >= 0 ? "+" : ""}
                                {totalReturn(portfolio).toFixed(2)}%
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
                                {portfolio.cash.toLocaleString("en-US", {
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
                            </TabsList>
                            <div className="flex gap-2">
                                <Dialog open={buyOpen} onOpenChange={setBuyOpen}>
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
                                        <BuyOrderForm portfolioId={portfolio.id} defaultTicker="IBM" close={() => { updateState(); setBuyOpen(false) }} />
                                    </DialogContent>
                                </Dialog>
                                <Dialog open={sellOpen} onOpenChange={setSellOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline">Sell Stock</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Sell Stock</DialogTitle>
                                            <DialogDescription>Place a sell order for a stock in your portfolio.</DialogDescription>
                                        </DialogHeader>
                                        <SellOrderForm portfolioId={portfolio.id} holdings={portfolio.stocks} close={() => { updateState(); setSellOpen(false) }} />
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
                                                <TableHead>Current Value</TableHead>
                                                <TableHead>Share Price</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {portfolio.stocks.map((holding) => {
                                                return (
                                                    <TableRow key={holding.ticker}>
                                                        <TableCell className="font-medium">{holding.ticker}</TableCell>
                                                        <TableCell>{holding.amount}</TableCell>
                                                        <TableCell>${holding.value.toFixed(2)}</TableCell>
                                                        <TableCell>${(holding.value / holding.amount).toFixed(2)}</TableCell>
                                                        <TableCell>
                                                            <div className="flex gap-2">
                                                                <Dialog open={buyPerOpen[holding.ticker]} onOpenChange={() => updateBuyPerOpen(holding.ticker)}>
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
                                                                            defaultTicker={holding.ticker}
                                                                            close={() => { updateState(); updateBuyPerOpen(holding.ticker); }}
                                                                        />
                                                                    </DialogContent>
                                                                </Dialog>
                                                                <Dialog open={sellPerOpen[holding.ticker]} onOpenChange={() => setSellPerOpen(holding.ticker)}>
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
                                                                            holdings={portfolio.stocks}
                                                                            defaultTicker={holding.ticker}
                                                                            close={() => { updateState(); updateSellPerOpen(holding.ticker) }}
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
                    </Tabs>
                </div>
            </main>
        </div>
    )
}

