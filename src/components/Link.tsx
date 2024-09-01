import { useTag } from "../core/hooks.js";
import { LaunchedComponentProps } from ".";
import error from "../core/utils/error.js";

type LinkProps = Omit<
  LaunchedComponentProps<string, "a">,
  "element" | "href"
> & {
  /** The destination URL of the link. */
  href: string;
};

/**
 * A component that renders a link.
 *
 * @param props - The properties of the component; see {@link LinkProps}
 *
 * @returns The rendered link component.
 *
 * @example
 *
 * ```jsx
 * import { Link } from "launched/components";
 *
 * function App() {
 *  return <Link tag="link" href="https://example.com">Click here</Link>;
 * }
 * ```
 */
export default function Link({ tag, children, href, ...rest }: LinkProps) {
  if (typeof children !== "string" || typeof href !== "string")
    error(
      "Link component requires string children and href prop. Make sure to provide a valid URL."
    );

  const [link, linkRef] = useTag<{
    text: string;
    href: string;
  }>(tag, { text: children, href }, { type: "link" });

  return (
    <a href={link.href} {...rest} ref={linkRef}>
      {link.text}
    </a>
  );
}
