"use client";

import { useRef, useState } from "react";
import { signOut } from "../auth/actions";
import TodoForm from "./todo-form";
import TodoItems, { type TodoItem } from "./todo-items";
import TodoTrash from "./todo-trash";

export default function TodoList({
  todos,
  trashedTodos,
}: {
  todos: TodoItem[];
  trashedTodos: TodoItem[];
}) {
  const [editingId, setEditingId] = useState<TodoItem["id"]>();
  const editingTodo = todos.find((todo) => todo.id === editingId);
  const trashDialog = useRef<HTMLDialogElement>(null);

  return (
    <>
      <header className="account-header">
        <h1>할 일 {editingTodo ? "수정" : "등록"}</h1>
        <form action={signOut}>
          <button type="submit">로그아웃</button>
        </form>
      </header>
      <main>
        <TodoForm
          key={editingTodo ? JSON.stringify(editingTodo) : "add"}
          todo={editingTodo}
          onCancel={() => setEditingId(undefined)}
          onOpenTrash={() => trashDialog.current?.showModal()}
        />
        <TodoItems todos={todos} onEdit={(todo) => setEditingId(todo.id)} />
      </main>
      <TodoTrash dialog={trashDialog} todos={trashedTodos} />
    </>
  );
}
