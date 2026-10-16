/*
  Pictogramas propios del café, con el mismo trazo que Lucide (24 px, 1,75 de grosor,
  color heredado) para convivir con sus íconos. Sustituyen los emojis de la versión
  anterior. Van con aria-hidden: el texto de al lado dice lo que significan.
*/

function Base({ children, className = "h-6 w-6", ...resto }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...resto}
    >
      {children}
    </svg>
  );
}

export function Cereza(props) {
  return (
    <Base {...props}>
      <path d="M12 3c-1 2-1.6 4-1.6 6" />
      <path d="M12 3c2.6.2 4.4 1.4 5 3.4-2.2.6-4 .1-5-3.4Z" />
      <ellipse cx="8.6" cy="15" rx="4.6" ry="5" />
      <ellipse cx="15.4" cy="14.4" rx="4.4" ry="4.8" />
      <path d="M8.9 10.4c-1.2 1.4-1.2 3 0 4.6 1.2 1.6 1 3.3-.2 4.8" />
    </Base>
  );
}

export function Pergamino(props) {
  return (
    <Base {...props}>
      <ellipse cx="12" cy="12" rx="6.5" ry="9" transform="rotate(-20 12 12)" />
      <path d="M14.6 4.4c-2.6 2.3-3.4 4.8-2.3 7.5 1.1 2.7.3 5.3-2.4 7.7" />
    </Base>
  );
}

export function Broca(props) {
  return (
    <Base {...props}>
      <ellipse cx="12" cy="13" rx="7.5" ry="8" />
      <circle cx="12" cy="6.6" r="1.6" />
      <path d="M14.8 13.6h0" strokeWidth="3" />
      <path d="M13.2 12.2l3.2 2.8M16.4 12.2l-3.2 2.8" strokeWidth="1.2" />
    </Base>
  );
}

export function Roya(props) {
  return (
    <Base {...props}>
      <path d="M4.5 19.5C4 11 9 4.5 19.5 4.5 19.5 15 13 20 4.5 19.5Z" />
      <path d="M4.5 19.5 14 10" />
      <circle cx="10.6" cy="8.6" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15.6" cy="13.4" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="9.4" cy="15.6" r=".9" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function Floracion(props) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="2" />
      <path d="M12 10c-1.6-2.4-1.6-4.6 0-6.5 1.6 1.9 1.6 4.1 0 6.5Z" />
      <path d="M13.9 11.4c2.6-1 4.8-.6 6.4 1.1-2 1.4-4.2 1.3-6.4-1.1Z" />
      <path d="M13.2 13.8c1.7 2.3 2 4.5.8 6.7-2-1.5-2.4-3.7-.8-6.7Z" />
      <path d="M10.8 13.8c-.2 2.8-1.5 4.7-3.8 5.4-.5-2.4.6-4.3 3.8-5.4Z" />
      <path d="M10.1 11.4c-2.8-.3-4.6-1.6-5.3-3.9 2.4-.5 4.3.7 5.3 3.9Z" />
    </Base>
  );
}

export function Ladera(props) {
  return (
    <Base {...props}>
      <path d="M2.5 19.5 9 8.5l4 5 2.5-3 6 9" />
      <path d="M2.5 19.5h19" />
      <path d="M6.4 16.5c2 .4 3.8-.2 5.4-1.4" />
      <path d="M11 18.6c2.6.2 4.6-.5 6.4-2" />
    </Base>
  );
}

export function Canasto(props) {
  return (
    <Base {...props}>
      <path d="M4 10h16l-1.6 9.2a1.6 1.6 0 0 1-1.6 1.3H7.2a1.6 1.6 0 0 1-1.6-1.3Z" />
      <path d="M7.5 10a4.5 4.5 0 0 1 9 0" />
      <path d="M9 13.5v4M12 13.5v4M15 13.5v4" />
    </Base>
  );
}

export function Almacigo(props) {
  return (
    <Base {...props}>
      <path d="M12 20v-8" />
      <path d="M12 12c0-3.6 2-5.6 6-6 0 3.8-2 5.8-6 6Z" />
      <path d="M12 14.5c0-2.8-1.6-4.4-4.8-4.8 0 3 1.6 4.6 4.8 4.8Z" />
      <path d="M7 20h10" />
    </Base>
  );
}
