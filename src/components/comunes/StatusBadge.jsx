const estilos = {
  ok: "bg-green-soft text-green-deep",
  warning: "bg-[#fff7df] text-warning",
  danger: "bg-[#fff0ee] text-danger",
};

function StatusBadge({ tipo = "ok", children }) {
  return (
    <span className={`inline-flex min-h-[26px] items-center rounded-full px-2.5 text-xs font-extrabold ${estilos[tipo]}`}>
      {children}
    </span>
  );
}

export default StatusBadge;
