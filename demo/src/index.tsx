import "./index.css";

import ReactDOM from "react-dom/client";
import App from "./pages/home/home";

import { LaunchedProvider } from "./dist";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  // <React.StrictMode>
  <LaunchedProvider
    config={{
      save: (tags) => console.log(tags),
    }}
  >
    <App />
  </LaunchedProvider>,
  // </React.StrictMode>
);
