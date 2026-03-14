import React from 'react';
import { useQuizStore } from '../state/quizStore';
import { ArrowLeft, ChevronRight, CheckCircle2, XCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const QuizScreen: React.FC = () => {
  const {
    currentQuestions,
    currentQuestionIdx,
    selectedAnswers,
    answered,
    answerQuestion,
    nextQuestion,
    restart,
    timeLeft,
    decrementTime,
  } = useQuizStore();

  React.useEffect(() => {
    if (timeLeft === null) return;
    const timer = setInterval(() => {
      decrementTime();
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, decrementTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentQuestions.length) return null;

  const question = currentQuestions[currentQuestionIdx];
  const totalQuestions = currentQuestions.length;
  const progress = ((currentQuestionIdx + 1) / totalQuestions) * 100;
  const selectedAnswer = selectedAnswers[currentQuestionIdx];
  const isLastQuestion = currentQuestionIdx === totalQuestions - 1;

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="w-full max-w-lg mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={restart}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 transition-colors py-2 pr-3"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Выход</span>
          </button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">оставшееся время</span>
            <span className={`text-base font-black tabular-nums transition-colors ${timeLeft && timeLeft < 60 ? 'text-red-500' : 'text-indigo-600'}`}>
              {timeLeft !== null ? formatTime(timeLeft) : '0:00'}
            </span>
          </div>
          <span className="text-sm font-bold text-gray-700">
            {currentQuestionIdx + 1} / {totalQuestions}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 sm:p-8 mb-6 border border-white/50 overflow-hidden">
              <p className="text-lg sm:text-xl font-bold text-gray-900 leading-snug mb-6 break-words">
                {question.text}
              </p>

              {/* Options */}
              <div className="flex flex-col gap-3">
                {question.options.map((option, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = idx === question.correctAnswerIndex;

                  let optionStyle =
                    'bg-gray-50 border-gray-200 hover:bg-indigo-50 hover:border-indigo-300 cursor-pointer';

                  if (answered) {
                    if (isCorrect) {
                      optionStyle =
                        'bg-green-50 border-green-400 ring-2 ring-green-400/30';
                    } else if (isSelected && !isCorrect) {
                      optionStyle =
                        'bg-red-50 border-red-400 ring-2 ring-red-400/30';
                    } else {
                      optionStyle = 'bg-gray-50 border-gray-200 opacity-60';
                    }
                  } else if (isSelected) {
                    optionStyle =
                      'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-400/30';
                  }

                  return (
                    <motion.button
                      key={option.id}
                      whileTap={!answered ? { scale: 0.98 } : {}}
                      onClick={() => !answered && answerQuestion(idx)}
                      disabled={answered}
                      className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-200 overflow-hidden ${optionStyle}`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                            answered && isCorrect
                              ? 'bg-green-500 text-white'
                              : answered && isSelected && !isCorrect
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {answered && isCorrect ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : answered && isSelected && !isCorrect ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            String.fromCharCode(1040 + idx)
                          )}
                        </div>
                        <span style={{ wordBreak: 'break-word' }}
                          className={`text-sm sm:text-base font-medium leading-snug ${
                            answered && isCorrect
                              ? 'text-green-900'
                              : answered && isSelected && !isCorrect
                                ? 'text-red-900'
                                : 'text-gray-800'
                          }`}
                        >
                          {option.text}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Explanation */}
            {answered && question.explanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50/80 backdrop-blur-sm rounded-3xl p-5 sm:p-6 mb-6 border border-amber-200"
              >
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-amber-800 mb-1.5 uppercase tracking-wider">
                      Обоснование
                    </p>
                    <p className="text-sm text-amber-900 leading-relaxed font-medium">
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Next button */}
            {answered && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={nextQuestion}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-4 rounded-2xl font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isLastQuestion ? 'Завершить тест' : 'Следующий вопрос'}
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
