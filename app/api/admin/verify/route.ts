import { NextRequest, NextResponse } from "next/server";

const ADMIN_KEY = process.env.ADMIN_SECRET_KEY || "aiming2026admin";

export async function POST(req: NextRequest) {
  try {
    const { key } = await req.json();
    return NextResponse.json({ ok: key === ADMIN_KEY });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
