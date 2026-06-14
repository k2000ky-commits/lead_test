"use client";

import { useState } from "react";

export default function ErrorTrigger() {
  const [boom, setBoom] = useState(false);
  if (boom) throw new Error("테스트 에러");

  return (
    <button
      onClick={() => setBoom(true)}
      className="mt-4 text-xs text-zinc-400 underline underline-offset-2 hover:text-red-400"
    >
      [에러 테스트]
    </button>
  );
}
