import { useTag } from "../../../dist";

import GetStartedButton from "./GetStartedButton";
import type { Schema } from "../../../siteSchema";

export default function Hero() {
  const [description, descriptionTag] = useTag<Schema>("Hero description");

  return (
    <main className="grid w-full max-w-[1500px] grid-cols-2">
      <div className="flex min-w-[700px] flex-col justify-center pl-28 text-home">
        <h1 className="tracking-tight">
          Write incredible{" "}
          <span className="decorated font-script text-brand">poetry&nbsp;</span>{" "}
          with the power of AI
        </h1>
        <p ref={descriptionTag} className="mt-4 max-w-xl">
          {description}
        </p>
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
      <img
        className="max-h-[80vh] justify-self-center"
        src="/images/ink_illustration.svg"
        alt="Illustration"
      ></img>
    </main>
  );
}
