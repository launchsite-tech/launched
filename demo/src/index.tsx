import "./index.css";

import ReactDOM from "react-dom/client";

import App from "./App";
import { LaunchedProvider } from "./dist";

import type { Config } from "./dist";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

const config: Config = {
  toolbarOptions: {
    className: "!static",
  },
  locked: true,
};

root.render(
  // <React.StrictMode>
  <LaunchedProvider config={config}>
    <App />
  </LaunchedProvider>,
  // </React.StrictMode>
);
