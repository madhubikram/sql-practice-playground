export default function HintPanel({ hintMessages, hintLevel, canHint, canDeepExplain, canShowAnswer, onRequestHint, onRequestDeepExplanation, onShowAnswer, answerRevealed, answer }) {
  const levelLabels = {
    0: { icon: '🔴', title: 'Raw Error', color: 'var(--accent-red)' },
    1: { icon: '🟠', title: 'Teacher Says...', color: 'var(--accent-orange)' },
    2: { icon: '🔵', title: 'Hint', color: 'var(--accent-cyan)' },
    3: { icon: '🟣', title: 'Deep Explanation', color: 'var(--accent-purple)' },
  }

  return (
    <div className="animate-fade-in">
      <h3 style={{ marginBottom: 12 }}>🧑‍🏫 Teacher Assistance</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 16 }}>
        Help is provided in layers. Each level gives progressively more guidance without giving away the answer.
      </p>

      {/* Hint Messages */}
      {hintMessages.map((msg, i) => {
        const info = levelLabels[msg.level] || levelLabels[0]
        return (
          <div key={i} className={`hint-panel hint-level-${msg.level}`} style={{ marginBottom: 12 }}>
            <div className="hint-panel-title" style={{ color: info.color }}>
              {info.icon} Level {msg.level}: {info.title}
            </div>
            <div className="hint-panel-body" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
          </div>
        )
      })}

      {hintMessages.length === 0 && (
        <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 32 }}>
          <p style={{ fontSize: '1.5rem', marginBottom: 8 }}>🤔</p>
          <p>Run a query first — if you get stuck, hints will appear here.</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="hint-actions">
        <button
          className={`hint-btn ${canHint ? 'unlocked' : ''}`}
          onClick={onRequestHint}
          disabled={!canHint || hintLevel >= 2}
          title={hintLevel < 0 ? 'Run a query first' : hintLevel >= 2 ? 'Hint already used' : 'Get a gentle nudge'}
        >
          💡 Get Hint
        </button>
        <button
          className={`hint-btn ${canDeepExplain ? 'unlocked' : ''}`}
          onClick={onRequestDeepExplanation}
          disabled={!canDeepExplain || hintLevel >= 3}
          title={hintLevel < 2 ? 'Use Hint first' : hintLevel >= 3 ? 'Already explained' : 'Deep conceptual breakdown'}
        >
          🔍 Deep Explanation
          {hintLevel < 2 && <span style={{ fontSize: '0.65rem', marginLeft: 4 }}>🔒</span>}
        </button>
        <button
          className={`hint-btn ${canShowAnswer ? 'unlocked' : ''}`}
          onClick={onShowAnswer}
          disabled={!canShowAnswer}
          title={hintLevel < 3 ? 'View Deep Explanation first' : 'Reveal the answer (with penalty)'}
        >
          👁️ Show Answer
          {hintLevel < 3 && <span style={{ fontSize: '0.65rem', marginLeft: 4 }}>🔒</span>}
        </button>
      </div>

      {/* Revealed Answer */}
      {answerRevealed && (
        <div className="hint-panel" style={{ borderLeft: '3px solid var(--accent-green)', marginTop: 16 }}>
          <div className="hint-panel-title" style={{ color: 'var(--accent-green)' }}>✅ Solution</div>
          <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}>
            {answer}
          </pre>
        </div>
      )}
    </div>
  )
}
