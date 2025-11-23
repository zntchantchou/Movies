// "use client";

import { useEffect } from "react";
import "./ClientComp.css";

function ClientComp() {
  useEffect(() => {
    console.log("[clientcomp]");
  }, []);
  console.log("Hello");
  return (
    <>
      <div style={{ backgroundColor: "blue" }}>
        <p className="root" style={{ color: "green", fontSize: 40 }}>
          Client Comp
        </p>
      </div>
      <div className="root">
        <p>Styled with scss !!</p>
      </div>
    </>
  );
}

export default ClientComp;
