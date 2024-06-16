import "../styles/toolbar.css";

export default function Toolbar({
  className,
  position,
}: {
  className?: string;
  position?: "center" | "right" | "left";
}) {
  return (
    <div
      data-position={position}
      className={`Launched__toolbar ${className || ""}`}
    >
      <div className="Launched__toolbar-tools">
        <button className="Launched__toolbar-saveButton">Save</button>
        <button className="Launched__toolbar-button undo">
          <svg viewBox="0 0 24 24" className="Launched__icon">
            <polyline points="1 4 1 10 7 10"></polyline>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
          </svg>
        </button>
        <button className="Launched__toolbar-button redo">
          <svg viewBox="0 0 24 24" className="Launched__icon">
            <polyline points="23 4 23 10 17 10"></polyline>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
          </svg>
        </button>
        <button className="Launched__toolbar-revertButton">Revert</button>
      </div>
    </div>
  );
}
