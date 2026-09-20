function Modal({ open, title, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-lg bg-surface p-6 shadow-hero"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="mb-3 flex items-center justify-between">
          <h3 className="text-lg">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg bg-green-soft text-coffee hover:text-green-deep"
            aria-label="Cerrar"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </header>
        <hr className="mb-4 border-line" />
        {children}
      </div>
    </div>
  );
}

export default Modal;
