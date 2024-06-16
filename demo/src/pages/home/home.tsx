import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import GetStarted from "./components/GetStarted";
import Footer from "./components/Footer";

function App() {
  return (
    <main id="HOME" className="flex w-full flex-col items-center bg-salmon">
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
