// import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getTodosQuery } from "../http/queries";
// import { getTodos } from "../http/http";
// import ClientComp from "../components/ClientComp/ClientComp";

export const Route = createFileRoute("/")({
  component: Index,
  loader: ({ context }) => {
    // console.log("Content in loader :", context.queryClient);
    // request is only made on the server + sent to cache
    return context.queryClient.ensureQueryData({
      ...getTodosQuery,
      revalidateIfStale: true,
    });
  },
});

type Todo = {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
};
function Index() {
  const apiData = Route.useLoaderData() as { todos: Todo[] };
  return (
    <>
      <p>FACTS: </p>
      {apiData.todos
        ? apiData.todos.map((t) => <div key={t.id}>{t.todo}</div>)
        : null}
      {/* <ClientComp /> */}
    </>
  );
}
