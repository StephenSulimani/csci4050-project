import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/app/auth";


export async function authCheck(req: NextRequest) {
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

    const headers = new Headers(req.headers);

    headers.set('x-user-id', jwtStatus.id);

    return NextResponse.next({
        request: {
            headers: headers
        }
    })

}
