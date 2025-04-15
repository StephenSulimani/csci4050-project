import { connect } from "@/db/connection";
import Order from "@/db/models/Order";
import { NextRequest, NextResponse } from "next/server";
import { FinnhubUtils } from "@/app/FinnhubUtils";
import Portfolio from "@/db/models/Portfolio";

interface IOrderCreationRequest {
    ticker: string;
    amount: number;
    type: 'BUY' | 'SELL';
    portfolio_id: string;
}

function isOrderCreationRequest(obj: Unknown): obj is IOrderCreationRequest {
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }

    const payload = obj as IOrderCreationRequest;

    return (typeof payload.ticker === 'string'
        && typeof payload.amount === 'number'
        && typeof payload.type === 'string'
        && typeof payload.portfolio_id === 'string');
}

export const POST = async (req: NextRequest) => {
    const body = await req.json();

    if (!isOrderCreationRequest(body)) {
        return NextResponse.json({
            status: 0,
            error: 1,
            message: "Invalid request",
        }, { status: 400 })
    }

    const user_id = req.headers.get('x-user-id')

    if (!user_id) {
        return NextResponse.json({
            status: 0,
            error: 1,
            message: "You need to be authenticated"
        }, { status: 401 })
    }

    const portfolio = await Portfolio.findOne({
        where: { id: body.portfolio_id, user_id: user_id }
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
        const datetime = new Date().toISOString();
        const price = await FinnhubUtils.getPrice(body.ticker);
        const cash = await FinnhubUtils.calcCash(body.portfolio_id);
        if (body.type === 'BUY' && cash < price * body.amount) {
            return NextResponse.json({
                status: 0,
                error: 1,
                message: "Not enough cash to buy",
            })
        } else if (body.type === 'SELL') {
            const orders = await Order.findAll({
                where: {
                    portfolio_id: body.portfolio_id,
                    ticker: body.ticker,
                    type: 'BUY'
                }
            });
            let totalAmount = 0;
            for (const order of orders) {
                totalAmount += order.dataValues.amount;
            }
            if (totalAmount < body.amount) {
                return NextResponse.json({
                    status: 0,
                    error: 1,
                    message: "Not enough shares to sell",
                })
            }
        }

        await Order.create({
            ticker: body.ticker,
            amount: body.amount,
            type: body.type,
            datetime,
            price,
            portfolio_id: body.portfolio_id
        })

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
