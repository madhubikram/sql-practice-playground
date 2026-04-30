export default function SchemaViewer({ schema }) {
  if (!schema) return null

  return (
    <div className="er-diagram animate-fade-in">
      <h3 style={{ marginBottom: 16 }}>{schema.icon} {schema.name} Schema</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 20 }}>{schema.description}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {schema.tables.map(table => (
          <div key={table.name} className="er-table">
            <div className="er-table-name">📋 {table.name}</div>
            {table.columns.map(col => (
              <div key={col.name} className="er-column">
                <span className={`er-column-name ${col.pk ? 'er-pk' : ''} ${col.fk ? 'er-fk' : ''}`}>
                  {col.pk ? '🔑 ' : ''}{col.fk ? '🔗 ' : ''}{col.name}
                </span>
                <span className="er-column-type">{col.type}</span>
              </div>
            ))}
            {table.columns.filter(c => c.fk).length > 0 && (
              <div style={{ padding: '6px 14px', fontSize: '0.65rem', color: 'var(--accent-cyan)', borderTop: '1px solid var(--border-color)' }}>
                FK → {table.columns.filter(c => c.fk).map(c => c.fk).join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
