import "./index.css";

import ReactDOM from "react-dom/client";

import App from "./App";
import { LaunchedProvider } from "./dist";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  // <React.StrictMode>
  // <LaunchedProvider>
  <App />,
  // </LaunchedProvider>,
  // </React.StrictMode>
);
