import { connect } from "@/db/connection";
import Order from "@/db/models/Order";
import { NextRequest, NextResponse } from "next/server";
import { FinnhubUtils } from "@/app/FinnhubUtils";

export const GET = async (req: NextRequest) => {
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

        const cash = await FinnhubUtils.calcCash(user_id);
        const stocks = await getStocks(user_id);
        const total_value = await getTotalValue(cash, stocks);

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

const getStocks = async (user_id: string) => {
    const orders = await Order.findAll({
        where: {
            user_id: user_id
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
