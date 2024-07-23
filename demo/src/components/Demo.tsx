import { useEffect } from "react";
import { useTag } from "../dist/core/hooks";

import { Sliders, HardDrive, GitBranch } from "react-feather";
import { Text, Image } from "../dist/components";
import { Rich } from "./TiptapEditor";

import Launched from "../dist";
import { allIcons } from "./IconEditor";

function Feature({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: number;
}) {
  const Icon = allIcons[icon];

  return (
    <li className="flex flex-col gap-2.5">
      <span
        data-key="icon"
        className="grid h-10 w-10 place-items-center rounded-full bg-brand-light/10 text-lg text-brand-mid"
      >
        <Icon style={{ width: "1em", height: "1em" }} />
      </span>
      <h3 data-key="title" className="text-xl">
        {title}
      </h3>
      <p
        data-key="description"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </li>
  );
}

const f = [
  {
    title: "Controlled control.",
    description:
      "Launched is a client-side content management system. You decide what content is editable.",
    icon: Sliders,
  },
  {
    title: "Entirely yours.",
    description:
      "Launched generates the content, you decide how and where it should be stored. It's your data.",
    icon: HardDrive,
  },
  {
    title: "All open-source.",
    description:
      "Launched is open-source. You can contribute to the project, or fork it and make it your own.",
    icon: GitBranch,
  },
];

export default function Demo() {
  const defaultFeatures = f.map(({ title, icon, description }) => ({
    title,
    icon: { type: "icon", value: allIcons.indexOf(icon) },
    description: { value: `<p>${description}</p>`, type: "rich" },
  }));
  const [features, featuresTag] = useTag("features", defaultFeatures, {
    arrayMutable: true,
  });

  function onDataUpdate(data: any) {
    console.log(data);
  }

  useEffect(() => {
    Launched.events.on("data:update", onDataUpdate);

    return () => {
      Launched.events.off("data:update", onDataUpdate);
    };
  }, []);

  return (
    <div className="flex flex-col gap-10 rounded-2xl bg-white p-10 text-bg sm:gap-20 sm:pt-20">
      <div className="flex grid-cols-2 flex-col-reverse gap-20 sm:px-10 lg:grid">
        <div className="flex flex-col gap-5">
          <Text element="h2" tag="title" className="text-5xl">
            Welcome to Launched.
          </Text>
          <Rich tag="description" className="text-lg">
            {
              "<p>Launched makes client site content editable. It's free, easy to integrate, and user-friendly. Switch to edit mode to see it in action.</p>"
            }
          </Rich>
        </div>
        <Image
          classNames={{
            container:
              "h-full w-full flex items-center justify-center rounded-2xl rounded-tl-[200px] bg-bg sm:mb-0 -mb-10",
            image: "animate-hover-in-place w-3/4",
          }}
          src="/chair.png"
          alt=""
          tag="hero image"
        />
      </div>
      <ul ref={featuresTag} className="grid gap-10 sm:px-10 lg:grid-cols-3">
        {features.map((props, i: number) => (
          <Feature key={i} {...props} />
        ))}
      </ul>
      <div className="relative flex w-full overflow-hidden rounded-2xl bg-bg p-5 sm:p-10">
        <div className="z-10 flex w-72 flex-col gap-5">
          <Text
            element="h3"
            tag="banner title"
            className="w-max text-3xl text-text-primary sm:text-5xl"
          >
            Get started.
          </Text>
          <Rich tag="banner text" className="text-text-secondary">
            {
              "<p>Check out our quickstart guides to get up and running with Launched.</p>"
            }
          </Rich>
          <button className="btn w-max text-text-secondary">Get started</button>
        </div>
        <img
          className="absolute right-0 top-0 -my-10 -ml-20 h-full object-cover md:static"
          src="/space.png"
          alt=""
        />
      </div>
    </div>
  );
}
