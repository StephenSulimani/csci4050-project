"use client"

import { Button, Card, Heading, Input } from "@chakra-ui/react"
import { Table } from "@chakra-ui/react"
import { useState, useEffect } from 'react'
import Delete from '../../components/delete'
import Buy from '../../components/buy'
import Sell from '../../components/sell'
import Create from '../../components/create'
import Search from '../../components/search'
import { IPortfolio } from "../api/portfolio/route"

export default function Dashboard() {

    interface portfolio {
        name: string,
        id: string,
        starting_capital: number,
        cash: number,
        stocks: stock[],
        total_value: number
    }

    interface stock {
        ticker: string,
        amount: number,
        value: number,
    }

    const [portfolioChosen, setPortfolioChosen] = useState(false);
    const [statusChanged, setStatusChanged] = useState(false)

    const updateState = (setChosen: boolean) => {
        setPortfolioChosen(setChosen)
        setStatusChanged(!statusChanged)
    }

    const [portfolios, setPortfolios] = useState<IPortfolio[]>([])

    const [currentPortfolio, setCurrentPortfolio] = useState<IPortfolio>({
        name: '',
        id: '',
        starting_capital: 0,
        cash: 0,
        stocks: [{
            ticker: '',
            amount: 0,
            value: 0
        }],
        total_value: 0
    });

    function choosePortfolio(id: any) {
        console.log(`ID: ${id} | Portfolio Len: ${portfolios.length}`);
        setCurrentPortfolio(portfolios.filter(portfolio => portfolio.id === id)[0])
        setPortfolioChosen(true);
    }

    useEffect(() => {
        const getPortfolios = async () => {
            const response = await fetch(`/api/portfolio`, {
                method: 'GET',
                credentials: "include"
            })

            const data = await response.json();

            setPortfolios(data.message.portfolios);
        }

        getPortfolios()

    }, [statusChanged])

    const logout = async () => {
        // const response = await fetch(`/logout`, {
        //     method: 'GET',
        //     credentials: "include"
        // })
    }

    if (!portfolioChosen) {
        return (
            <div>
                <h1>Gnail Trades</h1>
                <Button type="button" onClick={() => logout()}>
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
                                            <Table.Row key={portfolio.id} onClick={() => choosePortfolio(portfolio.id)}>
                                                <Table.Cell>{portfolio.name}</Table.Cell>
                                                <Table.Cell>{portfolio.total_value.toFixed(2)}</Table.Cell>
                                                <Table.Cell>{portfolio.starting_capital}</Table.Cell>
                                                <Table.Cell>{((portfolio.total_value - portfolio.starting_capital) / portfolio.starting_capital).toFixed(2)}%</Table.Cell>
                                                <Table.Cell textAlign="end">{portfolio.cash}</Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table.Root>
                            </Table.ScrollArea>
                            <Create updateState={updateState}/>
                        </Card.Body>
                    </Card.Root>
                </div>
                <Search />
            </div>
        );
    }

    return (
        <div>
            <h1>Gnail Trades</h1>
            <Button type="button" onClick={() => logout()}>
                Logout
            </Button>
            <div>
                <Card.Root size="sm">
                    <Card.Header>
                        <Heading size="md">{currentPortfolio.name}'s Stocks</Heading>
                        <Card.Description>View your portfolio's stocks or buy/sell stocks using the buttons below</Card.Description>
                        <Delete id={currentPortfolio.id} updateState={updateState}/>
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
                                        <Table.ColumnHeader>Market Price</Table.ColumnHeader>
                                        <Table.ColumnHeader>Shares Owned</Table.ColumnHeader>
                                        <Table.ColumnHeader>Value</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {currentPortfolio.stocks.map((stock) => (
                                        <Table.Row>
                                            <Table.Cell>{stock.ticker}</Table.Cell>
                                            <Table.Cell>{stock.value / stock.amount}</Table.Cell>
                                            <Table.Cell>{stock.amount}</Table.Cell>
                                            <Table.Cell>{stock.value}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Table.ScrollArea>
                        <Buy id={currentPortfolio} updateState={updateState}/>
                        <Sell id={currentPortfolio} updateState={updateState}/>
                    </Card.Body>
                </Card.Root>
            </div>
            <Search />
        </div>
    );
}
