import { useTag } from "../../../dist";
import Text from "../../../dist/components/Text";

import GetStartedButton from "./GetStartedButton";

export default function Hero() {
  const [image, imageTag] = useTag(
    "image",
    "/images/ink_illustration.svg",
    "image",
  );

  return (
    <main className="grid w-full max-w-[1500px] grid-cols-2">
      <div className="flex min-w-[700px] flex-col justify-center pl-28 text-home">
        <h1 className="tracking-tight">
          Write incredible{" "}
          <span className="decorated font-script text-brand">poetry&nbsp;</span>{" "}
          with the power of AI
        </h1>
        <Text tag="hero description" className="mt-4 max-w-xl">
          Write incredible poetry with the power of AI. Our AI can help you
          write poems, lyrics, and more. Get started now!
        </Text>
        <div className="mt-8 flex">
          <GetStartedButton />
          <button
            onClick={() =>
              document
                .getElementById("SERVICES")!
                .scrollIntoView({ behavior: "smooth" })
            }
            className="px-6 py-2 font-sans text-home-lgt hover:text-home"
          >
            Learn More
          </button>
        </div>
      </div>
      <div ref={imageTag} className="max-h-[80vh] justify-self-center">
        <img className="h-full w-full" src={image} alt="Illustration"></img>
      </div>
    </main>
  );
}
