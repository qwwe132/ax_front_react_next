"use client";

import { useActionState, useState } from "react";
import { authenticate } from "../auth/actions";

export default function AuthForm({ notice }: { notice?: string }) {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <>
      <div className="actions">
        <button type="button" aria-pressed={mode === "login"} onClick={() => setMode("login")}>
          로그인
        </button>
        <button type="button" aria-pressed={mode === "signup"} onClick={() => setMode("signup")}>
          회원가입
        </button>
      </div>
      <CredentialsForm key={mode} mode={mode} notice={notice} />
    </>
  );
}

function CredentialsForm({ mode, notice }: { mode: "login" | "signup"; notice?: string }) {
  const [message, action, pending] = useActionState(authenticate.bind(null, mode), "");
  const signingUp = mode === "signup";

  return (
    <form action={action} className="auth-form">
      <label>
        이메일
        <input type="email" name="email" autoComplete="email" required />
      </label>
      <label>
        비밀번호
        <input
          type="password"
          name="password"
          autoComplete={signingUp ? "new-password" : "current-password"}
          required
        />
      </label>
      <button className="primary" type="submit" disabled={pending}>
        {signingUp ? "가입하기" : "로그인"}
      </button>
      {(message || notice) && <p role="status">{message || notice}</p>}
    </form>
  );
}
