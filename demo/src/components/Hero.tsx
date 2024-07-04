import { useWindowSize } from "usehooks-ts";
import { useRef, useState, useEffect } from "react";

import { ChevronRight, ArrowRight } from "react-feather";

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
      className="text-bg absolute inset-0 -z-50 h-full w-full"
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
    <section className="relative grid h-full place-items-center py-10 sm:pb-32 sm:pt-40">
      <GridBackground cols={10} n={10} />
      <div
        ref={root}
        className="flex flex-col items-center justify-center gap-5 px-10 text-center"
      >
        <a
          href="https://www.npmjs.com/package/launched"
          className="text-text-secondary rounded-2xl border border-white/10 px-3 py-2 text-sm transition-colors hover:bg-white/5 sm:rounded-full sm:py-1"
        >
          <span>Our alpha release is out on NPM! </span>
          <span className="text-brand-light inline-flex items-center">
            Check it out <ArrowRight className="text-brand-light h-4" />
          </span>
        </a>
        <h1 className="text-text-primary max-w-[500px] text-4xl tracking-tight sm:text-6xl/[69px]">
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
