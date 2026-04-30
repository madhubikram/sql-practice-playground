export default function MetricsPanel({ metrics }) {
  if (!metrics) return null

  const timeRatio = metrics.optimalTime > 0 ? metrics.userTime / metrics.optimalTime : 1
  const timeLabel = timeRatio <= 1.5 ? 'metric-good' : timeRatio <= 3 ? 'metric-ok' : 'metric-bad'
  const rowMatch = metrics.userRows === metrics.optimalRows
  const rowLabel = rowMatch ? 'metric-good' : 'metric-bad'

  return (
    <div className="animate-fade-in">
      <h3 style={{ marginBottom: 8 }}>📊 Query Performance Metrics</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 20 }}>
        See how your query compares to the optimal solution.
      </p>
      <div className="metrics-grid">
        <div className={`metric-card ${timeLabel}`}>
          <div className="metric-value">{metrics.userTime}ms</div>
          <div className="metric-label">Your Time</div>
        </div>
        <div className="metric-card metric-good">
          <div className="metric-value">{metrics.optimalTime}ms</div>
          <div className="metric-label">Optimal Time</div>
        </div>
        <div className={`metric-card ${timeLabel}`}>
          <div className="metric-value">{timeRatio.toFixed(1)}x</div>
          <div className="metric-label">Time Ratio</div>
        </div>
        <div className={`metric-card ${rowLabel}`}>
          <div className="metric-value">{metrics.userRows}</div>
          <div className="metric-label">Your Rows</div>
        </div>
        <div className="metric-card metric-good">
          <div className="metric-value">{metrics.optimalRows}</div>
          <div className="metric-label">Expected Rows</div>
        </div>
        <div className={`metric-card ${rowMatch ? 'metric-good' : 'metric-bad'}`}>
          <div className="metric-value">{rowMatch ? '✓' : '✗'}</div>
          <div className="metric-label">Row Match</div>
        </div>
      </div>
      <div style={{ marginTop: 24, padding: 16, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
        <strong>💡 Performance Tips:</strong>
        <ul style={{ marginTop: 8, paddingLeft: 20 }}>
          <li>A ratio close to 1.0x means your query is near-optimal</li>
          <li>Higher ratios may indicate unnecessary subqueries or missing indexes</li>
          <li>Row count mismatch could mean your filtering is off</li>
        </ul>
      </div>
    </div>
  )
}
