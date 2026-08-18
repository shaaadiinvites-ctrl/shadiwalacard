import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const logPath = path.join(process.cwd(), "frontend_logs.txt");
    fs.appendFileSync(logPath, new Date().toISOString() + " - " + JSON.stringify(data) + "\n");
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to log" }, { status: 500 });
  }
}
