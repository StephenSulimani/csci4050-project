"use client"

import { Avatar, Button, Card } from "@chakra-ui/react"

import { useRouter } from "next/navigation"

import { StockChart } from "@/components/StockChart";

export function FormattedChart() {
    return (
        <div className="h-screen flex items-center justify-center">
            <div className="w-full max-w-4xl h-full">
                <StockChart ticker="AAPL" />
            </div>
        </div>
    )
}


export default function Home() {
    const router = useRouter();

    return (
        <div>
            <Card.Root width="320px">
                <Card.Body gap="2">
                    <Card.Title mt="2">Welcome to Gnail Trades!</Card.Title>
                    <Card.Description>
                        The simple to use trading solution for you!  Get started by clicking below to login or create an account!
                    </Card.Description>
                </Card.Body>
                <Card.Footer justifyContent="flex-end">
                    <Button variant="solid" type="button" onClick={() => router.push('/login')}>Login</Button>
                    <Button variant="outline" type="button" onClick={() => router.push('/login')}>Register</Button>
                </Card.Footer>
            </Card.Root>
            <FormattedChart />
        </div>
    );
}
