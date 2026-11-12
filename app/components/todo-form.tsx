import { addTodo, updateTodo } from "@/app/actions";
import Link from "next/link";
import type { TodoItem } from "./todo-items";

type Props = {
  todo?: TodoItem;
  onCancel: () => void;
  onOpenTrash: () => void;
};

export default function TodoForm({ todo, onCancel, onOpenTrash }: Props) {
  return (
    <form action={todo ? updateTodo : addTodo}>
      {todo && <input type="hidden" name="id" value={todo.id} />}
      <label>
        날짜
        <input name="date" type="date" defaultValue={todo?.date} required />
      </label>
      <label>
        제목
        <input name="title" defaultValue={todo?.title} placeholder="제목 입력" required />
      </label>
      <label>
        내용
        <textarea name="content" defaultValue={todo?.content} placeholder="내용 입력" required />
      </label>
      <div className="toolbar">
        <div className="sort-wrap" aria-label="정렬">
          <Link href="/?sort=created">등록순</Link>
          <Link href="/?sort=date">날짜순</Link>
        </div>
        <button className="primary" type="submit">
          {todo ? "수정 저장" : "등록하기"}
        </button>
        {todo && <button type="button" onClick={onCancel}>취소</button>}
        <button type="button" onClick={onOpenTrash}>
          휴지통
        </button>
      </div>
    </form>
  );
}
