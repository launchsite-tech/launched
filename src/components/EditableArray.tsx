// import { useTag } from "../core/hooks";
// import { LaunchedComponentProps } from ".";
// import error from "../core/utils/error";
// import type { HTMLTagsWithChildren } from ".";
// import { cloneElement } from "react";

// export default function EditableArray({
//   tag,
//   element = "div",
//   children,
//   arr,
//   ...rest
// }: LaunchedComponentProps<React.ReactNode, HTMLTagsWithChildren> & {
//   arr: any[];
// }) {
//   if (!Array.isArray(arr))
//     error(
//       `EditableArray component requires an array prop. Received ${typeof arr}.`
//     );

//   const Container = element as React.ElementType;

//   const [array, arrayTag] = useTag(tag, arr);

//   return <Container ref={arrayTag} {...rest}></Container>;
// }
