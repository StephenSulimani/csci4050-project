import { NextResponse } from "next/server";
import { ICustomNextRequest } from "./middleware/types/CustomNextRequest";
import { authCheck } from "./middleware/auth";

const blacklistedEndpoints: string[] = []

export async function middleware(req: ICustomNextRequest) {
    const isBlacklisted = blacklistedEndpoints.some(endpoint => req.nextUrl.pathname.startsWith(endpoint))

    if (isBlacklisted) {
        return NextResponse.next();
    }

    const authResponse = await authCheck(req);

    if (authResponse instanceof NextResponse) {
        return authResponse;
    }

    return NextResponse.next();
}
