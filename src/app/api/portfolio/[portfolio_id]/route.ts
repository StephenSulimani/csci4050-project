import { connect } from "@/db/connection";
import Order from "@/db/models/Order";
import Portfolio from "@/db/models/Portfolio";
import { NextRequest, NextResponse } from "next/server";

interface IPortfolioDeletionRequest {
    portfolio_id: string;
}

export const DELETE = async (req: NextRequest, { params }: { params: IPortfolioDeletionRequest }) => {
    const portfolio_id = (await params).portfolio_id;
    const user_id = req.headers.get('x-user-id');

    if (!user_id) {
        return NextResponse.json({
            status: 0,
            error: 1,
            message: "You need to be authenticated"
        }, { status: 401 })
    }

    const portfolio = await Portfolio.findOne({
        where: {
            user_id: user_id,
            id: portfolio_id
        }
    })

    if (!portfolio) {
        return NextResponse.json({
            status: 0,
            error: 1,
            message: "Portfolio not found"
        }, { status: 404 })
    }

    try {
        await connect();

        // First delete all orders that are connected to this portfolio.
        await Order.destroy({
            where: {
                portfolio_id: portfolio_id
            }
        })

        // Then delete the portfolio itself.
        await portfolio.destroy();

        return NextResponse.json({
            status: 1,
            error: 0,
            message: "Portfolio successfully deleted."
        }, { status: 200 })
    }
    catch {
        return NextResponse.json({
            status: 0,
            error: 1,
            message: "Portfolio could not be deleted."
        }, { status: 500 })
    }

}
