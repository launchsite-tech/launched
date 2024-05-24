import { useLaunched } from "../../../dist";

import type { Schema } from "../../../siteSchema";
import type { FlatTagSchema } from "../../../dist/types/tag";

export default function About() {
  const { useTag } = useLaunched();

  const [description, descriptionTag] = useTag<Schema>("About description");
  const d = description as FlatTagSchema<Schema>["About description"];

  return (
    <section
      id="ABOUT"
      className="grid w-full max-w-[1500px] grid-cols-2 justify-items-center"
    >
      <img src="images/paper_illustration.svg" alt="Illustration"></img>
      <div className="text-home flex flex-col justify-center">
        <h2 className="max-w-xl tracking-tight">
          Spend less time switching tabs and more time{" "}
          <span className="decorated text-brand">writing</span>.
        </h2>
        <h3 ref={descriptionTag} className="z-0 mt-4 max-w-[34rem]">
          {d}
        </h3>
      </div>
    </section>
  );
}
