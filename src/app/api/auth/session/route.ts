import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
        return NextResponse.json({ session: null }, { status: 200 });
    }
    return NextResponse.json({ session }, { status: 200 });
}
