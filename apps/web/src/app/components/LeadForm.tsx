"use client";

import { useState, useTransition } from "react";
import { submitLead } from "@/app/actions/submitLead";

type FormState = { name: string; phone: string; email: string };
type FieldError = Partial<FormState>;

function validate(values: FormState): FieldError {
  const errors: FieldError = {};
  if (!values.name.trim()) errors.name = "이름을 입력해주세요.";
  if (!values.phone.trim()) {
    errors.phone = "전화번호를 입력해주세요.";
  } else if (!/^[0-9\-+\s()]{7,20}$/.test(values.phone.trim())) {
    errors.phone = "올바른 전화번호 형식이 아닙니다.";
  }
  if (!values.email.trim()) {
    errors.email = "이메일을 입력해주세요.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "올바른 이메일 형식이 아닙니다.";
  }
  return errors;
}

export default function LeadForm() {
  const [values, setValues] = useState<FormState>({ name: "", phone: "", email: "" });
  const [errors, setErrors] = useState<FieldError>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FieldError]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fieldErrors = validate(values);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setServerError(null);
    startTransition(async () => {
      const result = await submitLead(values);
      if (result.error) {
        setServerError(result.error);
      } else {
        setSubmitted(true);
      }
    });
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-green-200 bg-green-50 px-10 py-12 text-center">
        <svg
          className="h-12 w-12 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xl font-semibold text-green-800">문의가 접수되었습니다!</p>
        <p className="text-sm text-green-600">빠른 시간 내에 연락드리겠습니다.</p>
        <button
          onClick={() => { setValues({ name: "", phone: "", email: "" }); setSubmitted(false); }}
          className="mt-2 text-sm font-medium text-green-700 underline underline-offset-2 hover:text-green-900"
        >
          새로 입력하기
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex w-full flex-col gap-5">
      <Field
        label="이름"
        name="name"
        type="text"
        placeholder="홍길동"
        value={values.name}
        error={errors.name}
        onChange={handleChange}
        disabled={isPending}
      />
      <Field
        label="전화번호"
        name="phone"
        type="tel"
        placeholder="010-0000-0000"
        value={values.phone}
        error={errors.phone}
        onChange={handleChange}
        disabled={isPending}
      />
      <Field
        label="이메일"
        name="email"
        type="email"
        placeholder="example@email.com"
        value={values.email}
        error={errors.email}
        onChange={handleChange}
        disabled={isPending}
      />
      {serverError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{serverError}</p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="mt-2 h-12 w-full rounded-xl bg-blue-600 font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "제출 중..." : "문의 남기기"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  placeholder,
  value,
  error,
  onChange,
  disabled,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-zinc-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={[
          "h-11 rounded-xl border px-4 text-sm outline-none transition-colors",
          "placeholder:text-zinc-400 disabled:bg-zinc-50 disabled:opacity-60",
          "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          error
            ? "border-red-400 bg-red-50 focus:ring-red-400 focus:border-red-400"
            : "border-zinc-200 bg-white hover:border-zinc-400",
        ].join(" ")}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
