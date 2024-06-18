import "../styles/imageEditor.css";
import type { TagRenderer, TagRendererProps } from "../../core/renderer";

export function ImageUI({
  id,
  selected,
  context,
  updateData,
  close,
}: TagRendererProps<string>) {
  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      else if (!file.type.startsWith("image/"))
        return console.error("Invalid file type. Please upload an image.");

      context.onImageUpload?.(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        updateData(reader.result as string);
      };
      reader.readAsDataURL(file);

      close();
    } catch (e) {
      console.error("Failed to upload image.");
    }
  }

  return !selected ? null : (
    <div className="Launched__tag-imageUpload">
      <label className="Launched__button" htmlFor={`${id}-upload`}>
        <svg viewBox="0 0 24 24" className="Launched__icon">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
      </label>
      <input
        id={`${id}-upload`}
        type="file"
        onChange={onUpload}
        accept="image/*"
      />
    </div>
  );
}

export const ImageRenderer: TagRenderer<string> = {
  component: (props) => {
    return <ImageUI {...props} />;
  },
  parentValidator: (element) => {
    const blacklist = [
      "AREA",
      "BASE",
      "BR",
      "COL",
      "EMBED",
      "HR",
      "IMG",
      "INPUT",
      "LINK",
      "META",
      "PARAM",
      "SOURCE",
      "TRACK",
      "WBR",
    ];
    const invalid = blacklist.includes(element.tagName);

    if (invalid)
      console.warn(
        "Hint: If you're trying to attach an image tag to an IMG element, tag a wrapper element instead."
      );

    return !invalid;
  },
};
