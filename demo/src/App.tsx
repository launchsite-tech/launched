import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Demo from "./components/Demo";
import Footer from "./components/Footer";
import { LaunchedProvider } from "launched";
import { richTextRenderer } from "./components/TiptapEditor";

import type { Config } from "launched";

import Launched from "launched";

Launched.registerTagFormat("rich", richTextRenderer);

const config: Config = {
  toolbarOptions: {
    className: "!block !relative w-max -order-1 -mb-5",
  },
  determineVisibility: () => true,
  locked: true,
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
