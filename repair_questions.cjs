const fs = require('fs');
const path = 'd:/Projects/FsspTest1/src/data/questions_variants.json';

try {
    const data = JSON.parse(fs.readFileSync(path, 'utf8'));
    let fixedCount = 0;

    data.forEach(variant => {
        variant.questions.forEach(q => {
            const text = q.text.trim();
            
            // 1. FZ-150 Goal
            if (text.includes('150-ФЗ') && text.includes('оружии')) {
                const correctIdx = q.options.findIndex(o => 
                    o.text.toLowerCase().includes('регулирование правоотношений') && 
                    o.text.toLowerCase().includes('оборотом оружия')
                );
                if (correctIdx !== -1) {
                    const targetId = q.options[correctIdx].id;
                    if (q.correctAnswer !== targetId) {
                        q.correctAnswer = targetId;
                        fixedCount++;
                        console.log(`[FIXED LAW] ${variant.title}: ${text.substring(0, 30)}...`);
                    }
                }
            }

            // 2. After receiving
            if (text.includes('после получения оружия')) {
                const correctIdx = q.options.findIndex(o => 
                    o.text.toLowerCase().includes('проверить отсутствие патрона в патроннике')
                );
                if (correctIdx !== -1) {
                    const targetId = q.options[correctIdx].id;
                    if (q.correctAnswer !== targetId) {
                        q.correctAnswer = targetId;
                        fixedCount++;
                        console.log(`[FIXED RECEIVING] ${variant.title}: ${text.substring(0, 30)}...`);
                    }
                }
            }

            // 3. Storage
            if (text.includes('относительно его хранения') || text.includes('отношении его хранения')) {
                const correctIdx = q.options.findIndex(o => 
                    o.text.toLowerCase().includes('сохранность оружия') && 
                    (o.text.toLowerCase().includes('посторонних') || o.text.toLowerCase().includes('посторонним'))
                );
                if (correctIdx !== -1) {
                    const targetId = q.options[correctIdx].id;
                    if (q.correctAnswer !== targetId) {
                        q.correctAnswer = targetId;
                        fixedCount++;
                        console.log(`[FIXED STORAGE] ${variant.title}: ${text.substring(0, 30)}...`);
                    }
                }
            }
            // 4. Passing weapon
            if (text.includes('передавать оружие другому лицу')) {
                const correctIdx = q.options.findIndex(o => o.text.toLowerCase().startsWith('нет'));
                if (correctIdx !== -1 && q.correctAnswer !== q.options[correctIdx].id) {
                    q.correctAnswer = q.options[correctIdx].id;
                    fixedCount++;
                    console.log(`[FIXED TRANSFER] ${variant.title}`);
                }
            }

            // 5. Leaving unattended
            if (text.includes('оставлять оружие') && text.includes('без присмотра')) {
                const correctIdx = q.options.findIndex(o => o.text.toLowerCase().startsWith('нет'));
                if (correctIdx !== -1 && q.correctAnswer !== q.options[correctIdx].id) {
                    q.correctAnswer = q.options[correctIdx].id;
                    fixedCount++;
                    console.log(`[FIXED UNATTENDED] ${variant.title}`);
                }
            }

            // 6. Citizen expulsion (Constitution)
            if (text.includes('гражданин рф') && text.includes('выслан за пределы')) {
                const correctIdx = q.options.findIndex(o => o.text.toLowerCase().includes('не может'));
                if (correctIdx !== -1 && q.correctAnswer !== q.options[correctIdx].id) {
                    q.correctAnswer = q.options[correctIdx].id;
                    fixedCount++;
                    console.log(`[FIXED CONSTITUTION] ${variant.title}`);
                }
            }

            // 7. Disciplinary action (Premium)
            if (text.includes('не относится к дисциплинарным взысканиям') || (text.includes('не является') && text.includes('дисциплинарным взысканием'))) {
                const correctIdx = q.options.findIndex(o => o.text.toLowerCase().includes('лишение премии'));
                if (correctIdx !== -1 && q.correctAnswer !== q.options[correctIdx].id) {
                    q.correctAnswer = q.options[correctIdx].id;
                    fixedCount++;
                    console.log(`[FIXED DISCIPLINE] ${variant.title}`);
                }
            }
            // 8. Methods of protection against manipulation (NOT)
            if (text.includes('не является методом защиты от манипуляций')) {
                const correctIdx = q.options.findIndex(o => o.text.toLowerCase().includes('поддакивание'));
                if (correctIdx !== -1 && q.correctAnswer !== q.options[correctIdx].id) {
                    q.correctAnswer = q.options[correctIdx].id;
                    fixedCount++;
                    console.log(`[FIXED MANIPULATION] ${variant.title}`);
                }
            }

            // 9. Methods of protection (Positive)
            if (text.includes('метод защиты от манипуляций') && !text.includes('не является')) {
                const correctIdx = q.options.findIndex(o => o.text.toLowerCase().includes('рациональное русло'));
                if (correctIdx !== -1 && q.correctAnswer !== q.options[correctIdx].id) {
                    q.correctAnswer = q.options[correctIdx].id;
                    fixedCount++;
                    console.log(`[FIXED MANIPULATION POS] ${variant.title}`);
                }
            }
        });
    });

    if (fixedCount > 0) {
        fs.writeFileSync(path, JSON.stringify(data, null, 2));
        console.log(`Successfully fixed ${fixedCount} critical errors across the entire question bank.`);
    } else {
        console.log('No errors found during verification.');
    }

} catch (err) {
    console.error('Error processing JSON:', err);
}
