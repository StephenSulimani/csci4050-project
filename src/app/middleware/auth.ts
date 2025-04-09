import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyJWT } from "../auth";
import { ICustomNextRequest } from "./types/CustomNextRequest";


export async function authCheck(req: ICustomNextRequest) {
    const cookieStore = await cookies();

    const token = cookieStore.get('token');

    if (!token) {
        return NextResponse.json({
            status: 0,
            error: 1,
            message: "Token was not provided in request"
        }, { status: 401 })
    }

    const jwtStatus = await verifyJWT(token.value);

    if (!jwtStatus) {
        return NextResponse.json({
            status: 0,
            error: 1,
            message: "Invalid token"
        }, { status: 401 })
    }

    req.userId = jwtStatus.id;

    return NextResponse.next();
}
