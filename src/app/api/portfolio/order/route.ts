import { connect } from "@/db/connection";
import Order from "@/db/models/Order";
import { NextRequest, NextResponse } from "next/server";
import { FinnhubUtils } from "@/app/FinnhubUtils";

export const POST = async (req: NextRequest) => {
    const body = await req.json();

    const { ticker, amount, type } = body;

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
        const datetime = new Date().toISOString();
        const price = await FinnhubUtils.getPrice(ticker);
        const cash = await FinnhubUtils.calcCash(user_id);
        if (type === 'BUY' && cash < price * amount) {
            return NextResponse.json({
                status: 0,
                error: 1,
                message: "Not enough cash to buy",
            })
        } else if (type === 'SELL') {
            const orders = await Order.findAll({
                where: {
                    user_id: user_id,
                    ticker: ticker,
                    type: 'BUY'
                }
            });
            let totalAmount = 0;
            for (const order of orders) {
                totalAmount += order.dataValues.amount;
            }
            if (totalAmount < amount) {
                return NextResponse.json({
                    status: 0,
                    error: 1,
                    message: "Not enough shares to sell",
                })
            }
        }

        await Order.create({
            ticker,
            amount,
            type,
            datetime,
            price,
            user_id
        });
        return NextResponse.json({
            status: 1,
            error: 0,
            message: "Order issued successfully",
        })
    } catch (error: unknown) {
        return NextResponse.json({
            status: 0,
            error: 1,
            message: "Error creating order: " + (error as Error).message,
        })
    }
}
