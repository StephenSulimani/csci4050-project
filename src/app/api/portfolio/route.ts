import { connect } from "@/db/connection";
import Portfolio from "@/db/models/Portfolio";
import { NextRequest, NextResponse } from "next/server";

interface IPortfolioCreationRequest {
    name?: string;
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

        const portfolio = await Portfolio.create({
            name: body.name,
            user_id: user_id
        });

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
