"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function reportError(message: string, digest?: string) {
  console.log("[reportError] API key 존재:", !!process.env.RESEND_API_KEY);
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "kikiy2000@naver.com",
      subject: "[에러 알림] 웹 앱에서 오류가 발생했습니다",
      text: [
        `발생 시각: ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}`,
        `에러 메시지: ${message}`,
        digest ? `Digest: ${digest}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    });
  } catch {
    // 이메일 발송 실패는 조용히 넘김 (에러 리포팅 자체가 크래시를 유발하지 않도록)
  }
}
