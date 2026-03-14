const fs = require('fs');
const path = 'd:/Projects/FsspTest1/src/data/questions_variants.json';

const officialRules = [
    { q: "выслан за пределы страны", a: "не может, ни при каких обстоятельствах" },
    { q: "НЕ относится к дисциплинарным взысканиям", a: "Лишение премии" },
    { q: "НЕ является методом защиты от манипуляций", a: "Поддакивание" },
    { q: "субъектов входит в состав", a: "89" },
    { q: "в каком направлении следует держать оружие", a: "мишенного поля" }
];

try {
    const data = JSON.parse(fs.readFileSync(path, 'utf8'));
    const mismatches = [];

    data.forEach(variant => {
        variant.questions.forEach((q, index) => {
            officialRules.forEach(rule => {
                if (q.text.toLowerCase().includes(rule.q.toLowerCase())) {
                    const currentAnswer = q.options.find(o => o.id === q.correctAnswer);
                    if (!currentAnswer || !currentAnswer.text.toLowerCase().includes(rule.a.toLowerCase())) {
                        mismatches.push({
                            variant: variant.title,
                            question: q.text,
                            current: currentAnswer ? currentAnswer.text : "NOT FOUND",
                            shouldBe: rule.a
                        });
                    }
                }
            });
        });
    });

    if (mismatches.length === 0) {
        console.log("✅ PERFECT: All controversial questions match the official key!");
    } else {
        console.log("❌ Found real mismatches:", JSON.stringify(mismatches, null, 2));
    }
} catch (e) {
    console.error(e);
}
