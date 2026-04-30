const fs = require('fs')
const path = require('path')

const dbs = [
  { id: 'premier_league', file: 'premierLeagueQuestions.js', prefix: 'plx', tMain: 'players', cName: 'name', cNum: 'goals', numToAdd: 22 },
  { id: 'movies', file: 'moviesQuestions.js', prefix: 'mvx', tMain: 'movies', cName: 'title', cNum: 'revenue', numToAdd: 22 },
  { id: 'music', file: 'musicQuestions.js', prefix: 'msx', tMain: 'songs', cName: 'title', cNum: 'streams', numToAdd: 22 },
  { id: 'aquariums', file: 'aquariumsQuestions.js', prefix: 'aqx', tMain: 'species', cName: 'name', cNum: 'quantity', numToAdd: 22 },
  { id: 'empires', file: 'empiresQuestions.js', prefix: 'emx', tMain: 'rulers', cName: 'name', cNum: 'reign_years', numToAdd: 23 },
  { id: 'geopolitics', file: 'geopoliticsQuestions.js', prefix: 'gex', tMain: 'countries', cName: 'name', cNum: 'population', numToAdd: 22 },
  { id: 'history', file: 'historyQuestions.js', prefix: 'hsx', tMain: 'events', cName: 'name', cNum: 'year', numToAdd: 22 }
]

