import AlphaV from "@/app/AlphaVantage";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { ticker: string } }) => {
    const ticker = (await params).ticker;

    const data = await AlphaV.daily_time_series(ticker);

    return NextResponse.json(data)
}
