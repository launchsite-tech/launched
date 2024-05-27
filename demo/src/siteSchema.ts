import type { TagSchema } from "./dist/types/tag";

export type Schema = TagSchema<{
  "Hero description": string;
  "About description": string;
  "Feature cards": {
    value: {
      icon: {
        type: "icon";
        value: number;
      };
      description: string;
    }[];
  };
  "Footer links": string[];
}>;

export const tags: Schema = {
  "Hero description":
    "Quilli provides you with the AI-driven tools necessary to craft exceptional lyrics, poetry, and more- all in one place.",
  "About description":
    "Tired of flipping back and forth between dictionaries, rhyme lists, spell checkers, and more? Quilli has you covered, free of charge.",
  "Feature cards": {
    value: [
      {
        icon: {
          type: "icon",
          value: 0,
        },
        description:
          "Generate dozens of context-conscious rhymes for any word with a single button.",
      },
      {
        icon: {
          type: "icon",
          value: 1,
        },
        description:
          "Receive feedback and suggestions from an AI model tailored to your creative needs.",
      },
      {
        icon: {
          type: "icon",
          value: 2,
        },
        description:
          "Search for definitions and synonyms for any word directly within the app.",
      },
      {
        icon: {
          type: "icon",
          value: 3,
        },
        description:
          "Easily monitor your rhyme schemes, rhythm, syllables per line, and tone.",
      },
      {
        icon: {
          type: "icon",
          value: 4,
        },
        description:
          "Enjoy the features of other high-end text editors for a familiar experience.",
      },
    ],
  },
  "Footer links": ["About", "Privacy", "Terms"],
};
