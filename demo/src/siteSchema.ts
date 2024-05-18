import type { TagSchema } from "./dist/types/tag";

export type Schema = TagSchema<{
  title: string;
  description: string;
  // cards: {
  //   value: {
  //     title: string;
  //     description: string;
  //   };
  // }[];
  person: {
    value: {
      gender: {
        value: {
          name: string;
          pronouns: string;
        };
      };
    };
  };
}>;
