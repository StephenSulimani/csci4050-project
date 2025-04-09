import { NextRequest } from "next/server";

export interface ICustomNextRequest extends NextRequest {
    userId: string;
}

