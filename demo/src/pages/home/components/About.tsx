export default function About() {
  return (
    <section
      id="ABOUT"
      className="grid w-full max-w-[1500px] grid-cols-2 justify-items-center"
    >
      <img src="images/paper_illustration.svg" alt="Illustration"></img>
      <div className="text-home flex flex-col justify-center">
        <h2 className="max-w-xl tracking-tight">
          Spend less time switching tabs and more time{" "}
          <span className="decorated text-brand">writing</span>.
        </h2>
        <h3 className="z-0 mt-4 max-w-[34rem]">
          Tired of flipping back and forth between dictionaries, rhyme lists,
          spell checkers, and more? Quilli has you covered, free of charge.
        </h3>
      </div>
    </section>
  );
}
