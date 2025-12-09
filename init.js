const rootElt = document.getElementById("root");
const preLoader = document.getElementById("pre-loader");

setTimeout(() => {
  preLoader.style.visibility = "none";
  rootElt.style.visibility = "visible";
}, 1000);
