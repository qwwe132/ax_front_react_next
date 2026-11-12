import { Suspense } from "react";
import AuthForm from "./auth-form";

export default function Login({ searchParams }: PageProps<"/login">) {
  return (
    <>
      <header><h1>할 일 목록</h1></header>
      <main>
        <Suspense fallback={<AuthForm />}>
          <LoginContent searchParams={searchParams} />
        </Suspense>
      </main>
    </>
  );
}

async function LoginContent({ searchParams }: Pick<PageProps<"/login">, "searchParams">) {
  const { notice } = await searchParams;
  const message = notice === "confirm"
    ? "인증 링크가 만료되었거나 올바르지 않습니다."
    : notice === "logout" ? "로그아웃하지 못했습니다. 다시 시도해 주세요." : "";

  return <AuthForm notice={message} />;
}
