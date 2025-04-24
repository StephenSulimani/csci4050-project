import { connect } from "@/db/connection";
import Order from "@/db/models/Order";
import { NextRequest, NextResponse } from "next/server";
import { FinnhubUtils } from "@/app/FinnhubUtils";
import { Op } from 'sequelize'
import AlphaV from "@/app/AlphaVantage";
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

    const portfolio_id = (await params).portfolio_id;

    try {
        await connect();

        const startDate = await getStartDate(portfolio_id);
        const endDate = new Date();
        const historicalValues = await getHistoricalPortfolioValue(startDate, endDate, portfolio_id);

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

const getFirstOrderDate = async (portfolio_id: string) => {
    const orders = await Order.findAll({
        where: {
            portfolio_id: portfolio_id
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

const getStartDate = async (portfolio_id: string) => {
    const firstOrderDate = await getFirstOrderDate(portfolio_id);
    const today = new Date();
    const ninetyDaysAgo = new Date(today.setDate(today.getDate() - 90));
    if (firstOrderDate && new Date(firstOrderDate) > ninetyDaysAgo) {
        return new Date(firstOrderDate);
    }
    return ninetyDaysAgo;
}


const getHistoricalPortfolioValue = async (startDate: Date, endDate: Date, portfolio_id: string): Promise<{ [date: string]: number }> => {
    const historicalValues: { [date: string]: number } = {};
    const orders = await Order.findAll({
        where: {
            portfolio_id: portfolio_id,
            datetime: {
                [Op.gte]: startDate,
                [Op.lte]: endDate
            }
        },
        order: [['datetime', 'ASC']]
    });

    const portfolio = await Portfolio.findOne({
        where: {
            id: portfolio_id
        }
    })

    const cache = {

    }

    const holdings = {

    }

    const value_map = {

    }

    let cash = portfolio?.dataValues.startingCapital;

    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
        const todays_orders = orders.filter(order => new Date(order.dataValues.datetime).toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0]);


        for (const order of todays_orders) {
            if (!cache[order.ticker]) {
                cache[order.ticker] = (await AlphaV.daily_time_series(order.ticker))["Time Series (Daily)"]
            }
            if (!cache[order.ticker][date]) {
                const price_td = await FinnhubUtils.getPrice(order.ticker);

                cache[order.ticker][date] = {
                    "4. close": price_td
                }
            }

            let string_date = new Date(date).toISOString().split('T')[0];

            while (!cache[order.ticker][string_date]) {
                string_date = new Date(new Date(string_date).setDate(new Date(string_date).getDate() - 1)).toISOString().split('T')[0];
            }

            const price = cache[order.ticker][string_date]["4. close"];

            if (order.dataValues.type == 'BUY') {
                cash -= order.dataValues.amount * price;
                if (!holdings[order.dataValues.ticker]) {
                    holdings[order.dataValues.ticker] = 0;
                }
                holdings[order.dataValues.ticker] += order.dataValues.amount;
            } else {
                cash += order.dataValues.amount * price;
                if (!holdings[order.dataValues.ticker]) {
                    holdings[order.dataValues.ticker] = 0;
                }
                holdings[order.dataValues.ticker] -= order.dataValues.amount;
            }
        }

        let value_today = cash;

        for (const [ticker, amt] of Object.entries(holdings)) {
            let string_date = new Date(date).toISOString().split('T')[0];

            while (!cache[ticker][string_date]) {
                string_date = new Date(new Date(string_date).setDate(new Date(string_date).getDate() - 1)).toISOString().split('T')[0];
            }

            value_today += amt * cache[ticker][string_date]["4. close"];
        }

        value_map[new Date(date).toISOString().split('T')[0]] = value_today;

    }


    return value_map;
}
