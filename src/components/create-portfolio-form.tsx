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

export function CreatePortfolioForm({ close }: { close: () => void; }) {
    const router = useRouter()
    const [portfolioName, setPortfolioName] = useState("")
    const [startingCapital, setStartingCapital] = useState(10000)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const createPortfolio = async () => {
        setLoading(true);
        setError("");
        const response = await fetch(`/api/portfolio/`, {
            method: 'PUT',
            credentials: "include",
            body: JSON.stringify({
                name: portfolioName,
                starting_Capital: startingCapital
            })
        });

        const data = await response.json()

        if (data.status == 1) {
            // Handle successful creation
            console.log('Portfolio created!');
        } else {
            // Handle error
            console.error(data.message);
            setError(data.message)
        }
        setLoading(false);
        close();
        router.refresh();
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        createPortfolio();

        // In a real app, this would send the order to the backend
        // Refresh the page to show the updated portfolio
        router.refresh()
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Portfolio Name</Label>
                    <Input id="name" value={portfolioName} onChange={(e) => setPortfolioName(e.target.value)} required disabled={loading} />
                    <div className="grid gap-2">
                        <Label htmlFor="starting_capital">Starting Capital</Label>
                        <Input
                            id="starting_capital"
                            type="number"
                            min="1"
                            step="1"
                            value={startingCapital}
                            onChange={(e) => setStartingCapital(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                <DialogFooter>
                    {error && <p className="text-red-500">{error}</p>}
                    {loading && <Spinner size="sm" className="bg-black dark:bg-white" />}
                    <Button type="submit" disabled={loading}>
                        Create Portfolio
                    </Button>
                </DialogFooter>
            </div>
        </form>
    )
}

