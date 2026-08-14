import { NextResponse, type NextRequest } from "next/server";

import {
  GATE_COOKIE_NAME,
  buildUnlockPath,
  isGateBypassPath,
  resolveGateConfig,
  verifyGateToken,
} from "./lib/gate";

export async function proxy(request: NextRequest) {
  const gate = resolveGateConfig();

  if (!gate.enabled) {
    return NextResponse.next();
  }

  const { pathname, search } = request.nextUrl;

  if (isGateBypassPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(GATE_COOKIE_NAME)?.value;

  if (await verifyGateToken(token, gate.password, Date.now())) {
    return NextResponse.next();
  }

  const unlock = new URL(
    buildUnlockPath(`${pathname}${search}`),
    request.nextUrl.origin,
  );
  const response = NextResponse.redirect(unlock);
  response.headers.set("x-robots-tag", "noindex, nofollow");

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
