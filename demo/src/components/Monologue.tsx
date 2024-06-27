import "../dist/ui/globals.css";

import { Grid, Eye, CornerRightDown } from "react-feather";

function Text({ children }: { children: React.ReactNode }) {
  return <p className="text-bg text-xl">{children}</p>;
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-bg/5 bg-bg/5 inline-flex items-center gap-2 rounded-xl border px-2 py-1">
      {children}
    </div>
  );
}

export default function Monologue() {
  return (
    <div className="flex w-full flex-col gap-5 rounded-2xl bg-white p-10">
      <h2 className="text-bg mb-2.5 text-3xl">
        This site is powered by{" "}
        <Tag>
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
          >
            <circle cx="24" cy="24" r="24" fill="#FF6924" />
            <circle cx="23.9999" cy="18.1224" r="18.1224" fill="#FF7F24" />
            <circle cx="24.0001" cy="10.7755" r="10.7755" fill="#FF9524" />
          </svg>{" "}
          Launched.
        </Tag>
      </h2>
      <Text>You just can&rsquo;t see it.</Text>
      <Text>
        That&rsquo;s because you&rsquo;re in{" "}
        <Tag>
          <Eye size={18} /> preview mode
        </Tag>
        - the mode an everday visitor would experence.
      </Text>
      <Text>
        When your client notices the missing <i>y</i> in line two of this
        monologue, they don&rsquo;t have to wait for you to fix it. They can
        change it themselves,{" "}
        <Tag>
          <Grid size={18} /> right in the site
        </Tag>
        .
      </Text>
      <Text>
        Here&rsquo;s how <CornerRightDown className="inline-block" size={18} />
      </Text>
    </div>
  );
}
