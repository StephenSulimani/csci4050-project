import { connect } from "@/db/connection";
import User from "@/db/models/User";
import { cookies } from "next/headers"
import { NextResponse } from "next/server";

export const GET = async () => {
    const cookieStore = await cookies();

    const id = cookieStore.get("id");
    if (!id) {
        return NextResponse.json({
            status: 0,
            error: 1,
            message: "User not found",
        })
    }
    try {
        await connect();


        const user = await User.findOne({
            where: {
                id: id.value
            }
        })

        if (!user) {
            return NextResponse.json({
                status: 0,
                error: 1,
                message: "User not found"
            })
        }

        return NextResponse.json({
            status: 1,
            error: 0,
            message: user.dataValues.id
        })
    }
    catch {
        return NextResponse.json({
            status: 0,
            error: 1,
            message: "Error finding user"
        })
    }
}
