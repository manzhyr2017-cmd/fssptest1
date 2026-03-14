import React from 'react';
import { useQuizStore } from '../state/quizStore';
import { CheckCircle2, XCircle, RotateCcw, Home, Award, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export const ResultScreen: React.FC = () => {
  const { currentCategoryIndex, currentQuestions, score, selectedAnswers, restart, startTest } =
    useQuizStore();

  if (!currentQuestions.length) return null;

  const total = currentQuestions.length;
  const percentage = Math.round((score / total) * 100);

  let resultColor = 'text-green-500';
  let resultBg = 'bg-green-100';
  let resultEmoji = '🎉';
  if (percentage < 50) {
    resultColor = 'text-red-500';
    resultBg = 'bg-red-100';
    resultEmoji = '😔';
  } else if (percentage < 80) {
    resultColor = 'text-amber-500';
    resultBg = 'bg-amber-100';
    resultEmoji = '👍';
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="w-full max-w-lg mx-auto">
        {/* Score Summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-8 text-center mb-8 border border-white/50"
        >
          <div
            className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-lg ${resultBg}`}
          >
            <Award className={`w-10 h-10 ${resultColor}`} />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2 tracking-tight">Ваш результат</h2>
          <div className={`text-6xl font-extrabold mb-2 tracking-tighter ${resultColor}`}>
            {percentage}%
          </div>
          <p className="text-lg text-gray-500 mb-1">{resultEmoji}</p>
          <p className="text-gray-600 font-medium text-lg">
            Верных ответов: {score} из {total}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={restart}
              className="flex-1 bg-white hover:bg-gray-50 border-2 border-indigo-100 text-indigo-900 py-3.5 rounded-2xl font-semibold transition-all hover:border-indigo-300 hover:shadow-md flex items-center justify-center gap-2"
            >
              <Home size={20} />
              На главную
            </motion.button>
            {currentCategoryIndex !== null && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  restart();
                  startTest(currentCategoryIndex);
                }}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3.5 rounded-2xl shadow-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} />
                Пройти заново
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Mistakes Review */}
        {score < total && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6 px-2 tracking-tight">
              Разбор ошибок
            </h3>
            <div className="flex flex-col gap-5">
              {currentQuestions.map((q, i) => {
                const isCorrect = selectedAnswers[i] === q.correctAnswerIndex;
                if (isCorrect) return null;

                const selectedOpt =
                  selectedAnswers[i] !== null && selectedAnswers[i]! >= 0
                    ? q.options[selectedAnswers[i]!]
                    : null;
                const selectedText = selectedOpt ? selectedOpt.text : 'Не отвечено';

                const correctOpt =
                  q.correctAnswerIndex !== undefined ? q.options[q.correctAnswerIndex] : null;
                const correctText = correctOpt ? correctOpt.text : 'Не указано';

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white/90 backdrop-blur-sm p-5 sm:p-6 rounded-3xl shadow-md border border-red-100"
                  >
                    <p className="text-base sm:text-lg font-bold leading-snug text-gray-800 mb-5">
                      {i + 1}. {q.text}
                    </p>

                    <div className="flex flex-col gap-3 text-sm sm:text-base">
                      <div className="flex items-start gap-3 bg-red-50 text-red-900 p-4 rounded-2xl border border-red-200">
                        <XCircle size={22} className="shrink-0 mt-0.5 text-red-500" />
                        <div>
                          <span className="font-bold block mb-1 text-red-800">Ваш ответ:</span>
                          <span className="font-medium">{selectedText}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 bg-green-50 text-green-900 p-4 rounded-2xl border border-green-200">
                        <CheckCircle2 size={22} className="shrink-0 mt-0.5 text-green-500" />
                        <div>
                          <span className="font-bold block mb-1 text-green-800">
                            Правильный ответ:
                          </span>
                          <span className="font-medium">{correctText}</span>
                        </div>
                      </div>

                      {q.explanation && (
                        <div className="flex items-start gap-3 bg-amber-50 text-amber-900 p-4 rounded-2xl border border-amber-200 mt-1">
                          <Info size={20} className="shrink-0 mt-0.5 text-amber-600" />
                          <div>
                            <span className="font-bold block mb-1 text-amber-800">
                              Обоснование:
                            </span>
                            <p className="text-sm leading-relaxed font-medium">{q.explanation}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
