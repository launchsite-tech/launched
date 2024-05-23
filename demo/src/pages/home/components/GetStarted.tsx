import GetStartedButton from "./GetStartedButton";

export default function GetStarted() {
  return (
    <section id="GETSTARTED" className="my-24 grid w-full place-items-center">
      <div className="relative flex flex-col items-center justify-center gap-4">
        <svg
          className="absolute h-[125%]"
          viewBox="0 0 299 208"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M297 14.0991C297 21.0039 291.403 26.5991 284.499 26.5991C277.597 26.5991 272 21.0039 272 14.0991C272 7.19429 277.597 1.59912 284.499 1.59912C291.403 1.59912 297 7.19429 297 14.0991Z"
            stroke="#FEF3ED"
            strokeWidth="2.57733"
            strokeMiterlimit="10"
          />
          <path
            d="M98 199.099C98 203.242 94.6418 206.599 90.4993 206.599C86.3582 206.599 83 203.242 83 199.099C83 194.956 86.3582 191.599 90.4993 191.599C94.6418 191.599 98 194.956 98 199.099Z"
            stroke="#FEF3ED"
            strokeWidth="2.57733"
            strokeMiterlimit="10"
          />
          <circle cx="179.5" cy="106.099" r="71.5" fill="#FEF3ED" />
          <circle cx="33" cy="59.5991" r="33" fill="#FEF3ED" />
        </svg>
        <h2 className="text-home z-10">Ready to start creating?</h2>
        <GetStartedButton />
        <img
          className="relative bottom-3 z-10 translate-x-1/2"
          src="/images/callout.svg"
          alt="It's free!"
        ></img>
      </div>
    </section>
  );
}
