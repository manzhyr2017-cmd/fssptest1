import React, { useState } from 'react';
import { useQuizStore } from '../state/quizStore';
import { AnswersTab } from './AnswersTab';
import {
  BookOpen,
  GraduationCap,
  ListChecks,
  Library,
  FileText,
  Shuffle,
  Play,
  Sparkles,
  Dices,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'tests' | 'answers' | 'library' | 'articles';

// Section configuration
const sections = [
  {
    name: 'Комплексный зачет',
    short: 'КЗ',
    icon: Sparkles,
    color: 'from-purple-500 to-indigo-600',
    lightBg: 'bg-indigo-50',
    lightText: 'text-indigo-700',
    border: 'border-indigo-200',
    startIndex: 0,
    count: 5,
  },
  {
    name: 'Профессиональная служебная подготовка',
    short: 'ПСП',
    icon: GraduationCap,
    color: 'from-blue-500 to-cyan-600',
    lightBg: 'bg-blue-50',
    lightText: 'text-blue-700',
    border: 'border-blue-200',
    startIndex: 5,
    count: 5,
  },
  {
    name: 'Тактико-специальная подготовка',
    short: 'ТСП',
    icon: ListChecks,
    color: 'from-emerald-500 to-teal-600',
    lightBg: 'bg-emerald-50',
    lightText: 'text-emerald-700',
    border: 'border-emerald-200',
    startIndex: 10,
    count: 5,
  },
  {
    name: 'Огневая подготовка',
    short: 'ОП',
    icon: Play,
    color: 'from-orange-500 to-red-600',
    lightBg: 'bg-orange-50',
    lightText: 'text-orange-700',
    border: 'border-orange-200',
    startIndex: 15,
    count: 5,
  },
];

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'tests', label: 'Тесты', icon: GraduationCap },
  { id: 'answers', label: 'Ответы', icon: ListChecks },
  { id: 'library', label: 'Библиотека', icon: Library },
  { id: 'articles', label: 'Статьи', icon: FileText },
];

export const HomeScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('tests');
  const { startTest, startRandomTest, shuffleEnabled, toggleShuffle, categories } =
    useQuizStore();

  return (
    <div className="min-h-screen px-4 py-6 pb-24">
      <div className="w-full max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xl px-5 py-2.5 rounded-full shadow-md border border-white/50 mb-4">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-bold text-indigo-900 tracking-wide">ФССП ТЕСТ</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight mt-1">
            Комплексный зачет
          </h1>
          <p className="text-gray-500 mt-2 text-sm">Первое полугодие 2026 года</p>
        </motion.div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === 'tests' && (
            <motion.div
              key="tests"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Shuffle toggle */}
              <div className="mb-6">
                <button
                  onClick={toggleShuffle}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border transition-all duration-300 ${
                    shuffleEnabled
                      ? 'bg-indigo-50 border-indigo-300 shadow-md'
                      : 'bg-white/70 border-gray-200 hover:border-indigo-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Shuffle
                      className={`w-5 h-5 ${shuffleEnabled ? 'text-indigo-600' : 'text-gray-400'}`}
                    />
                    <span
                      className={`font-semibold text-sm ${
                        shuffleEnabled ? 'text-indigo-900' : 'text-gray-600'
                      }`}
                    >
                      Перемешивать ответы
                    </span>
                  </div>
                  <div
                    className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${
                      shuffleEnabled ? 'bg-indigo-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
                        shuffleEnabled ? 'translate-x-5.5' : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                </button>
              </div>

              {/* Random test */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startRandomTest}
                className="w-full mb-8 bg-gradient-to-r from-pink-500 to-rose-600 text-white py-3.5 rounded-2xl font-bold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Dices className="w-5 h-5" />
                Случайный микс (20 вопросов)
              </motion.button>

              {/* Test sections */}
              {sections.map((section) => (
                <div key={section.short} className="mb-8">
                  <div className="flex items-center gap-2.5 mb-4 px-1">
                    <section.icon className={`w-5 h-5 ${section.lightText}`} />
                    <h2 className="text-lg font-bold text-gray-900">{section.name}</h2>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {Array.from({ length: section.count }, (_, i) => {
                      const catIdx = section.startIndex + i;
                      const cat = categories[catIdx];
                      return (
                        <motion.button
                          key={catIdx}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => startTest(catIdx)}
                          className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border ${section.border} ${section.lightBg} hover:shadow-md transition-all duration-200`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center text-white font-bold text-base shadow-md`}
                            >
                              {i + 1}
                            </div>
                            <div className="text-left">
                              <p className="font-semibold text-gray-900 text-base">Вариант {i + 1}</p>
                              <p className="text-xs text-indigo-500/80 font-medium">
                                {cat?.questions.length || 0} вопросов
                              </p>
                            </div>
                          </div>
                          <Play className={`w-5 h-5 ${section.lightText} opacity-70`} />
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'answers' && (
            <motion.div
              key="answers"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <AnswersTab />
            </motion.div>
          )}

          {activeTab === 'library' && (
            <motion.div
              key="library"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 text-center shadow-lg border border-white/50"
            >
              <Library className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Библиотека в разработке</p>
            </motion.div>
          )}

          {activeTab === 'articles' && (
            <motion.div
              key="articles"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 text-center shadow-lg border border-white/50"
            >
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Статьи в разработке</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer info */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 mb-12 text-center"
        >
          <div className="inline-flex flex-col items-center px-6 py-3 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 shadow-sm">
            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1.5 opacity-70">Project Documentation</span>
            <div className="h-px w-8 bg-indigo-100 mb-2" />
            <p className="text-xs font-bold text-gray-700 leading-relaxed max-w-[240px]">
              Петропавловск-Камчатский городской отдел СП по ОУПДС
            </p>
          </div>
        </motion.div>
      </div>

      {/* Bottom navigation tabs */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-200/50 px-4 py-2 z-50">
        <div className="max-w-lg mx-auto flex justify-around">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all duration-200 ${
                  isActive ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
                <span className={`text-[10px] font-semibold ${isActive ? '' : 'font-medium'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
