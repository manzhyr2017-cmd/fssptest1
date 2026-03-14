import React, { useState, useMemo } from 'react';
import { useQuizStore } from '../state/quizStore';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Info, 
  Sparkles, 
  GraduationCap, 
  ListChecks, 
  Play,
  Search,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Section metadata
const sectionMeta = [
  { 
    name: 'Комплексный зачет', 
    short: 'КЗ', 
    startIdx: 0, 
    count: 5, 
    icon: Sparkles,
    color: 'bg-indigo-500',
    textColor: 'text-indigo-600',
    borderColor: 'border-indigo-100'
  },
  { 
    name: 'Профессиональная служебная подготовка', 
    short: 'ПСП', 
    startIdx: 5, 
    count: 5, 
    icon: GraduationCap,
    color: 'bg-blue-500',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-100'
  },
  { 
    name: 'Тактико-специальная подготовка', 
    short: 'ТСП', 
    startIdx: 10, 
    count: 5, 
    icon: ListChecks,
    color: 'bg-emerald-500',
    textColor: 'text-emerald-600',
    borderColor: 'border-emerald-100'
  },
  { 
    name: 'Огневая подготовка', 
    short: 'ОП', 
    startIdx: 15, 
    count: 5, 
    icon: Play,
    color: 'bg-orange-500',
    textColor: 'text-orange-600',
    borderColor: 'border-orange-100'
  },
];

export const AnswersTab: React.FC = () => {
  const { categories } = useQuizStore();
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggle = (idx: number) => {
    setExpandedCategory(expandedCategory === idx ? null : idx);
  };

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return null;

    const query = searchQuery.toLowerCase();
    const results: { sectionIdx: number; categoryIdx: number; questions: any[] }[] = [];

    categories.forEach((cat, catIdx) => {
      const matchingQuestions = cat.questions.filter(q => {
        const textMatch = (q.text || '').toLowerCase().includes(query);
        const optionsMatch = (q.options || []).some(o => (o.text || '').toLowerCase().includes(query));
        const explanationMatch = (q.explanation || '').toLowerCase().includes(query);
        return textMatch || optionsMatch || explanationMatch;
      });

      if (matchingQuestions.length > 0) {
        const sectionIdx = sectionMeta.findIndex(s => catIdx >= s.startIdx && catIdx < s.startIdx + s.count);
        results.push({ sectionIdx, categoryIdx: catIdx, questions: matchingQuestions });
      }
    });

    return results;
  }, [categories, searchQuery]);

  return (
    <div className="flex flex-col gap-6">
      {/* Search Bar */}
      <div className="relative sticky top-0 z-10 pt-1">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Поиск по вопросам и ответам..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-11 pr-11 py-3.5 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {searchQuery ? (
        <div className="flex flex-col gap-6 pb-10">
          {filteredData?.length === 0 ? (
            <div className="py-20 text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">Ничего не найдено</p>
              <p className="text-xs text-gray-400 mt-1">Попробуйте изменить запрос</p>
            </div>
          ) : (
            filteredData?.map((res, idx) => {
              const section = sectionMeta[res.sectionIdx];
              const cat = categories[res.categoryIdx];
              return (
                <div key={`${res.categoryIdx}-${idx}`} className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 px-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter text-white ${section.color}`}>
                      {section.short}
                    </span>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {cat.title}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {res.questions.map((q) => {
                      const correctOption = q.options[q.correctAnswerIndex];
                      return (
                        <motion.div
                          key={q.id}
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-gray-100 shadow-sm"
                        >
                          <p className="text-sm font-bold text-gray-800 mb-3 leading-snug" style={{ wordBreak: 'break-word' }}>
                            {q.text}
                          </p>

                          <div className="flex items-start gap-2.5 bg-green-50 text-green-900 px-4 py-3 rounded-xl border border-green-200 overflow-hidden">
                            <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-green-500" />
                            <span className="text-sm font-semibold min-w-0" style={{ wordBreak: 'break-word' }}>
                              {correctOption?.text || 'N/A'}
                            </span>
                          </div>

                          {q.explanation && (
                            <div className="flex items-start gap-2.5 bg-amber-50 text-amber-900 px-4 py-3 rounded-xl border border-amber-200 mt-2.5">
                              <Info size={16} className="shrink-0 mt-0.5 text-amber-600" />
                              <p className="text-xs leading-relaxed font-medium">
                                {q.explanation}
                              </p>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-10 pb-10">
          {sectionMeta.map((section) => (
            <div key={section.short}>
              <div className="flex items-center gap-2.5 mb-4 px-1">
                <section.icon className={`w-5 h-5 ${section.textColor}`} />
                <h2 className="text-lg font-bold text-gray-900">{section.name}</h2>
              </div>
              <div className="flex flex-col gap-2.5">
                {Array.from({ length: section.count }, (_, i) => {
                  const catIdx = section.startIdx + i;
                  const cat = categories[catIdx];
                  if (!cat) return null;
                  const isExpanded = expandedCategory === catIdx;

                  return (
                    <div key={catIdx}>
                      <button
                        onClick={() => toggle(catIdx)}
                        className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border transition-all duration-200 ${
                          isExpanded
                            ? 'bg-white shadow-lg border-indigo-200'
                            : 'bg-white/70 border-gray-200 hover:border-indigo-200 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl ${section.color} flex items-center justify-center text-white font-bold text-sm shadow-sm`}
                          >
                            {i + 1}
                          </div>
                          <span className="font-semibold text-gray-900 text-sm">Вариант {i + 1}</span>
                          <span className="text-xs text-gray-400">{cat.questions.length} вопросов</span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-3 flex flex-col gap-4">
                              {cat.questions.map((q, qIdx) => {
                                const correctOption = q.options[q.correctAnswerIndex];
                                return (
                                  <div
                                    key={q.id}
                                    className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-gray-100 shadow-sm"
                                  >
                                    <p className="text-sm font-bold text-gray-800 mb-3 leading-snug" style={{ wordBreak: 'break-word' }}>
                                      {qIdx + 1}. {q.text}
                                    </p>

                                    <div className="flex items-start gap-2.5 bg-green-50 text-green-900 px-4 py-3 rounded-xl border border-green-200 overflow-hidden">
                                      <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-green-500" />
                                      <span className="text-sm font-semibold min-w-0" style={{ wordBreak: 'break-word' }}>
                                        {correctOption?.text || 'N/A'}
                                      </span>
                                    </div>

                                    {q.explanation && (
                                      <div className="flex items-start gap-2.5 bg-amber-50 text-amber-900 px-4 py-3 rounded-xl border border-amber-200 mt-2.5">
                                        <Info size={16} className="shrink-0 mt-0.5 text-amber-600" />
                                        <p className="text-xs leading-relaxed font-medium">
                                          {q.explanation}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
