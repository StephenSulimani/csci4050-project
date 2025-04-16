import { connect } from "@/db/connection";
import Portfolio from "@/db/models/Portfolio";
import { NextRequest, NextResponse } from "next/server";

interface IPortfolioCreationRequest {
    name?: string;
    starting_capital?: number;
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

        const response_json = {
            "status": 1,
            "error": 0,
            "message": {
                "portfolios": portfolios.map((portfolio) => {
                    return {
                        "name": portfolio.dataValues.name,
                        "id": portfolio.dataValues.id,
                        "starting_capital": portfolio.dataValues.startingCapital
                    }
                })
            }
        }

        return NextResponse.json(response_json, { status: 200 })
    }
    catch {
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
        console.log(e);
        return NextResponse.json({
            status: 0,
            error: 1,
            message: "Error creating portfolio"
        }, { status: 500 })
    }

}
