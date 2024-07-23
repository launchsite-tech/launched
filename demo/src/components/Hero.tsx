import { useWindowSize } from "usehooks-ts";
import { useRef, useState, useEffect } from "react";

import { ChevronRight, ArrowRight, Clipboard, Check } from "react-feather";
import { CopyToClipboard } from "react-copy-to-clipboard";

import gsap from "gsap";

function GridBackground({ cols, n }: { cols: number; n: number }) {
  const [boxes, setBoxes] = useState<number[]>([]);

  const { width, height } = useWindowSize();

  const w = Math.min(width, 1024);
  const h = Math.min(height, 542);

  const boxSize = w / cols;
  const rows = Math.ceil(h / boxSize);

  function pickRandomBoxPositions() {
    for (let i = 0; i < n; i++) {
      setBoxes((p) => [...p, Math.floor(Math.random() * (rows * cols))]);
    }
  }

  useEffect(() => {
    pickRandomBoxPositions();

    const spawnInterval = setInterval(() => {
      setBoxes([]);
      pickRandomBoxPositions();
    }, 4000);

    return () => {
      clearInterval(spawnInterval);
    };
  }, []);

  return (
    <svg
      className="absolute inset-0 -z-50 h-full w-full text-bg"
      xmlns="http://www.w3.org/2000/svg"
    >
      {boxes.map((box, i) => {
        const x = box % cols;
        const y = Math.floor(box / cols);

        return (
          <rect
            key={i}
            x={x * boxSize}
            y={y * boxSize}
            width={boxSize}
            height={boxSize}
            fill="currentColor"
            className="box"
          />
        );
      })}
    </svg>
  );
}

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!root.current) return;

    gsap.from(root.current.children, {
      y: 50,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: "power2.out",
    });
  }, []);

  return (
    <main className="relative -order-2 grid h-full place-items-center pb-20 pt-10 sm:py-40">
      {/* <GridBackground cols={10} n={5} /> */}
      <div
        ref={root}
        className="flex flex-col items-center justify-center gap-5 px-10 text-center"
      >
        <a
          href="https://www.npmjs.com/package/launched"
          target="_blank"
          rel="noreferrer"
          className="rounded-2xl border border-white/10 px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-white/5 sm:rounded-full sm:py-1"
        >
          <span>Our alpha release is out on NPM! </span>
          <span className="inline-flex items-center text-brand-light">
            Check it out <ArrowRight className="h-4 text-brand-light" />
          </span>
        </a>
        <h1 className="max-w-[500px] text-4xl tracking-tight text-text-primary sm:text-6xl/[69px]">
          Finish the site,
          <br />
          never look back.
        </h1>
        <p className="text-xl/[28px] text-text-secondary">
          You lay the groundwork, your client handles the details.
        </p>
        <CopyToClipboard
          onCopy={() => setCopied(true)}
          text="npm install launched"
        >
          <div className="group relative mt-5 flex cursor-pointer items-center gap-5 rounded-lg border border-black/10 bg-black/10 p-5 pr-10">
            <div className="absolute -top-2 left-1/2 flex w-max -translate-x-1/2 -translate-y-3/4 items-center gap-2 rounded-full bg-bg px-3 py-2 text-xs text-white/75 opacity-0 shadow transition-all ease-out group-hover:-translate-y-1/2 group-hover:opacity-100">
              {!copied ? (
                <>
                  <Clipboard size={14} /> Tip: Click to copy!
                </>
              ) : (
                <>
                  <Check size={14} /> Copied!
                </>
              )}
            </div>
            <ChevronRight className="text-brand-dark" />
            <code className="text-sm text-text-primary">
              npm install launched
            </code>
          </div>
        </CopyToClipboard>
      </div>
    </main>
  );
}
