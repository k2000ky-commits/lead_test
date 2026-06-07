import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  // 길이가 다를 때도 비교를 수행해 길이 정보를 타이밍으로 노출하지 않음
  if (bufA.length !== bufB.length) {
    timingSafeEqual(bufA, Buffer.alloc(bufA.length));
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export function middleware(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }

  const authHeader = request.headers.get("authorization");

  if (authHeader?.startsWith("Basic ")) {
    const credentials = Buffer.from(authHeader.slice(6), "base64").toString("utf-8");
    // split(":") 대신 indexOf로 처리해 비밀번호에 ":" 포함 시에도 정상 동작
    const colonIndex = credentials.indexOf(":");
    const password = colonIndex !== -1 ? credentials.substring(colonIndex + 1) : "";
    if (safeCompare(password, adminPassword)) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin", charset="UTF-8"',
    },
  });
}

export const config = {
  // _next/static, _next/image, favicon.ico 는 인증 없이 통과
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
