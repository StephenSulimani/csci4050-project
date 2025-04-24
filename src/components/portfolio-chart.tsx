"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

// Generate mock historical data for the portfolio
const generatePortfolioData = async (portfolioId: string) => {
    // Base value depends on the portfolio ID
    const baseValue = portfolioId === "1" ? 10000 : portfolioId === "2" ? 8000 : portfolioId === "3" ? 12000 : 10000

    // Generate data for the last 30 days
    const data = []
    const now = new Date()

    for (let i = 30; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)

        // Create some random fluctuations
        const randomFactor = 1 + (Math.random() * 0.1 - 0.05) // -5% to +5%
        const previousValue = i === 30 ? baseValue : data[data.length - 1].value
        const value = previousValue * randomFactor

        data.push({
            date: date.toISOString().split("T")[0],
            value: Math.round(value * 100) / 100,
        })
    }

    const response = await fetch(`/api/portfolio/historical_value/${portfolioId}`, {
        method: 'GET',
        credentials: "include",
    })

    const data2 = await response.json()

    console.log(data2)


    return data
}

export function PortfolioChart({ portfolioId }: { portfolioId: string }) {
    const data = generatePortfolioData(portfolioId)

    return (
        <ChartContainer
            config={{
                value: {
                    label: "Portfolio Value",
                    color: "hsl(var(--chart-1))",
                },
            }}
            className="h-full"
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 10,
                        left: 10,
                        bottom: 0,
                    }}
                >
                    <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => {
                            const date = new Date(value)
                            return `${date.getMonth() + 1}/${date.getDate()}`
                        }}
                        minTickGap={30}
                    />
                    <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value.toLocaleString()}`} width={80} />
                    <Tooltip content={<ChartTooltipContent indicator="dashed" />} />
                    <Line
                        type="monotone"
                        dataKey="value"
                        strokeWidth={2}
                        activeDot={{ r: 6, style: { fill: "var(--color-value)" } }}
                        style={{
                            stroke: "var(--color-value)",
                        }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </ChartContainer>
    )
}

