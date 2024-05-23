// import { useLaunched } from "../../dist/index";
// import { Schema } from "../../siteSchema";
// import type { FlatTagSchema } from "../../dist/types/tag";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import GetStarted from "./components/GetStarted";
import Footer from "./components/Footer";

function App() {
  // const { useTag } = useLaunched();

  // const [title, titleTag] = useTag<Schema>("title");
  // const [description, descriptionTag] = useTag<Schema>("description");
  // const [cards, cardsTag] = useTag<Schema>("cards");

  // const t = title as FlatTagSchema<Schema>["title"];
  // const d = description as FlatTagSchema<Schema>["description"];
  // const c = cards as FlatTagSchema<Schema>["cards"];

  return (
    <main id="HOME" className="bg-salmon flex w-full flex-col items-center">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <GetStarted />
      <Footer />
    </main>
  );
}

export default App;
