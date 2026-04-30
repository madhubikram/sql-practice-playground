import { premierLeagueSchema } from './premierLeague.js'
import { moviesSchema } from './movies.js'
import { musicSchema } from './music.js'
import { aquariumsSchema } from './aquariums.js'
import { empiresSchema } from './empires.js'
import { geopoliticsSchema } from './geopolitics.js'
import { historySchema } from './history.js'

import { Trophy, Clapperboard, Music, Fish, Crown, Globe, ScrollText } from 'lucide-react'
import React from 'react'

export const databases = {
  premier_league: { ...premierLeagueSchema, icon: React.createElement(Trophy, { size: 18 }) },
  movies: { ...moviesSchema, icon: React.createElement(Clapperboard, { size: 18 }) },
  music: { ...musicSchema, icon: React.createElement(Music, { size: 18 }) },
  aquariums: { ...aquariumsSchema, icon: React.createElement(Fish, { size: 18 }) },
  empires: { ...empiresSchema, icon: React.createElement(Crown, { size: 18 }) },
  geopolitics: { ...geopoliticsSchema, icon: React.createElement(Globe, { size: 18 }) },
  history: { ...historySchema, icon: React.createElement(ScrollText, { size: 18 }) },
}

export const databaseList = Object.values(databases)
