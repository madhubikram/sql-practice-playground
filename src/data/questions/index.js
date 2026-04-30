import { premierLeagueQuestions } from './premierLeagueQuestions.js'
import { moviesQuestions } from './moviesQuestions.js'
import { musicQuestions } from './musicQuestions.js'
import { aquariumsQuestions } from './aquariumsQuestions.js'
import { empiresQuestions } from './empiresQuestions.js'
import { geopoliticsQuestions } from './geopoliticsQuestions.js'
import { historyQuestions } from './historyQuestions.js'

export const allQuestions = [
  ...premierLeagueQuestions,
  ...moviesQuestions,
  ...musicQuestions,
  ...aquariumsQuestions,
  ...empiresQuestions,
  ...geopoliticsQuestions,
  ...historyQuestions,
]

export function getQuestionsForDatabase(dbId) {
  return allQuestions.filter(q => q.db === dbId)
}

export function getQuestionsForDifficulty(dbId, difficulty) {
  return allQuestions.filter(q => q.db === dbId && q.difficulty === difficulty)
}

export function getQuestionById(id) {
  return allQuestions.find(q => q.id === id)
}

export function getQuestionCounts() {
  const counts = {}
  allQuestions.forEach(q => {
    if (!counts[q.db]) counts[q.db] = { total: 0, beginner: 0, intermediate: 0, advanced: 0, expert: 0 }
    counts[q.db].total++
    counts[q.db][q.difficulty]++
  })
  return counts
}

export const totalQuestionCount = allQuestions.length
