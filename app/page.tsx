import { connection } from "next/server";
import { Suspense } from "react";
import { getDeleteTodoList, getTodoList } from "./actions";
import TodoList from "./components/todo-list";

export default function Home({ searchParams }: PageProps<"/">) {
  return (
    <Suspense fallback={<p role="status">할 일을 불러오는 중입니다…</p>}>
      <TodoListContent searchParams={searchParams} />
    </Suspense>
  );
}

async function TodoListContent({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  await connection();
  const { sort } = await searchParams;
  const isDateOrder = sort === "date";
  const [active, trash] = await Promise.all([
    getTodoList(!isDateOrder, isDateOrder),
    getDeleteTodoList(),
  ]);

  if (active.error || trash.error) {
    return <p role="alert">할 일을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>;
  }

  return (
    <TodoList todos={active.todos ?? []} trashedTodos={trash.todos ?? []} />
  );
}
