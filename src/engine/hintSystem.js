// Human-like hint and error system
// Level 0: Raw SQL error
// Level 1: Human-friendly syntax catch
// Level 2: Gentle hint nudge
// Level 3: Deep conceptual explanation

const syntaxPatterns = [
  { regex: /near "(\w+)"/i, msg: (m) => `Hmm, looks like there's something unexpected near "${m[1]}". Double-check your SQL syntax around that keyword — maybe a missing comma, parenthesis, or a misspelled keyword?` },
  { regex: /no such table: (\w+)/i, msg: (m) => `The table "${m[1]}" doesn't exist in this database. Take a look at the schema on the right — you'll find the available tables listed there. Maybe a typo?` },
  { regex: /no such column: (\w+)/i, msg: (m) => `I can't find a column called "${m[1]}". Check the table's column names in the schema viewer. Column names are case-sensitive and must match exactly.` },
  { regex: /ambiguous column name: (\w+)/i, msg: (m) => `The column "${m[1]}" exists in multiple tables in your query. You need to specify which table it belongs to — try using a table alias like "t.${m[1]}"` },
  { regex: /aggregate/i, msg: () => `Oops! It looks like you're mixing aggregate functions (like COUNT, SUM, AVG) with non-aggregated columns. When you use an aggregate, every other column in SELECT needs to either be in a GROUP BY clause or also be aggregated.` },
  { regex: /GROUP BY/i, msg: () => `There seems to be an issue with your GROUP BY clause. Remember: every column in your SELECT that isn't inside an aggregate function (COUNT, SUM, AVG, etc.) must appear in the GROUP BY clause.` },
  { regex: /syntax error/i, msg: () => `There's a syntax error in your query. Common causes: missing keywords (SELECT, FROM, WHERE), unclosed quotes, or extra commas. Read your query out loud — sometimes that helps catch it!` },
  { regex: /datatype mismatch/i, msg: () => `You're comparing values of different types. For example, comparing a number to a string. Make sure your WHERE conditions use the right data types — strings need single quotes, numbers don't.` },
]

export function generateLevel1Error(rawError) {
  for (const pattern of syntaxPatterns) {
    const match = rawError.match(pattern.regex)
    if (match) return pattern.msg(match)
  }
  return `Something went wrong with your query. Here's a tip: read the error carefully and check your SQL syntax. Common issues include typos in table/column names, missing keywords, or incorrect clause ordering. The SQL execution order is: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT.`
}

export function generateLevel2Hint(question, userQuery) {
  const concepts = question.concepts || []
  const hints = []

  if (concepts.includes('JOIN') || concepts.includes('multiple JOINs')) {
    hints.push("Think about which tables contain the data you need. You'll need to connect them using a JOIN. What column do they share?")
  }
  if (concepts.includes('GROUP BY')) {
    hints.push("When you want to see results organized by a category (per team, per genre, etc.), GROUP BY is your friend. What are you grouping by?")
  }
  if (concepts.includes('HAVING')) {
    hints.push("HAVING is like WHERE, but for grouped results. If you need to filter after aggregating (e.g., 'show only groups with count > 5'), use HAVING.")
  }
  if (concepts.includes('subquery')) {
    hints.push("Sometimes you need to calculate something first (like an average) and then use that result in your main query. Think of a query inside a query.")
  }
  if (concepts.includes('ROW_NUMBER') || concepts.includes('RANK') || concepts.includes('DENSE_RANK')) {
    hints.push("Window functions like ROW_NUMBER(), RANK(), or DENSE_RANK() can number or rank rows without collapsing them. The syntax is: FUNCTION() OVER (ORDER BY column).")
  }
  if (concepts.includes('PARTITION BY')) {
    hints.push("PARTITION BY works inside window functions to restart the counting/ranking for each group. Think of it as GROUP BY but for window functions.")
  }
  if (concepts.includes('CTE') || concepts.includes('WITH') || concepts.includes('multiple CTEs')) {
    hints.push("A Common Table Expression (CTE) starts with WITH and lets you name a subquery. It's like creating a temporary result set you can reference later. Try: WITH name AS (query) SELECT ... FROM name.")
  }
  if (concepts.includes('LAG') || concepts.includes('LEAD')) {
    hints.push("LAG() looks at the previous row's value, LEAD() looks at the next row's value. They're window functions — use them with OVER (ORDER BY ...) to compare sequential rows.")
  }
  if (concepts.includes('CASE WHEN')) {
    hints.push("CASE WHEN lets you add if/else logic to your SQL. Structure: CASE WHEN condition THEN result WHEN condition2 THEN result2 ELSE default END.")
  }
  if (concepts.includes('WHERE')) {
    hints.push("The WHERE clause filters rows before any grouping happens. What condition do you need to check?")
  }
  if (concepts.includes('COUNT') || concepts.includes('SUM') || concepts.includes('AVG')) {
    hints.push("Aggregate functions (COUNT, SUM, AVG) work on groups of rows. If you need them per category, pair them with GROUP BY.")
  }
  if (concepts.includes('LEFT JOIN')) {
    hints.push("A LEFT JOIN keeps ALL rows from the left table, even if there's no match in the right table. Unmatched rows show NULL for the right table's columns.")
  }
  if (concepts.includes('EXISTS')) {
    hints.push("EXISTS checks if a subquery returns any rows. It's great for 'find items that have at least one...' type questions.")
  }
  if (concepts.includes('UNION')) {
    hints.push("UNION combines results from two SELECT statements. Both must have the same number of columns and compatible types.")
  }
  if (concepts.includes('self-join')) {
    hints.push("A self-join joins a table with itself. You'll need to use different aliases for the same table. Think: comparing rows within the same table.")
  }
  if (concepts.includes('NTILE')) {
    hints.push("NTILE(n) divides rows into n equal groups. NTILE(4) creates quartiles. Use it with OVER (ORDER BY ...).")
  }
  if (concepts.includes('COALESCE')) {
    hints.push("COALESCE returns the first non-NULL value from its arguments. Great for handling NULL cases: COALESCE(column, 0) returns 0 if column is NULL.")
  }

  if (hints.length === 0) {
    hints.push(`Think about what the question is really asking. Break it down: What tables do you need? What columns? What conditions? What's the expected output shape?`)
  }

  // Add a general nudge based on the task
  hints.push(`\nRe-read the question carefully: "${question.task}"`)

  return hints.join('\n\n')
}

