export default function GetStartedButton() {
  return (
    <div className="font-sans text-base/[26px] text-white">
      <span className="bg-brand-dark absolute rounded-lg px-6 py-2 shadow-[0px_24px_60px_rgba(0,0,0,.01),0px_34px_20px_rgba(0,0,0,.05),0px_15px_15px_rgba(0,0,0,.09),0px_4px_8px_rgba(0,0,0,.1)]">
        Get Started
      </span>
      <button className="cta-mask animate-cta-rev bg-brand hover:animate-cta rounded-lg px-6 py-2">
        Get Started
      </button>
    </div>
  );
}
