import { premierLeagueSchema } from './premierLeague.js'
import { moviesSchema } from './movies.js'
import { musicSchema } from './music.js'
import { aquariumsSchema } from './aquariums.js'
import { empiresSchema } from './empires.js'
import { geopoliticsSchema } from './geopolitics.js'
import { historySchema } from './history.js'

export const databases = {
  premier_league: premierLeagueSchema,
  movies: moviesSchema,
  music: musicSchema,
  aquariums: aquariumsSchema,
  empires: empiresSchema,
  geopolitics: geopoliticsSchema,
  history: historySchema,
}

export const databaseList = Object.values(databases)
