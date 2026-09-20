function DataTable({ columnas, filas }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {columnas.map((col) => (
              <th key={col} className="border-b border-line py-3 px-3 text-left text-[0.82rem] text-coffee">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila, i) => (
            <tr key={i}>
              {fila.map((celda, j) => (
                <td key={j} className="border-b border-line py-3.5 px-3 text-[0.93rem] text-muted">
                  {celda}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
