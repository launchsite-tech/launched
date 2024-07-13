import { LaunchedComponentProps } from ".";
import type { HTMLTagsWithChildren, HTMLTextTags } from ".";
import { Text, Number, Image, Link } from ".";
import error from "../core/utils/error.js";

type HTMLTextAndListTags = HTMLTextTags | "li";

type LaunchedArrayProps<T, E extends keyof JSX.IntrinsicElements> = Omit<
  LaunchedComponentProps<any, HTMLTagsWithChildren>,
  "children"
> & {
  arr: T[];
  children?: React.ReactElement;
  childProps?: Omit<LaunchedComponentProps<null, E>, "tag" | "children">;
};

function PrimitiveArray<E extends keyof JSX.IntrinsicElements>({
  tag,
  element = "div",
  children,
  arr,
  type,
  childProps,
  ...rest
}: LaunchedArrayProps<any, E> & {
  type?: string;
}) {
  const tagType = type ?? typeof arr[0];

  const Container = element as React.ElementType;

  return (
    <Container {...rest}>
      {arr.map((item, i) => {
        switch (tagType) {
          case "string":
            return (
              <Text
                key={i}
                tag={`${tag}-${i}`}
                children={item}
                {...(childProps as JSX.IntrinsicElements["p"])}
              />
            );
          case "number":
            return (
              <Number
                key={i}
                tag={`${tag}-${i}`}
                children={item}
                {...(childProps as JSX.IntrinsicElements["p"])}
              />
            );
          case "image":
            return (
              <Image
                key={i}
                tag={`${tag}-${i}`}
                src={item}
                {...(childProps as JSX.IntrinsicElements["img"])}
              />
            );
          case "link":
            return (
              <Link
                key={i}
                tag={`${tag}-${i}`}
                href={item.href}
                children={item.text}
                {...(childProps as JSX.IntrinsicElements["a"])}
              />
            );
          default:
            return error("Invalid type for PrimitiveArray.");
        }
      })}
    </Container>
  );
}

export const TextArray = (
  props: LaunchedArrayProps<string, HTMLTextAndListTags>
) => PrimitiveArray<HTMLTextAndListTags>({ ...props, type: "string" });
export const NumberArray = (
  props: LaunchedArrayProps<number, HTMLTextAndListTags>
) => PrimitiveArray<HTMLTextAndListTags>({ ...props, type: "number" });
export const ImageArray = (props: LaunchedArrayProps<string, "img">) =>
  PrimitiveArray<"img">({ ...props, type: "image" });
export const LinkArray = (
  props: LaunchedArrayProps<{ href: string; text: string }, "a">
) => PrimitiveArray<"a">({ ...props, type: "link" });
