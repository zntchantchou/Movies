// "use client";

import { useEffect } from "react";
import "./ClientComp.scss";

function ClientComp() {
  useEffect(() => {
    console.log("[clientcomp]");
  }, []);
  console.log("Hello");
  return <p className="root">Client Comp</p>;
}

export default ClientComp;
