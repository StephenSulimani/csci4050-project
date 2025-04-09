import { createJWT } from "@/app/auth";
import { connect } from "@/db/connection";
import Order from "@/db/models/Order";
import User from "@/db/models/User";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { UniqueConstraintError } from "sequelize";

interface IRegisterRequest {
    email: string;
    password: string;
    name: string;
}

function isRegisterRequest(obj: unknown): obj is IRegisterRequest {
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }

    const payload = obj as IRegisterRequest;

    return (typeof payload.email === 'string'
        && typeof payload.password === 'string'
        && typeof payload.name === 'string');
}

export const POST = async (req: Request) => {
    const body = await req.json();


    if (!isRegisterRequest(body)) {
        return NextResponse.json({
            status: 0,
            error: 1,
            message: "Invalid request",
        }, { status: 400 })
    }

    const { email, password, name } = body;

    try {
        await connect();

        const hashedPassword = await bcrypt.hash(password, 10);


        const user = await User.create({
            email: email.toLowerCase(),
            password: hashedPassword,
            name: name,
        });

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
            message: "User created successfully",
        })
    } catch (error: unknown) {
        if (error instanceof UniqueConstraintError) {
            return NextResponse.json({
                status: 0,
                error: 1,
                message: "A user with this email already exists!",
            }, { status: 400 })

        }
        return NextResponse.json({
            status: 0,
            error: 1,
            message: "Error creating user",
        }, { status: 500 })
    }
}
