// lib/admin-auth.ts
// Shared helper: validates the X-Admin-Password header in API route handlers.

import { NextRequest, NextResponse } from "next/server";

export function requireAdmin(request: NextRequest): NextResponse | null {
  const password = request.headers.get("x-admin-password");
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null; // authorized
}
