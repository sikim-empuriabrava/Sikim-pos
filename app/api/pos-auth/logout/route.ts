import { NextRequest, NextResponse } from "next/server";
import { clearPosSessionCookie } from "@/lib/pos-auth";

function logout(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url), {
    status: 303,
  });
  clearPosSessionCookie(response);
  return response;
}

export function POST(request: NextRequest) {
  return logout(request);
}

export function GET() {
  return new NextResponse(null, {
    headers: { Allow: "POST" },
    status: 405,
  });
}
