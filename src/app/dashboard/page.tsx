"use client"

import { Button, Card, Heading, Input } from "@chakra-ui/react"
import { Table } from "@chakra-ui/react"
import { useState } from 'react'
import Delete from '../../components/delete'
import Buy from '../../components/buy'
import Sell from '../../components/sell'
import Create from '../../components/create'
import Search from '../../components/search'

export default function Dashboard() {

    const [portfolioChosen, setPortfolioChosen] = useState(false);

    const portfolios = [
        {
            id: "1",
            name: "portfolio",
            totalValue: "10000",
            cashValue: "100",
            startingCapital: "10000",
            return: "8.05"
        }
    ]

    const currentPortfolio = {
        id: "1",
        name: "portfolio1",
        stocks: [
            {
                ticker: "IBM",
                purchasePrice: "50",
                marketPrice: "60",
                sharesOwned: "3",
                return: "10%"
            }
        ]
    }

    if (!portfolioChosen) {
    return (
        <div>
            <h1>Gnail Trades</h1>
            <Button type="button">
                Logout
            </Button>
            <div>
                <Card.Root size="sm">
                    <Card.Header>
                        <Heading size="md"> My Portfolios</Heading>
                        <Card.Description>Check how your portfolios are doing or select a portfolio to view/trade stocks</Card.Description>
                    </Card.Header>
                    <Card.Body color="fg.muted">
                        <Table.ScrollArea borderWidth="1px" rounded="md" height="160px">
                            <Table.Root size="sm" stickyHeader>
                                <Table.Header>
                                    <Table.Row bg="bg.subtle">
                                        <Table.ColumnHeader>Portfolio Name</Table.ColumnHeader>
                                        <Table.ColumnHeader>Total Value</Table.ColumnHeader>
                                        <Table.ColumnHeader>Starting Capital</Table.ColumnHeader>
                                        <Table.ColumnHeader>Return</Table.ColumnHeader>
                                        <Table.ColumnHeader textAlign="end">Cash Available</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {portfolios.map((portfolio) => (
                                        <Table.Row key={portfolio.id} onClick={() => setPortfolioChosen(true)}>
                                            <Table.Cell>{portfolio.name}</Table.Cell>
                                            <Table.Cell>{portfolio.totalValue}</Table.Cell>
                                            <Table.Cell>{portfolio.startingCapital}</Table.Cell>
                                            <Table.Cell>{portfolio.return}</Table.Cell>
                                            <Table.Cell textAlign="end">{portfolio.cashValue}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Table.ScrollArea>
                        <Create/>
                    </Card.Body>
                </Card.Root>
            </div>
            <div>
                <Card.Root size="sm">
                    <Card.Header>
                        <Heading size="md">Search for a Stock</Heading>
                    </Card.Header>
                    <Card.Body color="fg.muted">
                        <div>
                            <p>Ticker:</p>
                            <Input name="name" type="text" placeholder="IBM"/>
                        </div>
                    </Card.Body>
                </Card.Root>
            </div>
            <Search/>
        </div>
    );
    }

    return (
        <div>
            <h1>Gnail Trades</h1>
            <Button type="button">
                Logout
            </Button>
            <div>
                <Card.Root size="sm">
                    <Card.Header>
                        <Heading size="md">{currentPortfolio.name}'s Stocks</Heading>
                        <Card.Description>View your portfolio's stocks or buy/sell stocks using the buttons below</Card.Description>
                        <Delete/>
                        <Button type="button" className="max-w-40" onClick={() => setPortfolioChosen(false)}>
                            Back to Portfolios
                        </Button>
                    </Card.Header>
                    <Card.Body color="fg.muted">
                        <Table.ScrollArea borderWidth="1px" rounded="md" height="160px">
                            <Table.Root size="sm" stickyHeader>
                                <Table.Header>
                                    <Table.Row bg="bg.subtle">
                                        <Table.ColumnHeader>Stock Ticker</Table.ColumnHeader>
                                        <Table.ColumnHeader>Purchase Price</Table.ColumnHeader>
                                        <Table.ColumnHeader>Market Price</Table.ColumnHeader>
                                        <Table.ColumnHeader>Shares Owned</Table.ColumnHeader>
                                        <Table.ColumnHeader textAlign="end">Return</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {currentPortfolio.stocks.map((stock) => (
                                        <Table.Row>
                                            <Table.Cell>{stock.ticker}</Table.Cell>
                                            <Table.Cell>{stock.purchasePrice}</Table.Cell>
                                            <Table.Cell>{stock.marketPrice}</Table.Cell>
                                            <Table.Cell>{stock.sharesOwned}%</Table.Cell>
                                            <Table.Cell textAlign="end">{stock.return}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Table.ScrollArea>
                        <Buy/>
                        <Sell/>
                    </Card.Body>
                </Card.Root>
            </div>
            <Search/>
        </div>
    );
}