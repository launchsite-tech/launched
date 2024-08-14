import { useRef, useEffect } from "react";
import { useWindowSize } from "usehooks-ts";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

function NavItem({
  children,
  href,
  className,
  external,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : "_self"}
      className={`text-sm text-text-secondary hover:underline ${className}`}
    >
      {children}
    </a>
  );
}

export default function Nav() {
  gsap.registerPlugin(ScrollTrigger);

  const root = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    if (!root.current || width < 640) return;

    const trigger = ScrollTrigger.create({
      start: "top+=1",
      end: "bottom",
      onToggle: ({ isActive }) => {
        root.current!.classList.toggle("sm:!bg-bg", isActive);
      },
    });

    return () => trigger.kill();
  }, [width]);

  return (
    <div
      ref={root}
      className="fixed bottom-0 left-1/2 z-[1000] flex w-full -translate-x-1/2 items-center justify-center gap-10 bg-bg py-5 pl-10 pr-5 transition-colors ease-out sm:bottom-auto sm:top-0 sm:bg-transparent"
    >
      <nav className="flex items-center gap-5">
        <NavItem href="https://docs.launched.tech/">Docs</NavItem>
        <NavItem href="https://docs.launched.tech/Guides">Guides</NavItem>
        <NavItem external href="https://github.com/launchsite-tech/launched">
          Contribute
        </NavItem>
        <NavItem href="https://docs.launched.tech/Get%20Started/02%20quickstart">
          <button className="btn">Get started</button>
        </NavItem>
      </nav>
    </div>
  );
}
