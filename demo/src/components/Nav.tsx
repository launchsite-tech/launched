// import { ChevronDown } from "react-feather";

function NavItem({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`text-text-secondary text-sm hover:underline ${className}`}
    >
      {children}
    </a>
  );
}

export default function Nav() {
  return (
    <div className="mx-auto my-5 flex w-full max-w-screen-lg items-center pl-10 pr-5">
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mr-10 h-6 w-6"
      >
        <circle cx="24" cy="24" r="24" fill="#FF6924" />
        <circle cx="23.9999" cy="18.1224" r="18.1224" fill="#FF7F24" />
        <circle cx="24.0001" cy="10.7755" r="10.7755" fill="#FF9524" />
      </svg>
      <nav className="flex w-full items-center gap-5">
        <NavItem href="/">Docs</NavItem>
        <NavItem href="/">Guides</NavItem>
        <NavItem href="/">Changelog</NavItem>
        <NavItem href="/">Contribute</NavItem>
        <NavItem href="/" className="ml-auto">
          Star on Github
        </NavItem>
        <NavItem href="/">
          <button className="rounded-lg border border-white/10 bg-white/10 px-5 py-2.5">
            Get started
          </button>
        </NavItem>
      </nav>
    </div>
  );
}
