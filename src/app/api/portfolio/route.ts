import { FinnhubUtils } from "@/app/FinnhubUtils";
import { connect } from "@/db/connection";
import Order from "@/db/models/Order";
import Portfolio from "@/db/models/Portfolio";
import { NextRequest, NextResponse } from "next/server";

interface IPortfolioCreationRequest {
    name?: string;
    starting_capital?: number;
}

type Holding = {
    ticker: string,
    amount: number,
    value: number
}

export interface IPortfolio {
    name: string;
    id: string;
    starting_capital: number;
    cash: number;
    stocks: Holding[];
    total_value: number;
}


export const GET = async (req: NextRequest) => {
    const user_id = req.headers.get('x-user-id');

    if (!user_id) {
        return NextResponse.json({
            status: 0,
            error: 1,
            message: "You need to be authenticated"
        }, { status: 401 })
    }

    try {
        await connect();

        const portfolios = await Portfolio.findAll({
            where: {
                user_id: user_id
            }
        })

        const portfolios_json = []

        for (const portfolio of portfolios) {

            const cash = await FinnhubUtils.calcCash(portfolio.dataValues.id);
            const stocks = await getStocks(portfolio.dataValues.id);
            const total_value = await getTotalValue(cash, stocks);
            portfolios_json.push({
                "name": portfolio.dataValues.name,
                "id": portfolio.dataValues.id,
                "starting_capital": portfolio.dataValues.startingCapital,
                "cash": cash,
                "stocks": stocks,
                "total_value": total_value
            })

        }

        const response_json = {
            "status": 1,
            "error": 0,
            "message": {
                portfolios: portfolios_json
            }
        }

        return NextResponse.json(response_json, { status: 200 })
    }
    catch (e) {
        console.log(e)
        return NextResponse.json({
            status: 0,
            error: 1,
            message: "Error fetching portfolios"
        }, { status: 500 })
    }
}

export const PUT = async (req: NextRequest) => {
    const body = (await req.json()) as IPortfolioCreationRequest;

    const user_id = req.headers.get('x-user-id')

    if (!user_id) {
        return NextResponse.json({
            status: 0,
            error: 1,
            message: "You need to be authenticated"
        }, { status: 401 })
    }

    try {
        await connect();

        const portfolio_name = body.name ? body.name : "New Portfolio";
        const starting_capital = body.starting_capital ? body.starting_capital : 10000;

        const portfolio = await Portfolio.create({
            user_id: user_id,
            name: portfolio_name,
            startingCapital: starting_capital
        })

        return NextResponse.json({
            status: 1,
            error: 0,
            message: {
                portfolio_id: portfolio.dataValues.id
            }
        })
    }
    catch (e) {
        return NextResponse.json({
            status: 0,
            error: 1,
            message: "Error creating portfolio"
        }, { status: 500 })
    }

}

const getTotalValue = async (cash: number, stocks: Holding[]) => {
    let unrealized_gains = 0;
    for (const stock of stocks) {
        unrealized_gains += stock.value;
    }
    return cash + unrealized_gains;
}

const getStocks = async (portfolio_id: string): Promise<Holding[]> => {
    const orders = await Order.findAll({
        where: {
            portfolio_id: portfolio_id
        }
    });
    const stocks = {};
    for (let order of orders) {
        order = order.dataValues;
        if (stocks[order.ticker] && order.type === 'BUY') {
            stocks[order.ticker] += order.amount;
        } else if (stocks[order.ticker] && order.type === 'SELL') {
            stocks[order.ticker] -= order.amount;
        } else if (order.type === 'BUY') {
            stocks[order.ticker] = order.amount;
        } else if (order.type === 'SELL') {
            stocks[order.ticker] = -order.amount;
        }
    }

    const stock_array: Holding[] = await Promise.all(Object.entries(stocks).map(async ([ticker, amount]) => {
        return {
            "ticker": ticker,
            "amount": amount,
            "value": (await FinnhubUtils.getPrice(ticker)) * amount,
        }
    }));

    return stock_array;
}


