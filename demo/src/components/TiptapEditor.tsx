import { useEditor } from "@tiptap/react";
import { useTag } from "launched";

import History from "@tiptap/extension-history";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Paragraph from "@tiptap/extension-paragraph";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import Link from "@tiptap/extension-link";
import { BubbleMenu, EditorContent } from "@tiptap/react";
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconList,
  IconLink,
} from "@tabler/icons-react";

import type { Editor } from "@tiptap/react";
import type { TagRenderer, TagRendererProps } from "launched";
import type { LaunchedComponentProps } from "launched/components";

const extensions = [
  History,
  Document,
  Text,
  Paragraph,
  Bold,
  Italic,
  Underline,
  BulletList,
  ListItem,
  Link.configure({
    openOnClick: false,
    autolink: true,
  }),
];

function MenuBar({ editor }: { editor: Editor }) {
  function toggleAction(action: string) {
    editor.chain().focus().toggleMark(action).run();
  }

  return (
    <BubbleMenu editor={editor} className="r-menu">
      <button
        disabled={!editor.can().chain().focus().undo().run()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <IconArrowBackUp />
      </button>
      <button
        disabled={!editor.can().chain().focus().redo().run()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <IconArrowForwardUp />
      </button>
      <div />
      <button
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "active" : ""}
        onClick={() => toggleAction("bold")}
      >
        <IconBold />
      </button>
      <button
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "active" : ""}
        onClick={() => toggleAction("italic")}
      >
        <IconItalic />
      </button>
      <button
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "active" : ""}
        onClick={() => toggleAction("underline")}
      >
        <IconUnderline />
      </button>
      <div />
      <button
        disabled={!editor.can().chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "active" : ""}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <IconList />
      </button>
      <button
        disabled={!editor.can().chain().focus().toggleLink({ href: "" }).run()}
        className={editor.isActive("link") ? "active" : ""}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleLink({
              href: window.prompt("Enter a url") || "",
              target: "_blank",
            })
            .run()
        }
      >
        <IconLink />
      </button>
    </BubbleMenu>
  );
}

// * Reference later

const whitelist = [
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "span",
  "div",
] as const;

function RichTextComponent({
  value,
  close,
  updateData,
}: TagRendererProps<string>) {
  const editor = useEditor({
    extensions,
    content: value,
  });

  function onBlur(e: React.FocusEvent<HTMLDivElement>) {
    const menu = document.querySelector(".r-menu");
    if (!editor || menu?.contains(e.relatedTarget)) return;

    updateData(editor.getHTML());
    close();
  }

  if (!editor) return <></>;

  return (
    <>
      <MenuBar editor={editor} />
      <EditorContent
        spellCheck={editor.isFocused}
        className="r-body Launched__tag-inlineEditor"
        onBlur={onBlur}
        editor={editor}
        onChange={(e) => console.log((e.target as HTMLElement).textContent)}
      />
    </>
  );
}

export const richTextRenderer: TagRenderer<string> = {
  component: RichTextComponent,
  parentValidator: (element) =>
    whitelist.map((w) => w.toUpperCase()).includes(element.tagName),
};

export function Rich({
  tag,
  element = "div",
  children,
  className,
  ...rest
}: LaunchedComponentProps<string, (typeof whitelist)[number]>) {
  const [text, textRef] = useTag(tag, children, "rich");

  const Container = element;

  return (
    <Container className={`r-body ${className}`} {...rest} ref={textRef}>
      <div dangerouslySetInnerHTML={{ __html: text }} />
    </Container>
  );
}
