import { deleteTodo } from "@/app/actions";

export type TodoItem = {
  id: string | number;
  date: string;
  title: string;
  content: string;
};

function formatTodoDate(date: string) {
  const parts = /^(\d{4})-(\d{2})-(\d{2})(?:$|[T ])/.exec(date);
  if (!parts) return date;

  const [, year, month, day] = parts;
  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
}

export default function TodoItems({ todos, onEdit }: { todos: TodoItem[]; onEdit: (todo: TodoItem) => void }) {
  if (!todos.length) return <p>등록된 할 일이 없습니다.</p>;

  return (
    <section className="todo-wrap" aria-label="할 일 목록">
      {todos.map((todo) => (
        <article className="todo" key={todo.id}>
          <h2>
            <time dateTime={todo.date}>{formatTodoDate(todo.date)}</time> · {todo.title}
          </h2>
          <p>{todo.content}</p>
          <form className="actions" action={deleteTodo}>
            <input type="hidden" name="id" value={todo.id} />
            <button className="danger" type="submit">
              삭제
            </button>
            <button className="edit" type="button" onClick={() => onEdit(todo)}>
              수정
            </button>
          </form>
        </article>
      ))}
    </section>
  );
}
