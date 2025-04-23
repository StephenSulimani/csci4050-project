"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "./ui/spinner"
import { Holding } from "@/app/api/portfolio/route"


export function SellOrderForm({
    portfolioId,
    holdings,
    close,
    defaultTicker = "",
}: {
    portfolioId: string
    holdings: Holding[]
    close: () => void
    defaultTicker?: string
}) {
    const router = useRouter()
    const [ticker, setTicker] = useState(defaultTicker)
    const [shares, setShares] = useState("1")
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("")

    const OrderStock = async () => {
        setLoading(true);
        setErrorMsg('');
        const response = await fetch(`/api/portfolio/order`, {
            method: 'POST',
            credentials: "include",
            body: JSON.stringify({
                ticker: ticker,
                type: "SELL",
                amount: parseInt(shares),
                portfolio_id: portfolioId
            })
        });

        const data = await response.json();

        setLoading(false);

        if (data.status == 1) {
            // Handle successful buy
            console.log('Stock has been purchased!');
            close()
        } else {
            // Handle error
            console.error('Failed to place order');
            setErrorMsg(data.message)
        }
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        OrderStock();

        // In a real app, this would send the order to the backend

        // Refresh the page to show the updated portfolio
        router.refresh()
    }

    const [price, setPrice] = useState("")
    const [orderType, setOrderType] = useState("market")

    // Find the selected holding
    const selectedHolding = holdings.find((h) => h.ticker === ticker)

    // Set max shares when ticker changes
    useEffect(() => {
        if (selectedHolding) {
            setShares("1")
        }
    }, [ticker, selectedHolding])

    // Calculate total value
    const totalValue = selectedHolding
        ? Number(shares) * (orderType === "market" ? selectedHolding.currentPrice : Number(price) || 0)
        : 0


    return (
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="ticker">Stock Symbol</Label>
                    <Select value={ticker} onValueChange={setTicker} required disabled={loading}>
                        <SelectTrigger id="ticker">
                            <SelectValue placeholder="Select a stock" />
                        </SelectTrigger>
                        <SelectContent>
                            {holdings.map((holding) => (
                                <SelectItem key={holding.ticker} value={holding.ticker}>
                                    {holding.ticker} - {holding.amount} shares
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="shares">Number of Shares</Label>
                    <Input
                        id="shares"
                        type="number"
                        min="1"
                        max={selectedHolding?.amount.toString()}
                        step="1"
                        value={shares}
                        onChange={(e) => setShares(e.target.value)}
                        required
                        disabled={!selectedHolding || loading}
                    />
                    {selectedHolding && (
                        <div className="text-xs text-muted-foreground">You own {selectedHolding.amount} shares</div>
                    )}
                </div>

            </div>

            <DialogFooter>
                {errorMsg && <p className="text-red-500">{errorMsg}</p>}
                {loading && <Spinner size="sm" className="bg-black dark:bg-white" />}

                <Button type="submit" disabled={!selectedHolding || Number(shares) > (selectedHolding?.amount || 0) || loading}>
                    Place Sell Order
                </Button>
            </DialogFooter>
        </form>
    )
}

