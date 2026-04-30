import { useState, useEffect, useCallback } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { getRandomChallenge, checkChallengeAnswer } from '../data/aptitudeChallenges.js'

export default function TimerOverlay({ onComplete }) {
  const { state, dispatch } = useApp()
  const [seconds, setSeconds] = useState(300) // 5 minutes
  const [challenge, setChallenge] = useState(null)
  const [showChallenge, setShowChallenge] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answered, setAnswered] = useState(false)

  useEffect(() => {
    if (seconds <= 0) {
      onComplete()
      return
    }
    const timer = setInterval(() => {
      setSeconds(s => s - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [seconds, onComplete])

  const handleStartChallenge = useCallback(() => {
    setChallenge(getRandomChallenge())
    setShowChallenge(true)
    setSelectedAnswer(null)
    setAnswered(false)
  }, [])

  const handleAnswer = useCallback((idx) => {
    if (answered) return
    setSelectedAnswer(idx)
    setAnswered(true)

    const correct = checkChallengeAnswer(challenge.index, idx)
    if (correct) {
      setTimeout(() => {
        setSeconds(0) // Bypass!
      }, 800)
    }
  }, [answered, challenge])

  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60

  return (
    <div className="timer-overlay">
      <div className="timer-card animate-slide-up">
        <div className="timer-label">⏳ Time Penalty Active</div>
        <div className="timer-display">
          {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 16 }}>
          The answer will be revealed when the timer reaches zero.<br />
          Or solve an aptitude challenge to skip the wait!
        </p>

        {!showChallenge && (
          <button className="btn btn-primary" onClick={handleStartChallenge}>
            🧩 Take Aptitude Challenge
          </button>
        )}

        {showChallenge && challenge && (
          <div className="aptitude-card">
            <div className="aptitude-question">{challenge.q}</div>
            <div className="aptitude-options">
              {challenge.options.map((opt, i) => (
                <div
                  key={i}
                  className={`aptitude-option ${answered ? (i === challenge.correct ? 'correct' : selectedAnswer === i ? 'wrong' : '') : ''}`}
                  onClick={() => handleAnswer(i)}
                  style={{ cursor: answered ? 'default' : 'pointer' }}
                >
                  {String.fromCharCode(65 + i)}. {opt}
                </div>
              ))}
            </div>
            {answered && selectedAnswer !== challenge.correct && (
              <div style={{ marginTop: 12 }}>
                <p style={{ color: 'var(--accent-red)', fontSize: '0.85rem', marginBottom: 8 }}>
                  ❌ Incorrect. The answer was: {challenge.options[challenge.correct]}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{challenge.explanation}</p>
                <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={handleStartChallenge}>
                  🔄 Try Another Challenge
                </button>
              </div>
            )}
            {answered && selectedAnswer === challenge.correct && (
              <p style={{ color: 'var(--accent-green)', marginTop: 12, fontWeight: 600 }}>
                ✅ Correct! Bypassing timer...
              </p>
            )}
          </div>
        )}

        <div className="timer-divider" />
        <button className="btn btn-ghost btn-sm" onClick={() => { setSeconds(0) }} style={{ opacity: 0.4, fontSize: '0.7rem' }}>
          Skip (not recommended)
        </button>
      </div>
    </div>
  )
}
