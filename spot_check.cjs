const fs = require('fs');
const data = JSON.parse(fs.readFileSync('d:/Projects/FsspTest1/src/data/questions_variants.json', 'utf8'));

const variantIndex = 18; // Огневая подготовка — Вариант 4
const v = data[variantIndex];

console.log(`### Сверка: ${v.title}\n`);

v.questions.forEach((q, i) => {
  const correctOpt = q.options.find(o => o.id === q.correctAnswer);
  console.log(`${i + 1}. ${q.text}`);
  console.log(`   Ответ: [${q.correctAnswer}] ${correctOpt ? correctOpt.text : '???'}`);
  console.log(`   Пояснение: ${q.explanation}`);
  
  // Logical check
  const lowExp = q.explanation.toLowerCase();
  const suspicious = q.options.some(o => o.id !== q.correctAnswer && lowExp.includes(o.text.toLowerCase()) && o.text.length > 5);
  
  if (suspicious) {
    console.log(`   ⚠️  ВНИМАНИЕ: Пояснение содержит текст другого варианта ответа!`);
  }
  console.log('---');
});
