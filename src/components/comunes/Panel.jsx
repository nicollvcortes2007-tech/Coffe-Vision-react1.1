function Panel({ eyebrow, title, action, className = "", children }) {
  return (
    <article className={`rounded-lg border border-line bg-white/95 p-5 shadow-panel ${className}`}>
      {(title || action) && (
        <header className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h2>{title}</h2>}
          </div>
          {action}
        </header>
      )}
      {children}
    </article>
  );
}

export default Panel;
