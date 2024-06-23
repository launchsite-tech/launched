import "./index.css";

import ReactDOM from "react-dom/client";

import { LaunchedProvider } from "./dist";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  // <React.StrictMode>
  <LaunchedProvider>
    <main>Demo</main>
  </LaunchedProvider>,
  // </React.StrictMode>
);
