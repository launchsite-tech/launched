import type { TagSchema } from "./dist/types/tag";

export type Schema = TagSchema<{
  title: string;
  description: {
    value: string;
    type: "paragraph";
  };
  cards: {
    value: {
      title: string;
      description: {
        value: string;
        type: "paragraph";
      };
      image: {
        value: {
          src: string;
          alt: string;
        };
      };
    };
  }[];
}>;
