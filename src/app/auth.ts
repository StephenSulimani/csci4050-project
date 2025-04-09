import * as jose from 'jose'
import { cookies } from 'next/headers';

interface IAuthPayload extends jose.JWTPayload {
    id: string;
}

function isAuthPayload(obj: unknown): obj is IAuthPayload {
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }

    const payload = obj as IAuthPayload;

    return typeof payload.id === 'string';
}

export async function verifyJWT(authCookie?: string): Promise<false | IAuthPayload> {
    if (!authCookie) {
        const cookieStore = await cookies();

        if (!cookieStore.has('token')) {
            return false;
        }

        authCookie = cookieStore.get('token')?.value;

        if (!authCookie) {
            return false;
        }

    }

    try {
        const encodedSecret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jose.jwtVerify(authCookie, encodedSecret);

        if (!isAuthPayload(payload)) {
            return false;
        }

        return payload;
    } catch {
        return false
    }
}

export async function createJWT(payload: IAuthPayload): Promise<string> {
    const encodedSecret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new jose.SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(encodedSecret);
    return token;
}
