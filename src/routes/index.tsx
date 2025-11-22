import { createFileRoute } from "@tanstack/react-router";
import ClientComp from "../components/ClientComp/ClientComp";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  return (
    <>
      <ClientComp />;<p>Hello</p>;<div>I am the Index component haha</div>;
    </>
  );
}
