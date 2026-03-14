const fs = require('fs');
const path = 'd:/Projects/FsspTest1/src/data/questions_variants.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

let counts = { latin: 0, logic: 0, safety: 0 };
const latinToCyr = { 'a': 'а', 'c': 'с', 'e': 'е', 'o': 'о', 'p': 'р', 'x': 'х', 'y': 'у' };

data.forEach(variant => {
  variant.questions.forEach(q => {
    // 1. OCR FIX (Mixed Latin/Cyrillic)
    ['text', 'explanation'].forEach(key => {
      const old = q[key];
      let fixed = old;
      Object.keys(latinToCyr).forEach(lat => {
        // Find Latin char between Cyrillic chars or at the start/end of a Cyrillic word
        const reg = new RegExp('([а-яё])' + lat + '|' + lat + '([а-яё])', 'gi');
        fixed = fixed.replace(reg, (match, p1, p2) => {
          return match.split('').map(char => latinToCyr[char.toLowerCase()] || char).join('');
        });
      });
      if (old !== fixed) {
        q[key] = fixed;
        counts.latin++;
      }
    });

    // 2. LOGIC & DATA FIXES
    const t = q.text.toLowerCase();
    const explanationText = q.explanation ? q.explanation.toLowerCase() : '';
    
    // Helper to update answer correctly
    const setAnswer = (newId, explanation = null) => {
      const idx = q.options.findIndex(o => o.id === newId || (o.id === undefined && q.options.indexOf(o) === ['а','б','в','г'].indexOf(newId)));
      // If the question uses indices
      if (q.correctAnswerIndex !== undefined) {
         const foundIdx = q.options.findIndex(o => o.id === newId);
         const targetIdx = foundIdx !== -1 ? foundIdx : ['а','б','в','г'].indexOf(newId);
         if (targetIdx !== -1 && q.correctAnswerIndex !== targetIdx) {
           q.correctAnswerIndex = targetIdx;
           if (explanation) q.explanation = explanation;
           return true;
         }
      } else {
         // Uses correctAnswer (ID)
         if (q.correctAnswer !== newId) {
           q.correctAnswer = newId;
           if (explanation) q.explanation = explanation;
           return true;
         }
      }
      return false;
    };

    // PM Disassembly Priority
    if (t.includes('разборк') && t.includes('пистолет') && t.includes('предшеству')) {
      if (setAnswer('б', 'Согласно Наставлению по стрелковому делу (ПМ): 1) Извлечь магазин; 2) Проверить отсутствие патрона в патроннике (отвести затвор назад); 3) Отделить затвор от рамки; 4) Снять возвратную пружину. Таким образом, отведение затвора предшествует остальным указанным действиям.')) {
        counts.logic++;
        console.log(`- Fixed Disassembly: ${q.id}`);
      }
    }

    // Extradition/Expulsion (Constitution Art 61)
    if (t.includes('выслан за пределы') || t.includes('выдан другому государству')) {
        const optNo = q.options.find(o => o.text.toLowerCase().includes('не может') && o.text.toLowerCase().includes('обстоятель'));
        if (optNo && setAnswer(optNo.id || 'б', 'Согласно ч. 1 ст. 61 Конституции РФ: «Гражданин Российской Федерации не может быть выслан за пределы Российской Федерации или выдан другому государству». Это абсолютный запрет.')) {
            counts.logic++;
            console.log(`- Fixed Extradition: ${q.id}`);
        }
    }

    // Constitutional Bodies
    if (t.includes('орган') && t.includes('законодательн') && t.includes('представительн')) {
      const optFS = q.options.find(o => o.text.toLowerCase().includes('федеральное собрание'));
      if (optFS && setAnswer(optFS.id || 'в', 'Согласно ст. 94 Конституции РФ: Федеральное Собрание — парламент Российской Федерации — является представительным и законодательным органом Российской Федерации.')) {
        counts.logic++;
        console.log(`- Fixed Legislative Body: ${q.id}`);
      }
    }

    // Constitution Date (Adoption)
    if (t.includes('когда была принята') && t.includes('конституция')) {
      const opt12 = q.options.find(o => o.text.includes('12 декабря 1993'));
      if (opt12 && setAnswer(opt12.id || 'в', 'Конституция РФ была принята всенародным голосованием 12 декабря 1993 года. Вступила в силу 25 декабря 1993 года.')) {
        counts.logic++;
        console.log(`- Fixed Constitution Date: ${q.id}`);
      }
    }

    // Manipulation Defense (What is NOT a method)
    if (t.includes('не является методом защиты от манипуляций')) {
        const optPod = q.options.find(o => o.text.toLowerCase().includes('поддакивани'));
        if (optPod && setAnswer(optPod.id || 'в', 'Поддакивание манипулятору не является методом защиты, так как оно поощряет манипуляцию. Эффективные методы: взятие паузы, уточняющие вопросы, рационализация.')) {
            counts.logic++;
            console.log(`- Fixed Mani Defense: ${q.id}`);
        }
    }

    // Manipulation Prophylaxis (What is NOT)
    if (t.includes('не относится к профилактике манипуляций')) {
        const optVuln = q.options.find(o => o.text.toLowerCase().includes('демонстрация уязвимостей'));
        if (optVuln && setAnswer(optVuln.id || 'в', 'Демонстрация собственных уязвимостей делает человека легкой мишенью для манипулятора, а не защищает его.')) {
            counts.logic++;
            console.log(`- Fixed Mani Prophylaxis: ${q.id}`);
        }
    }

    // Parental Rights/Duties (Art 38)
    if (t.includes('забота о детях') && t.includes('воспитание')) {
        const optBoth = q.options.find(o => o.text.toLowerCase().includes('право и обязанность'));
        if (optBoth && setAnswer(optBoth.id || 'а', 'Согласно ч. 2 ст. 38 Конституции РФ: «Забота о детях, их воспитание — равное право и обязанность родителей».')) {
            counts.logic++;
            console.log(`- Fixed Parental: ${q.id}`);
        }
    }

    // Disciplinary Action (Positive list)
    if (t.includes('относится к дисциплинарным взысканиям') && !t.includes('не ')) {
        const optVyg = q.options.find(o => o.text.toLowerCase().includes('выговор'));
        if (optVyg && setAnswer(optVyg.id || 'в', 'Согласно ФЗ № 328-ФЗ и ТК РФ, дисциплинарными взысканиями являются: замечание, выговор, строгий выговор, увольнение.')) {
            counts.logic++;
            console.log(`- Fixed Discipline Positive: ${q.id}`);
        }
    }

    // Disciplinary Action (Negative list)
    if (t.includes('не относится') && t.includes('дисциплинарным взысканиям')) {
        const optPrem = q.options.find(o => o.text.toLowerCase().includes('преми'));
        if (optPrem && setAnswer(optPrem.id || 'б', 'Лишение премии не является дисциплинарным взысканием по закону (ТК РФ, ФЗ-328).')) {
            counts.logic++;
            console.log(`- Fixed Discipline Negative: ${q.id}`);
        }
    }

    // Constitution Chapters
    if (t.includes('глав') && t.includes('включает конституция')) {
        const opt9 = q.options.find(o => o.text.includes('9'));
        if (opt9 && setAnswer(opt9.id || 'б', 'Конституция РФ состоит из 9 глав.')) {
            counts.logic++;
            console.log(`- Fixed Chapters: ${q.id}`);
        }
    }

    // Incomplete disassembly purpose
    if (t.includes('неполная разборка') && t.includes('для чего')) {
        const optClean = q.options.find(o => o.text.toLowerCase().includes('чистки') && o.text.toLowerCase().includes('смазки'));
        if (optClean && setAnswer(optClean.id || 'б', 'Неполная разборка оружия производится для чистки, смазки и осмотра.')) {
            counts.logic++;
            console.log(`- Fixed Disassembly Purpose: ${q.id}`);
        }
    }

    // Safety (Capsule)
    if (t.includes('капсюль выступает') || t.includes('повреждения капсюля')) {
      const optNo = q.options.find(o => o.text.toLowerCase().includes('нет') || o.text.toLowerCase().includes('запрещ'));
      if (optNo && setAnswer(optNo.id || 'б', 'Стрельба патронами, имеющими выступающий капсюль или механические повреждения, категорически запрещена правилами безопасности.')) {
        counts.safety++;
        console.log(`- Fixed Safety Capsule: ${q.id}`);
      }
    }

    // Movement in range
    if (t.includes('перемещения по тиру') || t.includes('с огневого рубежа')) {
      const optHolster = q.options.find(o => o.text.toLowerCase().includes('кобуре') || o.text.toLowerCase().includes('разрядка'));
      if (optHolster) {
        q.correctAnswer = optHolster.id;
        counts.safety++;
      }
    }
  });
});

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log(`Report: Fixed ${counts.latin} OCR artifacts, ${counts.logic} logic errors, ${counts.safety} safety issues.`);
