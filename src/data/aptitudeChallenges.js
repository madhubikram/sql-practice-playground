// Aptitude challenge questions for the bypass mechanic
const challenges = [
  {q:'What is the next number in the sequence: 2, 6, 12, 20, 30, ?',options:['36','40','42','38'],correct:2,explanation:'Differences: 4,6,8,10,12 → 30+12=42'},
  {q:'If 3 machines make 3 widgets in 3 minutes, how many machines to make 100 widgets in 100 minutes?',options:['100','33','3','50'],correct:2,explanation:'Each machine makes 1 widget per 3 min, so 3 machines in 100 min = 100 widgets.'},
  {q:'What is the missing number: 1, 1, 2, 3, 5, 8, ?',options:['11','13','15','10'],correct:1,explanation:'Fibonacci sequence: 5+8=13'},
  {q:'A bat and ball cost $1.10 total. The bat costs $1 more than the ball. What does the ball cost?',options:['$0.10','$0.05','$0.15','$0.01'],correct:1,explanation:'Ball=$0.05, Bat=$1.05. $1.05-$0.05=$1.00 ✓'},
  {q:'What comes next: J, F, M, A, M, J, ?',options:['A','J','S','D'],correct:1,explanation:'Months: January, February...July starts with J'},
  {q:'If you rearrange "CIFAIPC", you get the name of a:',options:['City','Animal','Ocean','Country'],correct:2,explanation:'PACIFIC → an ocean'},
  {q:'Find the odd one out: 2, 3, 5, 9, 11, 13',options:['2','9','11','3'],correct:1,explanation:'9 is not prime, all others are.'},
  {q:'What is 15% of 240?',options:['32','34','36','38'],correct:2,explanation:'240 × 0.15 = 36'},
  {q:'Complete: 16, 8, 4, 2, ?',options:['0','1','0.5','-2'],correct:1,explanation:'Each number is halved: 2/2=1'},
  {q:'If APPLE = 50 and BANANA = 42, what is CAT?',options:['24','27','30','22'],correct:0,explanation:'Sum of letter positions: C(3)+A(1)+T(20)=24'},
  {q:'What is the next: 1, 4, 9, 16, 25, ?',options:['30','36','49','35'],correct:1,explanation:'Perfect squares: 6²=36'},
  {q:'A farmer has 17 sheep. All but 9 run away. How many are left?',options:['8','9','17','0'],correct:1,explanation:'"All but 9" means 9 remain.'},
  {q:'What is 7! (7 factorial)?',options:['720','5040','840','7000'],correct:1,explanation:'7×6×5×4×3×2×1 = 5040'},
  {q:'In binary, what is 1010 + 0110?',options:['10000','1110','10010','1100'],correct:0,explanation:'1010(10) + 0110(6) = 10000(16)'},
  {q:'If today is Wednesday, what day is it 100 days from now?',options:['Friday','Thursday','Saturday','Sunday'],correct:0,explanation:'100÷7=14r2, Wednesday+2=Friday'},
  {q:'What is the sum of interior angles of a hexagon?',options:['540°','720°','900°','600°'],correct:1,explanation:'(6-2)×180=720°'},
  {q:'Find x: 2x + 7 = 23',options:['6','7','8','9'],correct:2,explanation:'2x=16, x=8'},
  {q:'Which number is both a perfect square and a perfect cube under 100?',options:['36','49','64','81'],correct:2,explanation:'64 = 8² and 4³'},
  {q:'How many edges does a cube have?',options:['6','8','12','10'],correct:2,explanation:'A cube has 12 edges.'},
  {q:'What is the GCD of 48 and 36?',options:['6','8','12','18'],correct:2,explanation:'48=12×4, 36=12×3, GCD=12'},
  {q:'If 5x - 3 = 2x + 9, find x.',options:['2','3','4','5'],correct:2,explanation:'3x=12, x=4'},
  {q:'What is log₂(64)?',options:['4','5','6','8'],correct:2,explanation:'2⁶=64, so log₂(64)=6'},
  {q:'How many prime numbers between 1 and 20?',options:['6','7','8','9'],correct:2,explanation:'2,3,5,7,11,13,17,19 = 8 primes'},
  {q:'What is the 10th term of AP: 3, 7, 11, 15, ...?',options:['39','43','35','41'],correct:0,explanation:'a₁₀ = 3 + (10-1)×4 = 39'},
  {q:'Convert 255 to hexadecimal.',options:['EF','FF','FE','F0'],correct:1,explanation:'255 = 15×16+15 = FF'},
  {q:'What is the area of a triangle with base 10 and height 6?',options:['60','30','36','16'],correct:1,explanation:'½ × 10 × 6 = 30'},
  {q:'Solve: √(144) + √(81)',options:['21','23','25','19'],correct:0,explanation:'12 + 9 = 21'},
  {q:'What is 2⁸?',options:['128','256','512','64'],correct:1,explanation:'2⁸ = 256'},
  {q:'If a sequence is 1, 3, 6, 10, 15, what type is it?',options:['Arithmetic','Geometric','Triangular','Fibonacci'],correct:2,explanation:'Triangular numbers: n(n+1)/2'},
  {q:'What is the probability of getting exactly 2 heads in 3 coin flips?',options:['1/4','3/8','1/2','1/8'],correct:1,explanation:'C(3,2)×(½)³ = 3/8'},
]

export function getRandomChallenge() {
  const idx = Math.floor(Math.random() * challenges.length)
  return { ...challenges[idx], index: idx }
}

export function checkChallengeAnswer(challengeIndex, answerIndex) {
  return challenges[challengeIndex].correct === answerIndex
}
