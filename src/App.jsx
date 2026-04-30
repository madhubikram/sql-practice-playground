import { useState, useEffect, useCallback } from 'react'
import { useApp } from './context/AppContext.jsx'
import { initDatabase, loadDatabaseSchema, resetDatabase } from './engine/sqlEngine.js'
import { databases, databaseList } from './data/schemas/index.js'
import { getQuestionsForDatabase, getQuestionsForDifficulty, totalQuestionCount, getQuestionCounts } from './data/questions/index.js'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import Welcome from './components/Welcome.jsx'
import Workspace from './components/Workspace.jsx'

export default function App() {
  const { state, dispatch } = useApp()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      try {
        const db = await initDatabase()
        dispatch({ type: 'SET_DB', payload: db })
      } catch (err) {
        console.error('Failed to init database:', err)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme)
  }, [state.theme])

  const handleSelectDatabase = useCallback(async (dbId) => {
    dispatch({ type: 'SET_DB_LOADING', payload: true })
    try {
      const db = await resetDatabase()
      const schema = databases[dbId]
      loadDatabaseSchema(db, schema)
      dispatch({ type: 'SET_DB', payload: db })
      dispatch({ type: 'SET_ACTIVE_DATABASE', payload: dbId })
      const dbQuestions = getQuestionsForDatabase(dbId)
      if (dbQuestions.length > 0) {
        dispatch({ type: 'SET_ACTIVE_QUESTION', payload: dbQuestions[0] })
      }
    } catch (err) {
      console.error('Failed to load database:', err)
    } finally {
      dispatch({ type: 'SET_DB_LOADING', payload: false })
    }
  }, [dispatch])

  const handleSelectQuestion = useCallback((question) => {
    dispatch({ type: 'SET_ACTIVE_QUESTION', payload: question })
  }, [dispatch])

  const handleSelectDifficulty = useCallback((diff) => {
    dispatch({ type: 'SET_ACTIVE_DIFFICULTY', payload: state.activeDifficulty === diff ? null : diff })
  }, [dispatch, state.activeDifficulty])

  if (loading) {
    return (
      <div className="loading" style={{ height: '100vh' }}>
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-muted)' }}>Initializing SQL Engine...</p>
      </div>
    )
  }

  const questions = state.activeDatabase
    ? (state.activeDifficulty
      ? getQuestionsForDifficulty(state.activeDatabase, state.activeDifficulty)
      : getQuestionsForDatabase(state.activeDatabase))
    : []

  const counts = getQuestionCounts()

  return (
    <>
      <Header 
        totalSolved={state.solvedQuestions.size} 
        totalQuestions={totalQuestionCount} 
        theme={state.theme}
        onToggleTheme={() => dispatch({ type: 'TOGGLE_THEME' })}
      />
      <div className="app-layout">
        <Sidebar
          databases={databaseList}
          activeDatabase={state.activeDatabase}
          activeDifficulty={state.activeDifficulty}
          activeQuestion={state.activeQuestion}
          questions={questions}
          counts={counts}
          solvedQuestions={state.solvedQuestions}
          onSelectDatabase={handleSelectDatabase}
          onSelectDifficulty={handleSelectDifficulty}
          onSelectQuestion={handleSelectQuestion}
        />
        <main className="main-content">
          {!state.activeDatabase ? (
            <Welcome databases={databaseList} counts={counts} onSelectDatabase={handleSelectDatabase} />
          ) : !state.activeQuestion ? (
            <Welcome databases={databaseList} counts={counts} onSelectDatabase={handleSelectDatabase}
              message={`Select a question from the sidebar to begin practicing with the ${databases[state.activeDatabase]?.name} database.`} />
          ) : (
            <Workspace />
          )}
        </main>
      </div>
    </>
  )
}
