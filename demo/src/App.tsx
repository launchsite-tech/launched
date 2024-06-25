import Nav from "./components/Nav";
import Hero from "./components/Hero";

export default function App() {
  return (
    <div className="mx-auto w-full max-w-screen-lg">
      <Nav />
      <Hero />
      <div className="h-screen w-full rounded-2xl bg-white" />
    </div>
  );
}
