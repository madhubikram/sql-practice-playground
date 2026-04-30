export default function Header({ totalSolved, totalQuestions }) {
  return (
    <header className="app-header">
      <div className="container">
        <a href="/" className="app-logo" onClick={(e) => { e.preventDefault(); window.location.reload() }}>
          <div className="app-logo-icon">SQL</div>
          <div className="app-logo-text">
            <span>SQL</span> Practice Playground
          </div>
        </a>
        <div className="header-stats">
          <div className="header-stat">
            <div className="header-stat-value">{totalSolved}</div>
            <div className="header-stat-label">Solved</div>
          </div>
          <div className="header-stat">
            <div className="header-stat-value">{totalQuestions}</div>
            <div className="header-stat-label">Total</div>
          </div>
          <div className="header-stat">
            <div className="header-stat-value">{totalQuestions > 0 ? Math.round(totalSolved / totalQuestions * 100) : 0}%</div>
            <div className="header-stat-label">Progress</div>
          </div>
        </div>
      </div>
    </header>
  )
}
