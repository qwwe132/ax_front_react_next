import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const destination = new URL("/login?notice=confirm", request.url);

  if (tokenHash) {
    const sb = await createClient();
    const { error } = await sb.auth.verifyOtp({ token_hash: tokenHash, type: "email" });
    if (!error) return redirectWithoutCache(new URL("/", request.url));
  }

  return redirectWithoutCache(destination);
}

function redirectWithoutCache(url: URL) {
  return NextResponse.redirect(url, {
    headers: { "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer" },
  });
}
