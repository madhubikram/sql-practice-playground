import { useState, useCallback, useRef, useEffect } from 'react'
import { CheckCircle, Briefcase, BookOpen, Play, PartyPopper, XCircle, Keyboard, ListChecks, BookOpenCheck, RefreshCw } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { executeQuery, getDb } from '../engine/sqlEngine.js'
import { databases } from '../data/schemas/index.js'
import { generateLevel1Error, generateLevel2Hint, generateLevel3Explanation, validateAnswer } from '../engine/hintSystem.js'
import SqlEditor from './SqlEditor.jsx'
import ResultsTable from './ResultsTable.jsx'
import SchemaViewer from './SchemaViewer.jsx'
import HintPanel from './HintPanel.jsx'
import TimerOverlay from './TimerOverlay.jsx'
import MetricsPanel from './MetricsPanel.jsx'

export default function Workspace() {
  const { state, dispatch } = useApp()
  const { activeQuestion, activeDatabase, userQuery, queryResult, queryError, hintLevel, hintMessages,
    showAnswer, answerRevealed, timerActive, questionSolved, activeResultTab, solvedQuestions } = state

  const question = activeQuestion
  const schema = databases[activeDatabase]

  const handleRunQuery = useCallback(() => {
    if (!userQuery.trim()) return
    const result = executeQuery(userQuery)

    if (!result.success) {
      dispatch({ type: 'SET_QUERY_ERROR', payload: result.error })
      // Auto-show Level 0 error
      dispatch({ type: 'SET_HINT_LEVEL', payload: 0 })
      dispatch({ type: 'ADD_HINT_MESSAGE', payload: { level: 0, text: result.error } })

      // Level 1 human error
      const humanError = generateLevel1Error(result.error)
      dispatch({ type: 'SET_HINT_LEVEL', payload: 1 })
      dispatch({ type: 'ADD_HINT_MESSAGE', payload: { level: 1, text: humanError } })

      dispatch({ type: 'SET_ACTIVE_RESULT_TAB', payload: 'hints' })

      // Track failure streak
      if (question.difficulty === 'intermediate') {
        dispatch({ type: 'INCREMENT_FAIL_STREAK', payload: question.concepts[0] || 'general' })
      }
      return
    }

    dispatch({ type: 'SET_QUERY_RESULT', payload: { result: result.results, time: result.time } })
    dispatch({ type: 'SET_ACTIVE_RESULT_TAB', payload: 'output' })

    // Validate answer
    const db = getDb()
    const isCorrect = validateAnswer(result, question.answer, db)

    if (isCorrect) {
      dispatch({ type: 'MARK_SOLVED', payload: question.id })
      dispatch({ type: 'RESET_FAIL_STREAK', payload: question.concepts[0] || 'general' })

      // Calculate metrics
      try {
        const optimalResult = executeQuery(question.answer)
        dispatch({
          type: 'SET_METRICS',
          payload: {
            userTime: result.time,
            optimalTime: optimalResult.time,
            userRows: result.rowCount,
            optimalRows: optimalResult.rowCount,
          }
        })
      } catch { /* ignore */ }
    } else {
      // Wrong result but no SQL error
      dispatch({ type: 'SET_HINT_LEVEL', payload: Math.max(state.hintLevel, 0) })
      if (question.difficulty === 'intermediate') {
        dispatch({ type: 'INCREMENT_FAIL_STREAK', payload: question.concepts[0] || 'general' })
      }
    }
  }, [userQuery, question, dispatch, state.hintLevel])

  const handleRequestHint = useCallback(() => {
    const hint = generateLevel2Hint(question, userQuery)
    dispatch({ type: 'SET_HINT_LEVEL', payload: 2 })
    dispatch({ type: 'ADD_HINT_MESSAGE', payload: { level: 2, text: hint } })
    dispatch({ type: 'SET_ACTIVE_RESULT_TAB', payload: 'hints' })
  }, [question, userQuery, dispatch])

  const handleRequestDeepExplanation = useCallback(() => {
    const explanation = generateLevel3Explanation(question, userQuery, queryError)
    dispatch({ type: 'SET_HINT_LEVEL', payload: 3 })
    dispatch({ type: 'ADD_HINT_MESSAGE', payload: { level: 3, text: explanation } })
    dispatch({ type: 'SET_ACTIVE_RESULT_TAB', payload: 'hints' })
  }, [question, userQuery, queryError, dispatch])

  const handleShowAnswer = useCallback(() => {
    dispatch({ type: 'SET_SHOW_ANSWER' })
    dispatch({ type: 'SET_TIMER_ACTIVE', payload: true })
  }, [dispatch])

  const handleAnswerRevealed = useCallback(() => {
    dispatch({ type: 'SET_ANSWER_REVEALED' })
  }, [dispatch])

  const handleSetQuery = useCallback((q) => {
    dispatch({ type: 'SET_USER_QUERY', payload: q })
  }, [dispatch])

  const isResultCorrect = questionSolved
  const canHint = hintLevel >= 0 && !questionSolved
  const canDeepExplain = hintLevel >= 2 && !questionSolved
  const canShowAnswer = hintLevel >= 3 && !questionSolved

  const tabs = [
    { id: 'output', label: 'Output', enabled: true },
    { id: 'hints', label: 'Hints', enabled: true },
    { id: 'schema', label: 'Schema', enabled: true },
    { id: 'metrics', label: 'Metrics', enabled: questionSolved },
    { id: 'alternates', label: 'Alt Solutions', enabled: questionSolved && question.altAnswers?.length > 0 },
  ]

  return (
    <>
      {/* Question Header */}
      <div className="question-header">
        <div className="flex items-center justify-between">
          <div>
            <div className="question-meta">
              <span className={`badge badge-${question.difficulty}`}>{question.difficulty}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{schema?.name}</span>
              {questionSolved && <span className="badge" style={{ background: 'rgba(52,199,89,0.1)', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14} /> Solved</span>}
            </div>
            <h2 className="question-title" style={{ marginTop: 4 }}>{question.title}</h2>
          </div>
        </div>
        <div className="question-roleplay" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <Briefcase size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>{question.roleplay}</span>
        </div>
        <p style={{ marginTop: 8, fontSize: '0.9rem' }}>{question.task}</p>
      </div>

      {/* Refresher Banner */}
      {state.refresherSuggested && !questionSolved && (
        <div className="refresher-banner" style={{ margin: '12px 24px 0' }}>
          <div style={{ color: 'var(--accent-orange)' }}><BookOpen size={24} /></div>
          <div>
            <p><strong>Struggling with {state.refresherSuggested}?</strong></p>
            <p>You've missed 3 in a row. Consider going back to a beginner question on this topic to refresh your fundamentals.</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => dispatch({ type: 'DISMISS_REFRESHER' })}>Dismiss</button>
        </div>
      )}

      {/* Workspace */}
      <div className="workspace">
        {/* Left: Editor */}
        <div className="editor-panel">
          <div className="editor-toolbar">
            <span className="editor-toolbar-title">SQL Editor</span>
            <div className="flex gap-sm">
              <button className="btn btn-primary btn-sm" onClick={handleRunQuery} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Play size={14} fill="currentColor" /> Run Query
              </button>
            </div>
          </div>
          <div className="editor-container">
            <SqlEditor value={userQuery} onChange={handleSetQuery} onRun={handleRunQuery} />
          </div>
        </div>

        {/* Right: Results */}
        <div className="results-panel">
          <div className="results-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`results-tab ${activeResultTab === tab.id ? 'active' : ''}`}
                onClick={() => dispatch({ type: 'SET_ACTIVE_RESULT_TAB', payload: tab.id })}
                disabled={!tab.enabled}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="results-content">
            {activeResultTab === 'output' && (
              <>
                {isResultCorrect && (
                  <div className="success-banner" style={{ marginBottom: 16 }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><PartyPopper size={20} /> Correct!</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Your query returned the expected results.</p>
                  </div>
                )}
                {queryResult && <ResultsTable results={queryResult} time={state.executionTime} />}
                {queryError && !queryResult && (
                  <div className="hint-panel hint-level-0">
                    <div className="hint-panel-title" style={{ color: 'var(--accent-red)' }}><XCircle size={16} /> Error</div>
                    <div className="hint-panel-body"><code>{queryError}</code></div>
                  </div>
                )}
                {!queryResult && !queryError && (
                  <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 48 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}><Keyboard size={48} opacity={0.5} /></div>
                    <p>Write your SQL query and click "Run Query" or press Ctrl+Enter</p>
                  </div>
                )}
              </>
            )}
            {activeResultTab === 'hints' && (
              <HintPanel
                hintMessages={hintMessages}
                hintLevel={hintLevel}
                canHint={canHint}
                canDeepExplain={canDeepExplain}
                canShowAnswer={canShowAnswer}
                onRequestHint={handleRequestHint}
                onRequestDeepExplanation={handleRequestDeepExplanation}
                onShowAnswer={handleShowAnswer}
                answerRevealed={answerRevealed}
                answer={question.answer}
              />
            )}
            {activeResultTab === 'schema' && (
              <SchemaViewer schema={schema} />
            )}
            {activeResultTab === 'metrics' && state.metrics && (
              <MetricsPanel metrics={state.metrics} />
            )}
            {activeResultTab === 'alternates' && questionSolved && (
              <div className="animate-fade-in">
                <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: '8px' }}><ListChecks size={20} /> Alternate Solutions</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: 16, fontSize: '0.85rem' }}>
                  There are often multiple ways to write SQL that produces the same result. Studying alternatives broadens your thinking.
                </p>
                <div className="hint-panel hint-level-2" style={{ marginBottom: 12 }}>
                  <div className="hint-panel-title"><CheckCircle size={16} /> Your Solution</div>
                  <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', whiteSpace: 'pre-wrap' }}>{userQuery}</pre>
                </div>
                <div className="hint-panel hint-level-1" style={{ marginBottom: 12 }}>
                  <div className="hint-panel-title"><BookOpenCheck size={16} /> Reference Solution</div>
                  <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', whiteSpace: 'pre-wrap' }}>{question.answer}</pre>
                </div>
                {question.altAnswers?.map((alt, i) => (
                  <div key={i} className="hint-panel hint-level-3" style={{ marginBottom: 12 }}>
                    <div className="hint-panel-title"><RefreshCw size={16} /> Alternative {i + 1}</div>
                    <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', whiteSpace: 'pre-wrap' }}>{alt}</pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Timer Overlay */}
      {timerActive && (
        <TimerOverlay onComplete={handleAnswerRevealed} />
      )}
    </>
  )
}
