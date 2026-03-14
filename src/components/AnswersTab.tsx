import React, { useState } from 'react';
import { useQuizStore } from '../state/quizStore';
import { ChevronDown, ChevronUp, CheckCircle2, Info, Sparkles, GraduationCap, ListChecks, Play } from 'lucide-react';
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
    textColor: 'text-indigo-600' 
  },
  { 
    name: 'Профессиональная служебная подготовка', 
    short: 'ПСП', 
    startIdx: 5, 
    count: 5, 
    icon: GraduationCap,
    color: 'bg-blue-500',
    textColor: 'text-blue-600'
  },
  { 
    name: 'Тактико-специальная подготовка', 
    short: 'ТСП', 
    startIdx: 10, 
    count: 5, 
    icon: ListChecks,
    color: 'bg-emerald-500',
    textColor: 'text-emerald-600'
  },
  { 
    name: 'Огневая подготовка', 
    short: 'ОП', 
    startIdx: 15, 
    count: 5, 
    icon: Play,
    color: 'bg-orange-500',
    textColor: 'text-orange-600'
  },
];

export const AnswersTab: React.FC = () => {
  const { categories } = useQuizStore();
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setExpandedCategory(expandedCategory === idx ? null : idx);
  };

  return (
    <div className="flex flex-col gap-10">
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
  );
};
