import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const decodeBase64 = (value: string): string | null => {
  if (typeof atob !== "function") {
    return null;
  }
  try {
    return atob(value);
  } catch {
    return null;
  }
};

const safeEqual = (a: string, b: string): boolean => {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
};

const unauthorizedResponse = (): NextResponse =>
  new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin", charset="UTF-8"',
    },
  });

export const config = {
  matcher: ["/admin/:path*"],
};

export const middleware = (request: NextRequest): NextResponse => {
  const expectedUser = process.env.ADMIN_BASIC_USER ?? "";
  const expectedPass = process.env.ADMIN_BASIC_PASS ?? "";

  if (!expectedUser || !expectedPass) {
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.next();
    }
    return unauthorizedResponse();
  }

  const authHeader = request.headers.get("authorization") ?? "";
  const [scheme, encoded] = authHeader.split(" ");
  if (scheme !== "Basic" || !encoded) {
    return unauthorizedResponse();
  }

  const decoded = decodeBase64(encoded);
  if (!decoded) {
    return unauthorizedResponse();
  }

  const separatorIndex = decoded.indexOf(":");
  if (separatorIndex < 0) {
    return unauthorizedResponse();
  }

  const username = decoded.slice(0, separatorIndex);
  const password = decoded.slice(separatorIndex + 1);

  // TODO: Replace Basic Auth with a more robust admin auth solution.
  const isValid = safeEqual(username, expectedUser) && safeEqual(password, expectedPass);
  if (!isValid) {
    return unauthorizedResponse();
  }

  return NextResponse.next();
};
