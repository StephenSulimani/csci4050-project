import { createJWT } from "@/app/auth";
import { connect } from "@/db/connection";
import User from "@/db/models/User";
import bcrypt from "bcryptjs";
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
            },
        });
        if (!user) {
            return NextResponse.json({
                status: 0,
                error: 1,
                message: "Invalid credentials",
            }, { status: 401 })
        }

        const loginStatus = await bcrypt.compare(password, user.dataValues.password);

        if (!loginStatus) {
            return NextResponse.json({
                status: 0,
                error: 1,
                message: "Invalid credentials"
            }, { status: 401 })
        }

        const cookieStore = await cookies();

        const jwt = await createJWT({ id: user.dataValues.id })

        cookieStore.set({
            name: "token",
            value: jwt,
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
        }, { status: 500 })
    }
}
