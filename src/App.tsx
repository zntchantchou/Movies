import { useEffect } from "react";
import "./App.scss";

function App() {
  console.log("App 1");
  useEffect(() => {
    console.log("App useffect");
  }, []);

  return (
    <>
      {/* Add header */}
      <h1> Vite + React + SSR </h1>
      {/* Add footer */}
    </>
  );
}

export default App;
