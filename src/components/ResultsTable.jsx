export default function ResultsTable({ results, time }) {
  if (!results || results.length === 0) {
    return (
      <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 24 }}>
        <p>Query executed successfully but returned no results.</p>
        <p style={{ fontSize: '0.8rem', marginTop: 8 }}>⏱ {time}ms</p>
      </div>
    )
  }

  const { columns, values } = results[0]

  return (
    <div className="animate-fade-in">
      <div className="results-count">
        {values.length} row{values.length !== 1 ? 's' : ''} returned · ⏱ {time}ms
      </div>
      <div style={{ overflow: 'auto' }}>
        <table className="results-table">
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th key={i}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {values.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci}>{cell === null ? <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>NULL</span> : String(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
