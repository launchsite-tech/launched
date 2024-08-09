import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Demo from "./components/Demo";
import Footer from "./components/Footer";
import { LaunchedProvider } from "./dist/core/context";
import { richTextRenderer } from "./components/TiptapEditor";
import { iconRenderer } from "./components/IconEditor";

import type { Config } from "./dist";

import Launched from "./dist";

Launched.registerTagFormat("rich", richTextRenderer);
Launched.registerTagFormat("icon", iconRenderer);

const config: Config = {
  toolbarOptions: {
    className: "!block !relative w-max -order-1 -mb-5",
  },
  determineVisibility: () => true,
  locked: true,
  save: () =>
    document.getElementById("dataview")?.scrollIntoView({ behavior: "smooth" }),
};

export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <LaunchedProvider config={config}>
        <Demo />
      </LaunchedProvider>
      <Footer />
    </>
  );
}
