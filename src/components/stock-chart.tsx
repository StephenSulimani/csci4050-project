"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { useEffect, useState } from "react"


export function StockChart({ ticker, setPrice }: { ticker: string, setPrice: (price: number, change: number) => void }) {
    const [data, setChartData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/api/data/${ticker}`, {
                method: 'GET',
                credentials: 'include'
            })

            const data = await response.json();

            const time_series = data["Time Series (Daily)"];

            const chartData = Object.keys(time_series).map((date) => {
                return {
                    date: date,
                    price: time_series[date]["4. close"]
                }
            })

            chartData.reverse();

            setChartData(chartData);

            setPrice(chartData[chartData.length - 1].price, chartData[chartData.length - 1].price - chartData[0].price);

            // setChartData((prevData) => [...prevData, ...chartData]);

        }
        fetchData();
    }, [ticker]);

    // Calculate if the stock is up or down
    const isUp = data.length > 0 ? data[data.length - 1].price >= data[0].price : false
    const chartColor = isUp ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))"

    console.log(isUp);

    return (
        <ChartContainer
            config={{
                price: {
                    label: "Stock Price",
                    color: chartColor,
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
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value.toFixed(2)}`}
                        domain={["dataMin - 30", "dataMax + 30"]}
                        width={80}
                    />
                    <Tooltip content={<ChartTooltipContent indicator="dashed" />} />
                    <Line
                        type="monotone"
                        dataKey="price"
                        strokeWidth={2}
                        activeDot={{ r: 6, style: { fill: "var(--color-price)" } }}
                        style={{
                            stroke: "var(--color-price)",
                        }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </ChartContainer>
    )
}

