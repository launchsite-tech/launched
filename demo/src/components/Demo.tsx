import { useEffect } from "react";
import { useTag } from "launched";

import { Sliders, HardDrive, GitBranch } from "react-feather";
import { Text, Image } from "launched/components";
import { Rich } from "./TiptapEditor";

import Launched from "launched";

function Feature({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex flex-col gap-2.5">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-light/10 text-brand-mid">
        {children}
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
    icon: <Sliders size={18} />,
  },
  {
    title: "Entirely yours.",
    description:
      "Launched generates the content, you decide how and where it should be stored. It's your data.",
    icon: <HardDrive size={18} />,
  },
  {
    title: "All open-source.",
    description:
      "Launched is open-source. You can contribute to the project, or fork it and make it your own.",
    icon: <GitBranch size={18} />,
  },
];

export default function Demo() {
  const defaultFeatures = f.map(({ title, description }) => ({
    title: title,
    description: { value: `<p>${description}</p>`, type: "rich" },
  }));
  const [features, featuresTag] = useTag(
    "features",
    defaultFeatures,
    "object",
    { isMutable: true },
  );

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
    <div className="flex flex-col gap-20 rounded-2xl bg-white p-20 text-bg">
      <div className="grid grid-cols-2 gap-20">
        <div className="flex flex-col gap-5">
          <Text element="h2" tag="title" className="text-5xl">
            Welcome to Launched.
          </Text>
          <Rich tag="description" className="text-lg">
            {
              "<p>Launched makes client site content editable. It&rsquo;s free, easy to integrate, and user-friendly. Switch to edit mode to see it in action.</p>"
            }
          </Rich>
        </div>
        <Image
          classNames={{
            container:
              "grid h-full w-full place-items-center rounded-2xl rounded-tl-[200px] bg-bg",
            image: "animate-hover-in-place h-3/4 w-3/4",
          }}
          src="/chair.png"
          alt=""
          tag="hero image"
        />
      </div>
      <ul ref={featuresTag} className="grid grid-cols-3 gap-10">
        {features.map(({ title, description }, i: number) => (
          <Feature key={i} title={title} description={description}>
            {f[i].icon}
          </Feature>
        ))}
      </ul>
      <div className="flex w-full overflow-hidden rounded-2xl bg-bg p-10">
        <div className="flex w-72 flex-col gap-5">
          <Text
            element="h3"
            tag="banner title"
            className="w-max text-5xl text-text-primary"
          >
            Get started.
          </Text>
          <Rich tag="banner text" className="text-text-secondary">
            Check out our quickstart guides to get up and running with Launched.
          </Rich>
          <button className="btn w-max text-text-secondary">Get started</button>
        </div>
        <img className="-my-10 -ml-20" src="/space.png" alt="" />
      </div>
    </div>
  );
}
