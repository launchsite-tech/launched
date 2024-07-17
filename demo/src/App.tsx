import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Demo from "./components/Demo";
import { LaunchedProvider } from "launched";

import type { Config } from "launched";

const config: Config = {
  toolbarOptions: {
    className: "!block !sticky w-max -order-1 !top-20 -mb-5",
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
    </>
  );
}
