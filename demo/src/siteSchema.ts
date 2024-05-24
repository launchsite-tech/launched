import type { TagSchema } from "./dist/types/tag";

export type Schema = TagSchema<{
  "Hero description": {
    value: string;
    type: "paragraph";
  };
  "About description": {
    value: string;
    type: "paragraph";
  };
  "Feature cards": {
    value: {
      icon: {
        type: "option";
        value: number;
        options: ["Music", "Activity", "Search", "Hash", "Check"];
      };
      description: {
        type: "paragraph";
        value: string;
      };
    };
  }[];
}>;

export const tags: Schema = {
  "Hero description": {
    value:
      "Quilli provides you with the AI-driven tools necessary to craft exceptional lyrics, poetry, and more- all in one place.",
    type: "paragraph",
  },
  "About description": {
    value:
      "Tired of flipping back and forth between dictionaries, rhyme lists, spell checkers, and more? Quilli has you covered, free of charge.",
    type: "paragraph",
  },
  "Feature cards": [
    {
      value: {
        icon: {
          type: "option",
          value: 0,
          options: ["Music", "Activity", "Search", "Hash", "Check"],
        },
        description: {
          type: "paragraph",
          value:
            "Generate dozens of context-conscious rhymes for any word with a single button.",
        },
      },
    },
    {
      value: {
        icon: {
          type: "option",
          value: 1,
          options: ["Music", "Activity", "Search", "Hash", "Check"],
        },
        description: {
          type: "paragraph",
          value:
            "Receive feedback and suggestions from an AI model tailored to your creative needs.",
        },
      },
    },
    {
      value: {
        icon: {
          type: "option",
          value: 2,
          options: ["Music", "Activity", "Search", "Hash", "Check"],
        },
        description: {
          type: "paragraph",
          value:
            "Search for definitions and synonyms for any word directly within the app.",
        },
      },
    },
    {
      value: {
        icon: {
          type: "option",
          value: 3,
          options: ["Music", "Activity", "Search", "Hash", "Check"],
        },
        description: {
          type: "paragraph",
          value:
            "Easily monitor your rhyme schemes, rhythm, syllables per line, and tone.",
        },
      },
    },
    {
      value: {
        icon: {
          type: "option",
          value: 4,
          options: ["Music", "Activity", "Search", "Hash", "Check"],
        },
        description: {
          type: "paragraph",
          value:
            "Enjoy the features of other high-end text editors for a familiar experience.",
        },
      },
    },
  ],
};
