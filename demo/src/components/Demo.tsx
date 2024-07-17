import { useEffect } from "react";

import { Sliders, HardDrive, GitBranch } from "react-feather";

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
      <h3 className="text-xl">{title}</h3>
      <p>{description}</p>
    </li>
  );
}

export default function Demo() {
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
          <h2 className="text-5xl">Welcome to Launched.</h2>
          <p className="text-lg">
            Launched makes client site content editable. It&rsquo;s free, easy
            to integrate, and user-friendly. Switch to edit mode to see it in
            action.
          </p>
        </div>
        <div className="grid h-full w-full place-items-center rounded-2xl rounded-tl-[200px] bg-bg">
          <img
            src="/chair.png"
            alt=""
            className="animate-hover-in-place h-3/4 w-3/4"
          />
        </div>
      </div>
      <ul className="grid grid-cols-3 gap-10">
        <Feature
          title="Controlled control."
          description="Launched is a client-side content management system. You decide what content is editable."
        >
          <Sliders size={18} />
        </Feature>
        <Feature
          title="Entirely yours."
          description="Launched generates the content, you decide how and where it should be stored. It's your data."
        >
          <HardDrive size={18} />
        </Feature>
        <Feature
          title="All open-source."
          description="Launched is open-source. You can contribute to the project, or fork it and make it your own."
        >
          <GitBranch size={18} />
        </Feature>
      </ul>
      <div className="flex w-full overflow-hidden rounded-2xl bg-bg p-10">
        <div className="flex w-72 flex-col gap-5">
          <h2 className="w-max text-5xl text-text-primary">Get started.</h2>
          <p className="text-text-secondary">
            Check out our quickstart guides to get up and running with Launched.
          </p>
          <button className="btn w-max text-text-secondary">Get started</button>
        </div>
        <img className="-my-10 -ml-20" src="/space.png" alt="" />
      </div>
    </div>
  );
}
