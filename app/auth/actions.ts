"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function authenticate(
  mode: "login" | "signup",
  _previousMessage: string,
  formData: FormData,
) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || !email.trim() ||
      typeof password !== "string" || !password) {
    return "이메일과 비밀번호를 입력해 주세요.";
  }

  const sb = await createClient();
  const credentials = { email: email.trim(), password };

  if (mode === "signup") {
    const { data, error } = await sb.auth.signUp(credentials);

    if (error) {
      return error.code === "weak_password"
        ? "비밀번호를 더 길고 복잡하게 설정해 주세요."
        : "회원가입을 완료하지 못했습니다. 입력 정보를 확인해 주세요.";
    }

    if (!data.session) {
      return "확인 메일이 도착하면 링크를 열어 가입을 완료해 주세요.";
    }
  } else {
    const { error } = await sb.auth.signInWithPassword(credentials);

    if (error) {
      return error.code === "email_not_confirmed"
        ? "가입 확인 메일의 링크를 먼저 열어 주세요."
        : "로그인하지 못했습니다. 이메일과 비밀번호를 확인해 주세요.";
    }
  }

  redirect("/");
}

export async function signOut() {
  const sb = await createClient();
  const { error } = await sb.auth.signOut({ scope: "local" });
  if (error) redirect("/login?notice=logout");
  redirect("/login");
}
