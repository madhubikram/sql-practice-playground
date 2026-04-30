import { Moon, Sun } from 'lucide-react'

export default function Header({ totalSolved, totalQuestions, theme, onToggleTheme }) {
  return (
    <header className="app-header">
      <div className="container">
        <a href="/" className="app-logo" onClick={(e) => { e.preventDefault(); window.location.reload() }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="app-logo-icon">
            <rect width="32" height="32" rx="8" fill="var(--accent-primary)" />
            <path d="M10 12C10 10.8954 12.6863 10 16 10C19.3137 10 22 10.8954 22 12C22 13.1046 19.3137 14 16 14C12.6863 14 10 13.1046 10 12Z" stroke="white" strokeWidth="1.5"/>
            <path d="M10 12V20C10 21.1046 12.6863 22 16 22C19.3137 22 22 21.1046 22 20V12" stroke="white" strokeWidth="1.5"/>
            <path d="M10 16C10 17.1046 12.6863 18 16 18C19.3137 18 22 17.1046 22 16" stroke="white" strokeWidth="1.5"/>
            <circle cx="24" cy="22" r="5" fill="var(--accent-cyan)" />
            <path d="M22.5 22L25.5 22M24 20.5L24 23.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
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
          <button className="theme-toggle" onClick={onToggleTheme} title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}>
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </div>
    </header>
  )
}
