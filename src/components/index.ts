import Text from "./Text";

export interface LaunchedComponentProps<
  v extends React.ReactNode,
  c extends keyof JSX.IntrinsicElements,
> extends React.HTMLAttributes<HTMLElement> {
  tag: string;
  children: v;
  element?: c;
}

export { Text };
