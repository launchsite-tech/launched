import "../styles/toolbar.css";
import Launched from "../../core/context.js";
import { useState, useEffect } from "react";

export default function Toolbar({
  position,
  className,
  canUndo,
  canRedo,
  undo,
  redo,
  save,
  revert,
}: {
  position?: "center" | "right" | "left";
  className?: string;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  save: () => void;
  revert: () => void;
}) {
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    function onLock() {
      setDisabled(true);
    }
    function onUnlock() {
      setDisabled(false);
    }

    Launched.events.on("data:lock", onLock);
    Launched.events.on("data:unlock", onUnlock);

    return () => {
      Launched.events.off("data:lock", onLock);
      Launched.events.off("data:unlock", onUnlock);
    };
  }, []);

  return (
    <div
      data-position={position}
      className={`Launched__toolbar ${className || ""} ${disabled && "disabled"}`}
    >
      <div className="Launched__toolbar-tools">
        <button
          onClick={save}
          className="Launched__toolbar-saveButton Launched__button"
        >
          Save
        </button>
        <select
          onChange={(e) => {
            if (e.target.value === "locked") Launched.lock();
            else Launched.unlock();
          }}
          className="Launched__toolbar-lockMode"
        >
          <option value="unlocked">Edit</option>
          <option value="locked">Preview</option>
        </select>
        <button
          disabled={!canUndo}
          onClick={undo}
          className="Launched__toolbar-button undo"
        >
          <svg viewBox="0 0 24 24" className="Launched__icon">
            <polyline points="1 4 1 10 7 10"></polyline>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
          </svg>
        </button>
        <button
          disabled={!canRedo}
          onClick={redo}
          className="Launched__toolbar-button redo"
        >
          <svg viewBox="0 0 24 24" className="Launched__icon">
            <polyline points="23 4 23 10 17 10"></polyline>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
          </svg>
        </button>
        <button
          onClick={revert}
          className="Launched__toolbar-revertButton Launched__button"
        >
          Revert
        </button>
      </div>
    </div>
  );
}