export function generateLevel3Explanation(question, userQuery, rawError) {
  const concepts = question.concepts || []
  let explanation = '## Deep Dive: Why Your Approach Failed\n\n'

  explanation += '### Understanding SQL Execution Order\n'
  explanation += 'SQL doesn\'t execute in the order you write it. The actual order is:\n'
  explanation += '1. **FROM** / **JOIN** — Which tables to use\n'
  explanation += '2. **WHERE** — Filter individual rows\n'
  explanation += '3. **GROUP BY** — Group rows together\n'
  explanation += '4. **HAVING** — Filter groups\n'
  explanation += '5. **SELECT** — Choose which columns to show\n'
  explanation += '6. **ORDER BY** — Sort the results\n'
  explanation += '7. **LIMIT** — Restrict how many rows to return\n\n'

  if (rawError) {
    explanation += `### Your Error\n"${rawError}"\n\n`
  }

  explanation += '### Key Concepts You Need\n'

  concepts.forEach(c => {
    switch (c) {
      case 'JOIN': case 'multiple JOINs':
        explanation += '**JOINs**: When data lives in multiple tables, JOINs link them via shared keys (foreign keys). INNER JOIN only shows matches; LEFT JOIN shows all from the left table. Think about the relationship: one-to-many? many-to-many?\n\n'
        break
      case 'GROUP BY':
        explanation += '**GROUP BY**: This collapses rows into groups. Every non-aggregated column in SELECT MUST be in GROUP BY. Think of it as creating "buckets" — the aggregate functions operate within each bucket.\n\n'
        break
      case 'HAVING':
        explanation += '**HAVING**: This is WHERE for groups. You can\'t use WHERE to filter aggregated results because WHERE runs before GROUP BY. HAVING runs after, so it can reference COUNT(), SUM(), etc.\n\n'
        break
      case 'subquery': case 'correlated subquery':
        explanation += '**Subqueries**: A query inside another query. Non-correlated subqueries run once independently. Correlated subqueries reference the outer query and run once per outer row — they\'re powerful but can be slow.\n\n'
        break
      case 'ROW_NUMBER': case 'RANK': case 'DENSE_RANK': case 'NTILE':
        explanation += '**Window Functions**: These perform calculations across rows related to the current row WITHOUT collapsing them (unlike GROUP BY). The OVER() clause defines the window. PARTITION BY creates sub-windows. These are powerful for ranking, running totals, and comparisons.\n\n'
        break
      case 'CTE': case 'WITH': case 'multiple CTEs':
        explanation += '**CTEs (Common Table Expressions)**: WITH name AS (...) creates a named temporary result. Think of it as giving a subquery a name so you can reference it multiple times. You can chain multiple CTEs with commas.\n\n'
        break
      case 'LAG': case 'LEAD':
        explanation += '**LAG/LEAD**: These window functions access data from previous (LAG) or next (LEAD) rows in the result set. Essential for comparing consecutive values, calculating changes, or identifying trends.\n\n'
        break
      case 'self-join':
        explanation += '**Self-Join**: Joining a table with itself using different aliases. Used for comparing rows within the same table, finding pairs, or building hierarchies.\n\n'
        break
    }
  })

  explanation += '### Topics to Study Further\n'
  explanation += concepts.map(c => `- ${c}`).join('\n')
  explanation += '\n\n### Try Again!\n'
  explanation += 'Now that you understand the concepts, go back and try writing the query again. Break it into steps if needed — what data do you need first? Then build up from there.'

  return explanation
}

export function validateAnswer(userResult, expectedSQL, db) {
  if (!userResult || !userResult.results || userResult.results.length === 0) return false
  
  try {
    const expectedResult = db.exec(expectedSQL)
    if (expectedResult.length === 0 && userResult.results.length === 0) return true
    if (expectedResult.length === 0 || userResult.results.length === 0) return false

    const expectedRows = expectedResult[0].values
    const userRows = userResult.results[0].values

    // Check same number of rows
    if (expectedRows.length !== userRows.length) return false

    // Check same number of columns
    if (expectedRows[0]?.length !== userRows[0]?.length) return false

    // Compare data (sort both to handle different orderings)
    const sortRows = (rows) => rows.map(r => r.join('|')).sort().join('||')
    return sortRows(expectedRows) === sortRows(userRows)
  } catch {
    return false
  }
}
