"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"

const chartConfig = {
    price: {
        label: "Price",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig


export function StockChart() {
    const [chartData, setChartData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/api/data/AAPL', {
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

            setChartData((prevData) => [...prevData, ...chartData]);

        }
        fetchData();

    }, [])
    return (
        <Card>
            <CardHeader>
                <CardTitle>Line Chart</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 24,
                            right: 24,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={6}
                            tickCount={3}
                            tickFormatter={(date) => date.slice(5)}
                        />
                        <YAxis
                            dataKey="price"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={6}
                            allowDecimals={false}
                            domain={["auto", "auto"]}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent labelFormatter={(date) => new Date(date).toDateString()} />}
                        />
                        <Line
                            dataKey="price"
                            type="natural"
                            stroke="#0047AB"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing total visitors for the last 6 months
                </div>
            </CardFooter>
        </Card>
    )
}

