import { createContext, useContext, useReducer, useCallback } from 'react'

const AppContext = createContext(null)

const initialState = {
  // SQL Engine
  db: null,
  dbReady: false,
  dbLoading: true,

  // Current database & question
  activeDatabase: null,
  activeQuestion: null,
  activeDifficulty: null,

  // Editor
  userQuery: '',
  queryResult: null,
  queryError: null,
  executionTime: 0,

  // Hint system state
  hintLevel: -1,       // -1=none, 0=raw error, 1=human error, 2=hint, 3=deep explanation
  hintMessages: [],
  showAnswer: false,
  answerRevealed: false,

  // Timer & aptitude
  timerActive: false,
  timerSeconds: 300,
  aptitudeActive: false,
  aptitudeQuestion: null,

  // Progress
  solvedQuestions: new Set(),
  failedStreak: {},     // { topic: count }
  refresherSuggested: null,

  // UI
  activeResultTab: 'output', // output | hints | schema | metrics | alternates
  questionSolved: false,
  metrics: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_DB':
      return { ...state, db: action.payload, dbReady: true, dbLoading: false }
    case 'SET_DB_LOADING':
      return { ...state, dbLoading: action.payload }
    case 'SET_ACTIVE_DATABASE':
      return { ...state, activeDatabase: action.payload, activeQuestion: null, activeDifficulty: null, ...resetQuestionState() }
    case 'SET_ACTIVE_DIFFICULTY':
      return { ...state, activeDifficulty: action.payload }
    case 'SET_ACTIVE_QUESTION':
      return { ...state, activeQuestion: action.payload, ...resetQuestionState() }
    case 'SET_USER_QUERY':
      return { ...state, userQuery: action.payload }
    case 'SET_QUERY_RESULT':
      return { ...state, queryResult: action.payload.result, queryError: null, executionTime: action.payload.time }
    case 'SET_QUERY_ERROR':
      return { ...state, queryError: action.payload, queryResult: null }
    case 'SET_HINT_LEVEL':
      return { ...state, hintLevel: action.payload }
    case 'ADD_HINT_MESSAGE':
      return { ...state, hintMessages: [...state.hintMessages, action.payload] }
    case 'SET_SHOW_ANSWER':
      return { ...state, showAnswer: true }
    case 'SET_ANSWER_REVEALED':
      return { ...state, answerRevealed: true, timerActive: false }
    case 'SET_TIMER_ACTIVE':
      return { ...state, timerActive: action.payload }
    case 'SET_TIMER_SECONDS':
      return { ...state, timerSeconds: action.payload }
    case 'SET_APTITUDE_ACTIVE':
      return { ...state, aptitudeActive: action.payload }
    case 'SET_APTITUDE_QUESTION':
      return { ...state, aptitudeQuestion: action.payload }
    case 'MARK_SOLVED': {
      const newSolved = new Set(state.solvedQuestions)
      newSolved.add(action.payload)
      return { ...state, solvedQuestions: newSolved, questionSolved: true }
    }
    case 'SET_QUESTION_SOLVED':
      return { ...state, questionSolved: action.payload }
    case 'SET_ACTIVE_RESULT_TAB':
      return { ...state, activeResultTab: action.payload }
    case 'SET_METRICS':
      return { ...state, metrics: action.payload }
    case 'INCREMENT_FAIL_STREAK': {
      const topic = action.payload
      const newStreak = { ...state.failedStreak }
      newStreak[topic] = (newStreak[topic] || 0) + 1
      const refresher = newStreak[topic] >= 3 ? topic : null
      return { ...state, failedStreak: newStreak, refresherSuggested: refresher }
    }
    case 'RESET_FAIL_STREAK': {
      const newStreak = { ...state.failedStreak }
      delete newStreak[action.payload]
      return { ...state, failedStreak: newStreak, refresherSuggested: null }
    }
    case 'DISMISS_REFRESHER':
      return { ...state, refresherSuggested: null }
    default:
      return state
  }
}

function resetQuestionState() {
  return {
    userQuery: '',
    queryResult: null,
    queryError: null,
    executionTime: 0,
    hintLevel: -1,
    hintMessages: [],
    showAnswer: false,
    answerRevealed: false,
    timerActive: false,
    timerSeconds: 300,
    aptitudeActive: false,
    aptitudeQuestion: null,
    activeResultTab: 'output',
    questionSolved: false,
    metrics: null,
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
