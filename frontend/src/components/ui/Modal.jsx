export default function Modal(props) {
  if (!props.open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/50 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={props.title}
        className="w-full max-w-md rounded-lg bg-paper p-6 shadow-lg"
      >
        <div className="mb-4 flex items-center justify-between">
          {props.title && <h3 className="text-lg font-semibold">{props.title}</h3>}
          <button
            onClick={props.onClose}
            aria-label="Close"
            className="rounded-sm p-1 text-ink-500 hover:bg-ink-900/5"
          >
            ✕
          </button>
        </div>
        {props.children}
      </div>
    </div>
  );
}
// This component renders a modal dialog when the `open` prop is true. It includes a title, a close button, and any children passed to it. The modal is centered on the screen with a semi-transparent background overlay.
