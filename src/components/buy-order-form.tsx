"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "./ui/spinner"

export function BuyOrderForm({
    portfolioId,
    defaultTicker,
    close
}: {
    portfolioId: string,
    defaultTicker: string,
    close: () => void
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
                type: "BUY",
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

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="ticker">Stock Symbol</Label>
                    <Input id="ticker" value={ticker} required onChange={(e) => setTicker(e.target.value)} disabled={loading} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="shares">Number of Shares</Label>
                    <Input
                        id="shares"
                        type="number"
                        min="1"
                        step="1"
                        value={shares}
                        onChange={(e) => setShares(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>


            </div>

            <DialogFooter>
                {errorMsg && <p className="text-red-500">{errorMsg}</p>}
                {loading && <Spinner size="sm" className="bg-black dark:bg-white" />}
                <Button type="submit" disabled={loading}>
                    Place Buy Order
                </Button>
            </DialogFooter>
        </form>
    )
}

