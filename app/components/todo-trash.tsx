import { permanentlyDeleteTodo, restoreTodo } from "@/app/actions";
import type { Ref } from "react";
import type { TodoItem } from "./todo-items";

type Props = {
  dialog: Ref<HTMLDialogElement>;
  todos: TodoItem[];
};

export default function TodoTrash({ dialog, todos }: Props) {
  return (
    <dialog ref={dialog} aria-labelledby="trash-title">
      <h2 id="trash-title">휴지통</h2>
      {!todos.length && <p>휴지통이 비어 있습니다.</p>}
      <div className="trash-todo">
        {todos.map((todo) => (
          <article className="todo" key={todo.id}>
            <h3>
              <time dateTime={todo.date}>{todo.date}</time> {todo.title}
            </h3>
            <p>{todo.content}</p>
            <form className="actions" action={restoreTodo}>
              <input type="hidden" name="id" value={todo.id} />
              <button className="recover" type="submit">
                복구
              </button>
              <button
                className="danger"
                type="submit"
                formAction={permanentlyDeleteTodo}
                onClick={(event) => {
                  if (!window.confirm("영구 삭제하시겠습니까?")) {
                    event.preventDefault();
                  }
                }}
              >
                영구 삭제
              </button>
            </form>
          </article>
        ))}
      </div>
      <form method="dialog">
        <button>닫기</button>
      </form>
    </dialog>
  );
}
