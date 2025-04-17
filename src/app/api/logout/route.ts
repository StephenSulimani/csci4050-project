import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
    const cookieStore = await cookies();

    cookieStore.delete('token');

    return NextResponse.json({
        status: 1,
        error: 0,
        message: "Successfully logged out"
    })

}
