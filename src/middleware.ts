import { NextRequest, NextResponse } from "next/server";
import { authCheck } from "./middleware/auth";

const blacklistedEndpoints: string[] = ['/api/login', '/api/register'];

export async function middleware(req: NextRequest) {
    const isBlacklisted = blacklistedEndpoints.some(endpoint => req.nextUrl.pathname.startsWith(endpoint))

    // if isBlacklisted or request does not start with /api
    if (isBlacklisted || !req.nextUrl.pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    const authResponse = await authCheck(req);

    if (authResponse instanceof NextResponse) {
        return authResponse;
    }

    return NextResponse.next();
}