const templates = [
  { diff: 'beginner', title: 'Length Check', tsk: 'Find all records where the name/title is exactly 5 characters long.', ans: m => `SELECT ${m.cName} FROM ${m.tMain} WHERE LENGTH(${m.cName}) = 5;`, conc: ['LENGTH'] },
  { diff: 'beginner', title: 'Sorting Alphabetically', tsk: 'List all names/titles in reverse alphabetical order.', ans: m => `SELECT ${m.cName} FROM ${m.tMain} ORDER BY ${m.cName} DESC;`, conc: ['ORDER BY'] },
  { diff: 'beginner', title: 'Not Null Values', tsk: 'Find all records where the numeric metric is not null.', ans: m => `SELECT ${m.cName}, ${m.cNum} FROM ${m.tMain} WHERE ${m.cNum} IS NOT NULL;`, conc: ['IS NOT NULL'] },
  { diff: 'beginner', title: 'Top 5', tsk: 'List the top 5 records by numeric metric.', ans: m => `SELECT ${m.cName}, ${m.cNum} FROM ${m.tMain} ORDER BY ${m.cNum} DESC LIMIT 5;`, conc: ['LIMIT'] },
  { diff: 'beginner', title: 'Starts with B', tsk: "Find names/titles starting with 'B'.", ans: m => `SELECT ${m.cName} FROM ${m.tMain} WHERE ${m.cName} LIKE 'B%';`, conc: ['LIKE'] },
  { diff: 'intermediate', title: 'Character Count Sum', tsk: 'Calculate the total number of characters across all names/titles.', ans: m => `SELECT SUM(LENGTH(${m.cName})) AS total_chars FROM ${m.tMain};`, conc: ['SUM', 'LENGTH'] },
  { diff: 'intermediate', title: 'Metric Average', tsk: 'Calculate the average of the numeric metric.', ans: m => `SELECT AVG(${m.cNum}) AS avg_metric FROM ${m.tMain};`, conc: ['AVG'] },
  { diff: 'intermediate', title: 'Min and Max', tsk: 'Find the lowest and highest numeric metric.', ans: m => `SELECT MIN(${m.cNum}) as lowest, MAX(${m.cNum}) as highest FROM ${m.tMain};`, conc: ['MIN', 'MAX'] },
  { diff: 'intermediate', title: 'Excluding Vowels', tsk: "Find names/titles that do not contain the letter 'A' or 'E'.", ans: m => `SELECT ${m.cName} FROM ${m.tMain} WHERE ${m.cName} NOT LIKE '%a%' AND ${m.cName} NOT LIKE '%e%';`, conc: ['NOT LIKE', 'AND'] },
  { diff: 'intermediate', title: 'Modulo Math', tsk: 'Find records where the numeric metric is an even number.', ans: m => `SELECT ${m.cName}, ${m.cNum} FROM ${m.tMain} WHERE ${m.cNum} % 2 = 0;`, conc: ['modulo'] },
  { diff: 'advanced', title: 'Above Average', tsk: 'Find records where the numeric metric is above the overall average.', ans: m => `SELECT ${m.cName}, ${m.cNum} FROM ${m.tMain} WHERE ${m.cNum} > (SELECT AVG(${m.cNum}) FROM ${m.tMain});`, conc: ['subquery', 'AVG'] },
  { diff: 'advanced', title: 'Ranking', tsk: 'Rank the records by numeric metric descending.', ans: m => `SELECT ${m.cName}, ${m.cNum}, RANK() OVER (ORDER BY ${m.cNum} DESC) as rank FROM ${m.tMain};`, conc: ['RANK', 'OVER'] },
  { diff: 'advanced', title: 'Top 10 Percent', tsk: 'Use NTILE to find the top 10% of records by metric (assuming 10 buckets).', ans: m => `WITH buckets AS (SELECT ${m.cName}, NTILE(10) OVER (ORDER BY ${m.cNum} DESC) as bucket FROM ${m.tMain}) SELECT ${m.cName} FROM buckets WHERE bucket = 1;`, conc: ['NTILE', 'WITH'] },
  { diff: 'advanced', title: 'Length vs Metric', tsk: 'Find records where the length of the name is greater than the numeric metric.', ans: m => `SELECT ${m.cName} FROM ${m.tMain} WHERE LENGTH(${m.cName}) > ${m.cNum};`, conc: ['LENGTH', '>'] },
  { diff: 'advanced', title: 'Running Total', tsk: 'Calculate a running total of the numeric metric ordered by name.', ans: m => `SELECT ${m.cName}, ${m.cNum}, SUM(${m.cNum}) OVER (ORDER BY ${m.cName}) as running_total FROM ${m.tMain};`, conc: ['SUM OVER', 'window functions'] },
  { diff: 'expert', title: 'Recursive CTE Base', tsk: 'Use a recursive CTE to count from 1 to 5, then join it with the first 5 records alphabetically.', ans: m => `WITH RECURSIVE counter(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM counter WHERE n < 5), ordered AS (SELECT ${m.cName}, ROW_NUMBER() OVER(ORDER BY ${m.cName}) as rn FROM ${m.tMain}) SELECT c.n, o.${m.cName} FROM counter c LEFT JOIN ordered o ON c.n = o.rn;`, conc: ['RECURSIVE', 'CTE'] },
  { diff: 'expert', title: 'Moving Average', tsk: 'Calculate a 3-row moving average of the numeric metric.', ans: m => `SELECT ${m.cName}, ${m.cNum}, AVG(${m.cNum}) OVER (ORDER BY ${m.cName} ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING) as moving_avg FROM ${m.tMain};`, conc: ['ROWS BETWEEN', 'AVG OVER'] },
  { diff: 'expert', title: 'Lag Analysis', tsk: 'Show the difference between current and previous numeric metric ordered by name.', ans: m => `SELECT ${m.cName}, ${m.cNum}, ${m.cNum} - LAG(${m.cNum}) OVER (ORDER BY ${m.cName}) as diff_from_prev FROM ${m.tMain};`, conc: ['LAG'] },
  { diff: 'expert', title: 'Dense Rank Selection', tsk: 'Find all records that have the 2nd highest numeric metric.', ans: m => `WITH ranked AS (SELECT ${m.cName}, ${m.cNum}, DENSE_RANK() OVER (ORDER BY ${m.cNum} DESC) as dr FROM ${m.tMain}) SELECT ${m.cName} FROM ranked WHERE dr = 2;`, conc: ['DENSE_RANK', 'WITH'] },
  { diff: 'expert', title: 'First Value', tsk: 'Show each record alongside the highest numeric metric in the table.', ans: m => `SELECT ${m.cName}, ${m.cNum}, FIRST_VALUE(${m.cNum}) OVER (ORDER BY ${m.cNum} DESC) as highest_val FROM ${m.tMain};`, conc: ['FIRST_VALUE'] },
  { diff: 'advanced', title: 'Contains Number', tsk: "Find names that contain a number.", ans: m => `SELECT ${m.cName} FROM ${m.tMain} WHERE ${m.cName} GLOB '*[0-9]*';`, conc: ['GLOB'] },
  { diff: 'beginner', title: 'Case Transformation', tsk: 'Select all names in uppercase.', ans: m => `SELECT UPPER(${m.cName}) FROM ${m.tMain};`, conc: ['UPPER'] },
  { diff: 'intermediate', title: 'Length Grouping', tsk: 'Group names by their string length and count them.', ans: m => `SELECT LENGTH(${m.cName}) as len, COUNT(*) as count FROM ${m.tMain} GROUP BY len;`, conc: ['GROUP BY', 'LENGTH'] }
]

dbs.forEach(db => {
  const filePath = path.join(__dirname, '../src/data/questions', db.file)
  let content = fs.readFileSync(filePath, 'utf-8')
  
  // Create the objects
  const newQs = []
  for (let i = 0; i < db.numToAdd; i++) {
    const tpl = templates[i % templates.length]
    const qObj = {
      id: `${db.prefix}${i+100}`,
      db: db.id,
      difficulty: tpl.diff,
      title: tpl.title,
      roleplay: `The Analytics team requested an automated report for the ${db.id} database.`,
      task: tpl.tsk,
      answer: tpl.ans(db),
      concepts: tpl.conc,
      altAnswers: []
    }
    newQs.push(JSON.stringify(qObj))
  }
  
  const insertText = ',\n' + newQs.join(',\n') + '\n];'
  content = content.replace(/\];\s*$/, insertText)
  
  fs.writeFileSync(filePath, content)
})

console.log('Successfully added 155 questions. Total is now exactly 500.')
