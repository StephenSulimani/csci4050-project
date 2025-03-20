import { connect } from "@/db/connection";
import User from "@/db/models/User";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Sequelize } from "sequelize-typescript";

export const POST = async (req: Request) => {
    const body = await req.json();

    const { email, password } = body;

    try {
        await connect();
        const user = await User.findOne({
            where: {
                email: {
                    [Sequelize.Op.iLike]: email
                },
                password,
            },
        });
        if (!user) {
            return NextResponse.json({
                status: 0,
                error: 1,
                message: "Invalid credentials",
            })
        }
        const cookieStore = await cookies();

        cookieStore.set({
            name: "id",
            value: user.dataValues.id,
            path: "/",
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 30
        })
        return NextResponse.json({
            status: 1,
            error: 0,
            message: "User logged in successfully",
        })
    } catch {
        return NextResponse.json({
            status: 0,
            error: 1,
            message: "Error logging in user",
        })
    }
}
