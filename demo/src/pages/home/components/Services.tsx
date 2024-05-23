import { Music, Activity, Search, Hash, Check } from "react-feather";

type Service = {
  icon: React.ReactElement;
  text: string;
};

const serviceList: Service[] = [
  {
    icon: <Music />,
    text: "Generate dozens of context-conscious rhymes for any word with a single button.",
  },
  {
    icon: <Activity />,
    text: "Receive feedback and suggestions from an AI model tailored to your creative needs.",
  },
  {
    icon: <Search />,
    text: "Search for definitions and synonyms for any word directly within the app.",
  },
  {
    icon: <Hash />,
    text: "Easily monitor your rhyme schemes, rhythm, syllables per line, and tone.",
  },
  {
    icon: <Check />,
    text: "Enjoy the features of other high-end text editors for a familiar experience.",
  },
];

export default function Services() {
  return (
    <section id="SERVICES" className="mt-20 w-full max-w-7xl">
      <ul className="shadow-secondary grid w-full grid-cols-5 gap-[2vw] rounded-3xl bg-white p-14">
        {serviceList.map((item, i) => {
          return (
            <li
              className="border-gray-border text-home flex h-64 max-w-48 flex-col items-center justify-center gap-6 rounded-2xl border px-6 text-center font-sans text-sm/[19.6px]"
              key={i}
            >
              <span>{item.icon}</span>
              <p>{item.text}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
