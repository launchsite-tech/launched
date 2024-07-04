import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Monologue from "./components/Monologue";
import Lottie from "react-lottie";

import animation from "./animations/New_Lottie.json";

export default function App() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="mx-auto w-full max-w-screen-lg">
      <Nav />
      <Hero />
      <div className="h-screen rounded-2xl bg-white"></div>
      {/* <Monologue /> */}
      {/* <Lottie options={defaultOptions} height={400} /> */}
    </div>
  );
}
