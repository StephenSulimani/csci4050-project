"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { useEffect, useState } from "react"

// Generate mock historical data for the portfolio
const generatePortfolioData = async (portfolioId: string) => {

    const response = await fetch(`/api/portfolio/historical_value/${portfolioId}`, {
        method: 'GET',
        credentials: "include",
    })

    const data2 = await response.json()

    console.log(data2)

    if (data2.status === 1) {
        return data2["data"]["historicalValues"]
    }
    else {
        return {}
    }
}

export function PortfolioChart({ portfolioId }: { portfolioId: string }) {
    const [data, setData] = useState([])

    useEffect(() => {
        const grabData = async () => {
            const fetchedData = await generatePortfolioData(portfolioId)
            const chartData = Object.keys(fetchedData).map((date) => {
                return {
                    date: date,
                    value: fetchedData[date]
                }
            })
            console.log(chartData)
            setData(chartData)
        }
        grabData()
    }, [portfolioId])

    return (
        <ChartContainer
            config={{
                value: {
                    label: "Portfolio Value",
                    color: "hsl(var(--chart-1))",
                },
            }}
            className="h-full w-full"
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
                    <YAxis dataKey="value" tickLine={false} axisLine={false} tickFormatter={(value) => `$${value.toLocaleString()}`} width={80}
                        domain={["dataMin - 50", "dataMax + 50"]}

                    />
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

