import { ChevronRight } from "react-feather";

export default function Hero() {
  return (
    <section className="-mt-20 grid h-full place-items-center py-40">
      <div className="flex flex-col items-center justify-center gap-5 text-center">
        <h1 className="text-text-primary max-w-[500px] text-6xl/[69px] tracking-tight">
          Finish the site, never look back.
        </h1>
        <p className="text-text-secondary text-xl/[28px]">
          You lay the groundwork, your client handles the details.
        </p>
        <div className="mt-5 flex items-center gap-5 rounded-lg border border-black/10 bg-black/10 p-5 pr-10">
          <ChevronRight className="text-brand-dark" />
          <code className="text-text-primary text-sm">
            npm install launched
          </code>
        </div>
      </div>
    </section>
  );
}
