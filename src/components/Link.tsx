import { useTag } from "../core/hooks.js";
import { LaunchedComponentProps } from ".";
import error from "../core/utils/error.js";

export default function Link({
  tag,
  children,
  href,
  ...rest
}: Omit<LaunchedComponentProps<string, "a">, "element">) {
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
