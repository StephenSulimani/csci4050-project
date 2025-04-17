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

        const startDate = await getStartDate(user_id);
        const endDate = new Date().setDate(new Date().getDate() + 1);
        const historicalValues = await getHistoricalPortfolioValue(user_id, startDate, endDate);

        return NextResponse.json({
            status: 1,
            error: 0,
            data: {
                historicalValues,
                startDate: startDate.toISOString().split('T')[0],
                endDate: new Date(endDate).toISOString().split('T')[0],
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

const getFirstOrderDate = async (user_id: string) => {
    const orders = await Order.findAll({
        where: {
            user_id: user_id
        },
        order: [['datetime', 'ASC']],
        limit: 1
    });
    if (orders.length === 0) {
        return null;
    }
    const firstOrder = orders[0].dataValues;
    return firstOrder.datetime;
}

const getStartDate = async (user_id: string) => {
    const firstOrderDate = await getFirstOrderDate(user_id);
    const today = new Date();
    const ninetyDaysAgo = new Date(today.setDate(today.getDate() - 90));
    if (firstOrderDate && new Date(firstOrderDate) > ninetyDaysAgo) {
        return new Date(firstOrderDate);
    }
    return ninetyDaysAgo;
}


const getHistoricalPortfolioValue = async (user_id: string, startDate: Date, endDate: Date): Promise<{ [date: string]: number}> => {
    const historicalValues: { [date: string]: number } = {};
    const orders = await Order.findAll({
        where: {
            user_id: user_id,
            datetime: {
                [Op.gte]: startDate,
                [Op.lte]: endDate
            }
        },
        order: [['datetime', 'ASC']]
    });

    for (const order of orders) {
        const orderData = order.dataValues;
        const date = new Date(orderData.datetime).toISOString().split('T')[0];
        const price = await FinnhubUtils.getHistoricalPrice(orderData.ticker, date);
        if (!historicalValues[date]) {
            historicalValues[date] = 0;
        }
        if (orderData.type === 'BUY') {
            historicalValues[date] += orderData.amount * price;
        } else if (orderData.type === 'SELL') {
            historicalValues[date] -= orderData.amount * price;
        }
    }

    return historicalValues;
}
