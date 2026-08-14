import { NextResponse } from "next/server";

import {
  GATE_DISABLED_MESSAGE,
  GATE_INVALID_PASSWORD_MESSAGE,
  GATE_MALFORMED_REQUEST_MESSAGE,
  createGateSession,
  gateCookieOptions,
  parseUnlockSubmission,
  resolveGateConfig,
  timingSafeEqual,
} from "../../../lib/gate";

export async function POST(request: Request) {
  const gate = resolveGateConfig();

  if (!gate.enabled) {
    return NextResponse.json({ error: GATE_DISABLED_MESSAGE }, { status: 404 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: GATE_MALFORMED_REQUEST_MESSAGE },
      { status: 400 },
    );
  }

  let submission;

  try {
    submission = parseUnlockSubmission(body);
  } catch (caught) {
    return NextResponse.json(
      { error: (caught as Error).message },
      { status: 400 },
    );
  }

  if (!timingSafeEqual(submission.password, gate.password)) {
    return NextResponse.json(
      { error: GATE_INVALID_PASSWORD_MESSAGE },
      { status: 401 },
    );
  }

  const session = await createGateSession(gate.password, Date.now());
  const response = NextResponse.json({ next: submission.next });

  response.cookies.set(
    session.name,
    session.value,
    gateCookieOptions(process.env.NODE_ENV === "production"),
  );

  return response;
}
