export default function Sidebar({ databases, activeDatabase, activeDifficulty, activeQuestion, questions, counts, solvedQuestions, onSelectDatabase, onSelectDifficulty, onSelectQuestion }) {
  const difficulties = ['beginner', 'intermediate', 'advanced', 'expert']

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-section-title">Databases</div>
        <div className="db-list">
          {databases.map(db => (
            <div
              key={db.id}
              className={`db-item ${activeDatabase === db.id ? 'active' : ''}`}
              onClick={() => onSelectDatabase(db.id)}
            >
              <span className="db-item-icon">{db.icon}</span>
              <span>{db.name}</span>
              <span className="db-item-count">{counts[db.id]?.total || 0}</span>
            </div>
          ))}
        </div>
      </div>

      {activeDatabase && (
        <div className="sidebar-section">
          <div className="sidebar-section-title">Difficulty</div>
          <div className="difficulty-filters">
            {difficulties.map(d => (
              <button
                key={d}
                className={`diff-btn ${activeDifficulty === d ? `active-${d}` : ''}`}
                onClick={() => onSelectDifficulty(d)}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
                {counts[activeDatabase] && <small style={{display:'block',fontSize:'0.65rem',opacity:0.7}}>{counts[activeDatabase][d]}</small>}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeDatabase && (
        <div className="sidebar-section" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '8px 0' }}>
          <div className="sidebar-section-title" style={{ padding: '0 16px 8px' }}>
            Questions ({questions.length})
          </div>
          <div className="question-list">
            {questions.map((q, i) => (
              <div
                key={q.id}
                className={`q-item ${activeQuestion?.id === q.id ? 'active' : ''} ${solvedQuestions.has(q.id) ? 'solved' : ''}`}
                onClick={() => onSelectQuestion(q)}
                title={q.task}
              >
                <span className="q-item-dot"></span>
                <span className="q-item-num">{i + 1}</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {q.title}
                </span>
                <span className={`badge badge-${q.difficulty}`} style={{ marginLeft: 'auto', fontSize: '0.6rem', padding: '2px 6px' }}>
                  {q.difficulty[0].toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
