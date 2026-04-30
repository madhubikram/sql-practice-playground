import { PenLine } from 'lucide-react'

export default function Welcome({ databases, counts, onSelectDatabase, message }) {
  if (message) {
    return (
      <div className="welcome">
        <h2 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: '8px' }}><PenLine size={24} /> Ready to Practice</h2>
        <p>{message}</p>
      </div>
    )
  }

  return (
    <div className="welcome">
      <h1>Master <span>SQL</span> Through Practice</h1>
      <p>
        Choose a database below and work through real-world SQL challenges.
        Each question is framed as a realistic task to build your problem-solving intuition.
      </p>
      <div className="welcome-grid">
        {databases.map(db => (
          <div key={db.id} className="card welcome-card" onClick={() => onSelectDatabase(db.id)}>
            <span className="welcome-card-icon">{db.icon}</span>
            <h3>{db.name}</h3>
            <p>{db.description}</p>
            <div className="flex gap-sm" style={{ marginTop: 8 }}>
              <span className="badge badge-beginner">{counts[db.id]?.beginner || 0} Beginner</span>
              <span className="badge badge-expert">{counts[db.id]?.expert || 0} Expert</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
