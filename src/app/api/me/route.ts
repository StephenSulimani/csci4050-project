import User from "@/db/models/User";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    const user_id = req.headers.get('x-user-id')

    if (!user_id) {
        return NextResponse.json({
            status: 0,
            error: 1,
            message: "You need to be authenticated"
        }, { status: 401 })
    }

    const user = await User.findOne({
        where: {
            id: user_id
        }
    })

    if (!user) {
        return NextResponse.json({
            status: 0,
            error: 1,
            message: "User not found"
        }, { status: 404 })
    }

    return NextResponse.json({
        status: 1,
        error: 0,
        message: {
            name: user.dataValues.name,
            email: user.dataValues.email
        }
    })
}
