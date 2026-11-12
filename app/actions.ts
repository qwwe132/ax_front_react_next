"use server";

import { requireTodoUser } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addTodo(formData: FormData) {
  const { sb, userId } = await requireTodoUser();

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const date = formData.get("date");

  if (!title || title.trim() === "") {
    return;
  }

  if (!content) {
    return;
  }

  const { error } = await sb.from("todos").insert([
    {
      title: title.trim(),
      content: content,
      date: date,
      is_delete: false,
      user_id: userId,
    },
  ]);

  if (error) {
    console.log("데이터 추가 에러 : ", error.message);
    return;
  }

  revalidatePath("/");
}

export async function getTodoList(orderCreate: boolean, orderDate: boolean) {
  const { sb, userId } = await requireTodoUser();

  let query = sb
    .from("todos")
    .select("id,date,title,content")
    .eq("user_id", userId)
    .eq("is_delete", false);

  if (orderCreate) {
    query = query.order("created_at", { ascending: true });
  }

  if (orderDate) {
    query = query.order("date", { ascending: false });
  }

  const { data: todos, error } = await query;

  return { todos, error };
}

export async function getDeleteTodoList() {
  const { sb, userId } = await requireTodoUser();

  const { data: todos, error } = await sb
    .from("todos")
    .select("id,date,title,content")
    .eq("user_id", userId)
    .eq("is_delete", true)
    .order("created_at", { ascending: true });

  return { todos, error };
}

export async function restoreTodo(formData: FormData) {
  const id = formData.get("id");

  if (typeof id !== "string" || id.trim() === "") {
    return;
  }

  const { sb, userId } = await requireTodoUser();
  const { error } = await sb
    .from("todos")
    .update({ is_delete: false })
    .eq("id", id)
    .eq("user_id", userId)
    .eq("is_delete", true);

  if (error) {
    console.log("데이터 복구 에러 : ", error.message);
    return;
  }

  revalidatePath("/");
}

export async function updateTodo(formData: FormData) {
  const id = formData.get("id");
  const title = formData.get("title");
  const content = formData.get("content");
  const date = formData.get("date");

  if (
    typeof id !== "string" || !id.trim() ||
    typeof title !== "string" || !title.trim() ||
    typeof content !== "string" || !content.trim() ||
    typeof date !== "string" || !date
  ) {
    return;
  }

  const { sb, userId } = await requireTodoUser();
  const { error } = await sb
    .from("todos")
    .update({ title: title.trim(), content, date })
    .eq("id", id)
    .eq("user_id", userId)
    .eq("is_delete", false);

  if (error) {
    console.log("데이터 수정 에러 : ", error.message);
    return;
  }

  revalidatePath("/");
}

export async function deleteTodo(formData: FormData) {
  const id = formData.get("id");

  if (typeof id !== "string" || id.trim() === "") {
    return;
  }

  const { sb, userId } = await requireTodoUser();
  const { error } = await sb
    .from("todos")
    .update({ is_delete: true })
    .eq("id", id)
    .eq("user_id", userId)
    .eq("is_delete", false);

  if (error) {
    console.log("데이터 삭제 에러 : ", error.message);
    return;
  }

  revalidatePath("/");
}

export async function permanentlyDeleteTodo(formData: FormData) {
  const id = formData.get("id");

  if (typeof id !== "string" || id.trim() === "") {
    return;
  }

  const { sb, userId } = await requireTodoUser();
  const { error } = await sb
    .from("todos")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)
    .eq("is_delete", true);

  if (error) {
    console.log("데이터 영구 삭제 에러 : ", error.message);
    return;
  }

  revalidatePath("/");
}
