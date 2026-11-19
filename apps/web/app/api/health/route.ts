
import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ service: "Singles Meal API", status: "ok", mode: "starter", timestamp: new Date().toISOString() });
}
