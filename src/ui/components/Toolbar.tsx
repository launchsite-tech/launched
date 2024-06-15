import "../styles/toolbar.css";
import { useRef, useState, useEffect } from "react";
import clamp from "../../core/utils/clamp";

export default function Toolbar({
  // draggable,
  className,
  // position = "right",
}: {
  draggable?: boolean;
  position?: "center" | "right" | "left";
  className?: string;
}) {
  const dragButton = useRef<HTMLButtonElement>(null);

  const [dragging, setDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

  function determinePosition() {
    return {
      left: dragPosition.x - 20,
      top: dragPosition.y - 20,
    };
  }

  function onDrag(e: MouseEvent) {
    if (!dragging || !dragButton.current) return;

    setDragPosition({
      x: clamp(
        e.clientX,
        0,
        window.innerWidth - dragButton.current.offsetWidth
      ),
      y: clamp(
        e.clientY,
        0,
        window.innerHeight - dragButton.current.offsetHeight
      ),
    });
  }

  useEffect(() => {
    window.addEventListener("mousemove", onDrag);

    return () => {
      window.removeEventListener("mousemove", onDrag);
    };
  }, [onDrag]);

  return (
    <div
      style={{
        ...determinePosition(),
      }}
      className={`Launched__toolbar ${className || ""}`}
    >
      <button
        ref={dragButton}
        onMouseDown={() => setDragging(true)}
        onMouseUp={() => setDragging(false)}
        className={`Launched__toolbar-dragHandle ${dragging ? "active" : ""}`}
      >
        <svg viewBox="0 0 24 24" className="Launched__icon">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      </button>
      <div className="Launched__toolbar-tools">
        <button className="Launched__toolbar-saveButton">Save</button>
        <button className="Launched__toolbar-revertButton">Revert</button>
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
      </div>
    </div>
  );
}
