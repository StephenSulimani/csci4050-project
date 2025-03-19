import { connect } from "@/db/connection";
import User from "@/db/models/User";
import { NextResponse } from "next/server";
import { UniqueConstraintError } from "sequelize";

export const POST = async (req: Request) => {
    const body = await req.json();

    const { email, password, name } = body;

    try {
        await connect();
        await User.create({
            email,
            password,
            name,
        });
        return NextResponse.json({
            status: 1,
            error: 0,
            message: "User created successfully",
        })
    } catch (error: unknown) {
        if (error instanceof UniqueConstraintError) {
            return NextResponse.json({
                status: 0,
                error: 1,
                message: "A user with this email already exists!",
            })

        }
        return NextResponse.json({
            status: 0,
            error: 1,
            message: "Error creating user",
        })
    }
}
