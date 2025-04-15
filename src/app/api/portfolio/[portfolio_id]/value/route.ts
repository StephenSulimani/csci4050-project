import { connect } from "@/db/connection";
import Order from "@/db/models/Order";
import { NextRequest, NextResponse } from "next/server";
import { FinnhubUtils } from "@/app/FinnhubUtils";
import Portfolio from "@/db/models/Portfolio";

export const GET = async (req: NextRequest, { params }: { params: { portfolio_id: string } }) => {
    const user_id = req.headers.get('x-user-id')

    if (!user_id) {
        return NextResponse.json({
            status: 0,
            error: 1,
            message: "You need to be authenticated"
        }, { status: 401 })
    }


    const portfolio_id = params.portfolio_id;

    // Confirm that portfolio requested is owned by the user.
    const portfolio = await Portfolio.findOne({
        where: { id: portfolio_id, user_id: user_id }
    });

    if (!portfolio) {
        return NextResponse.json({
            status: 0,
            error: 1,
            message: "Portfolio not found"
        }, { status: 404 })
    }

    try {
        await connect();

        const cash = await FinnhubUtils.calcCash(portfolio_id);
        const stocks = await getStocks(portfolio_id);
        const total_value = await getTotalValue(cash, stocks);
        // Foreign key referencing User model
        return NextResponse.json({
            status: 1,
            error: 0,
            data: {
                cash,
                stocks,
                total_value,
            },
        })
    } catch (error: unknown) {
        return NextResponse.json({
            status: 0,
            error: 1,
            message: "Error calculating value: " + error,
        })
    }
}

const getTotalValue = async (cash: number, stocks: { [key: string]: number }) => {
    let unrealized_gains = 0;
    for (const ticker in stocks) {
        const amount = stocks[ticker];
        if (amount > 0) {
            const price = await FinnhubUtils.getPrice(ticker);
            unrealized_gains += amount * price;
        }
    }
    return cash + unrealized_gains;
}

const getStocks = async (portfolio_id: string) => {
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
    return stocks;
}


