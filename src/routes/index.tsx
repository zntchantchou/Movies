import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
// import ClientComp from "../components/ClientComp/ClientComp";

export const Route = createFileRoute("/")({
  component: Index,
  // @ts-expect-error une erreur est vite corrigee
  loader: ({ context }) => context.serverData,
});

function Index() {
  console.log("Index Facts: ", Route.useLoaderData());
  const apiData = Route.useLoaderData() as { value: string };
  useEffect(() => {
    console.log("INDEX NOW ON CLIENT");
  }, []);
  return (
    <>
      <p>FACTS: </p>
      {apiData?.value ? apiData.value : null}
      {/* <ClientComp /> */}
    </>
  );
}
