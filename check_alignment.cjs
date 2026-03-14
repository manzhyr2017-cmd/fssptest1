const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/questions_variants.json', 'utf8'));

const sections = [
    { name: 'Профессиональная служебная подготовка', weight: 20 },
    { name: 'Тактико-специальная подготовка', weight: 10 },
    { name: 'Огневая подготовка', weight: 10 }
];

let hasModified = false;

for (let i = 1; i <= 5; i++) {
    const complexTitle = `Комплексный зачет — Вариант ${i}`;
    const complexVariant = data.find(v => v.title === complexTitle);
    
    if (!complexVariant) {
        console.error(`Missing ${complexTitle}`);
        continue;
    }

    console.log(`\nChecking alignment for Variant ${i}...`);

    let offset = 0;
    sections.forEach(section => {
        const sectionTitle = `${section.name} — Вариант ${i}`;
        const sectionVariant = data.find(v => v.title === sectionTitle);
        
        if (!sectionVariant) {
            console.error(`  Missing ${sectionTitle}`);
            return;
        }

        console.log(`  Comparing with ${sectionTitle} (Questions ${offset + 1} to ${offset + section.weight})`);

        for (let j = 0; j < section.weight; j++) {
            const complexQ = complexVariant.questions[offset + j];
            const sectionQ = sectionVariant.questions[j];

            if (!complexQ || !sectionQ) continue;

            // Check if questions are basically the same (normalized)
            const clean = (str) => str.toLowerCase().replace(/[^а-яё0-9]/g, '').slice(0, 50);
            
            if (clean(complexQ.text) !== clean(sectionQ.text)) {
                console.warn(`    Mismatch at Index ${offset + j + 1}:`);
                console.warn(`      Complex: ${complexQ.text.slice(0, 50)}...`);
                console.warn(`      Section: ${sectionQ.text.slice(0, 50)}...`);
            } else {
                // Synchronize if text matches
                let diffs = [];
                if (complexQ.correctAnswer !== sectionQ.correctAnswer) {
                    diffs.push(`Answer: ${complexQ.correctAnswer} vs ${sectionQ.correctAnswer}`);
                    complexQ.correctAnswer = sectionQ.correctAnswer;
                }
                if (complexQ.explanation !== sectionQ.explanation) {
                    diffs.push(`Explanation mismatch`);
                    complexQ.explanation = sectionQ.explanation;
                }
                
                // Compare options text (sometimes they differ slightly in punctuation)
                sectionQ.options.forEach((sOpt, idx) => {
                    const cOpt = complexQ.options[idx];
                    if (cOpt && cOpt.text !== sOpt.text) {
                        // diffs.push(`Option ${sOpt.id} text mismatch`);
                        cOpt.text = sOpt.text;
                    }
                });

                if (diffs.length > 0) {
                    console.log(`    Fixed Q${offset + j + 1}: ${diffs.join(', ')}`);
                    hasModified = true;
                }
            }
        }
        offset += section.weight;
    });
}

if (hasModified) {
    fs.writeFileSync('src/data/questions_variants.json', JSON.stringify(data, null, 2));
    console.log('\nSUCCESS: Aligned Comprehensive variants with specialized sections.');
} else {
    console.log('\nOK: Everything is already aligned.');
}
