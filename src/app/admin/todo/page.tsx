import type { Metadata } from "next";
import Link from "next/link";
import { AdminGate } from "@/components/admin-gate";
import {
  todos,
  TODOS_UPDATED,
  type Todo,
  type TodoPriority,
} from "@/content/todos";

export const metadata: Metadata = {
  title: "Todo",
  robots: { index: false, follow: false },
};

const PRIORITY_ORDER: Record<TodoPriority, number> = {
  blocker: 0,
  high: 1,
  normal: 2,
  low: 3,
};

/** Priority is encoded in form as well as text so it reads at a glance. */
function PriorityChip({ priority }: { priority: TodoPriority }) {
  const styles: Record<TodoPriority, string> = {
    blocker: "border-btn bg-btn text-btn-fg",
    high: "border-rule-strong bg-rule-strong text-deep",
    normal: "border-rule text-muted",
    low: "border-rule text-muted",
  };
  return (
    <span
      className={`label rounded-xs border px-1.5 py-0.5 ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}

function TodoItem({ todo }: { todo: Todo }) {
  const done = todo.status === "done";
  return (
    <li className="border-b border-rule py-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h3
          className={`display text-lg ${
            done ? "text-muted line-through" : "text-heading"
          }`}
        >
          {todo.title}
        </h3>
        {done ? (
          <span className="label rounded-xs border border-rule px-1.5 py-0.5 text-muted">
            done
          </span>
        ) : (
          <PriorityChip priority={todo.priority} />
        )}
        <span className="label text-muted">
          {todo.owner} · {todo.area}
        </span>
      </div>
      <p
        className={`mt-2 max-w-2xl text-sm leading-relaxed ${
          done ? "text-muted" : "text-charcoal"
        }`}
      >
        {todo.detail}
      </p>
    </li>
  );
}

export default function AdminTodoPage() {
  const open = todos
    .filter((t) => t.status !== "done")
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
  const done = todos.filter((t) => t.status === "done");

  return (
    <AdminGate>
      <section className="bg-cream">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <Link
            href="/admin"
            className="label text-muted underline decoration-accent-line underline-offset-4 transition-colors hover:text-heading"
          >
            ← Admin
          </Link>
          <h1 className="display mt-4 text-4xl text-heading">Todo</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-charcoal">
            {open.length} open, {done.length} done. Source of truth is{" "}
            <code className="font-mono text-heading">src/content/todos.ts</code>
            , which the <code className="font-mono text-heading">/doc</code>{" "}
            sweep keeps in sync. Last updated {TODOS_UPDATED}.
          </p>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <h2 className="label text-muted">Open</h2>
          <ul className="mt-2 border-t border-rule">
            {open.map((t) => (
              <TodoItem key={t.id} todo={t} />
            ))}
          </ul>

          {done.length > 0 ? (
            <>
              <h2 className="label mt-12 text-muted">Done</h2>
              <ul className="mt-2 border-t border-rule">
                {done.map((t) => (
                  <TodoItem key={t.id} todo={t} />
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </section>
    </AdminGate>
  );
}
