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
    <div className="sticky top-0 flex w-full items-center justify-center gap-10 py-5 pl-10 pr-5">
      <nav className="flex items-center gap-5">
        {/* <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
        >
          <circle cx="24" cy="24" r="24" fill="#FF6924" />
          <circle cx="23.9999" cy="18.1224" r="18.1224" fill="#FF7F24" />
          <circle cx="24.0001" cy="10.7755" r="10.7755" fill="#FF9524" />
        </svg> */}
        <NavItem href="/">Docs</NavItem>
        <NavItem href="/">Guides</NavItem>
        <NavItem href="/">Contribute</NavItem>
        <NavItem href="/">
          <button className="btn">Get started</button>
        </NavItem>
      </nav>
    </div>
  );
}
