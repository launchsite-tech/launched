import type { TagSchema } from "./dist/types/tag";

export type Schema = TagSchema<{
  description: string;
  image: {
    value: {
      alt: string;
      src: string;
    };
  };
}>;
