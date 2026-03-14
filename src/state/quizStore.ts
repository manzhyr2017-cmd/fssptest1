import { create } from 'zustand';
import rawData from '../data/questions_variants.json';

// Types
export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Category {
  id: string;
  title: string;
  questions: Question[];
}

type Screen = 'home' | 'quiz' | 'result';

interface QuizState {
  // Data
  categories: Category[];

  // Navigation
  screen: Screen;

  // Quiz state
  currentCategoryIndex: number | null;
  currentQuestions: Question[];
  currentQuestionIdx: number;
  selectedAnswers: (number | null)[];
  answered: boolean;
  score: number;
  shuffleEnabled: boolean;

  // Actions
  startTest: (categoryIndex: number) => void;
  startRandomTest: () => void;
  answerQuestion: (optionIndex: number) => void;
  nextQuestion: () => void;
  restart: () => void;
  toggleShuffle: () => void;
}

// Process raw JSON data into typed categories
function processData(raw: any): Category[] {
  try {
    if (!raw || !Array.isArray(raw)) {
      console.warn('Questions data is not an array or is empty');
      return [];
    }
    return raw.map((cat: any, idx: number) => ({
      id: cat.id || `category-${idx}`,
      title: cat.title || 'Untitled Category',
      questions: Array.isArray(cat.questions) ? cat.questions.map((q: any) => {
        const letterToIndex: Record<string, number> = {};
        if (Array.isArray(q.options)) {
          q.options.forEach((opt: any, idx: number) => {
            if (opt && opt.id) {
              letterToIndex[opt.id.toLowerCase()] = idx;
            }
          });
        }
        const correctIdx = letterToIndex[q.correctAnswer?.toLowerCase() ?? ''] ?? 0;

        return {
          id: q.id || `q-${Math.random()}`,
          text: q.text || '',
          options: Array.isArray(q.options) ? q.options.map((o: any) => ({ id: o.id, text: o.text })) : [],
          correctAnswerIndex: correctIdx,
          explanation: q.explanation || '',
        };
      }) : [],
    }));
  } catch (err) {
    console.error('Error processing questions data:', err);
    return [];
  }
}

// Shuffle array (Fisher-Yates)
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Shuffle question options, adjusting correctAnswerIndex
function shuffleQuestionOptions(question: Question): Question {
  const indices = question.options.map((_, i) => i);
  const shuffled = shuffleArray(indices);
  const newOptions = shuffled.map((i) => question.options[i]);
  const newCorrectIdx = shuffled.indexOf(question.correctAnswerIndex);
  return { ...question, options: newOptions, correctAnswerIndex: newCorrectIdx };
}

const categories = processData(rawData);

export const useQuizStore = create<QuizState>((set, get) => ({
  categories,
  screen: 'home',
  currentCategoryIndex: null,
  currentQuestions: [],
  currentQuestionIdx: 0,
  selectedAnswers: [],
  answered: false,
  score: 0,
  shuffleEnabled: false,

  startTest: (categoryIndex) => {
    const cat = get().categories[categoryIndex];
    if (!cat) return;
    const questions = get().shuffleEnabled
      ? cat.questions.map(shuffleQuestionOptions)
      : cat.questions;
    set({
      screen: 'quiz',
      currentCategoryIndex: categoryIndex,
      currentQuestions: questions,
      currentQuestionIdx: 0,
      selectedAnswers: new Array(questions.length).fill(null),
      answered: false,
      score: 0,
    });
  },



  startRandomTest: () => {
    const cats = get().categories;
    const allQuestions = cats.flatMap((c) => c.questions);
    let selected = shuffleArray(allQuestions).slice(0, 20);
    if (get().shuffleEnabled) {
      selected = selected.map(shuffleQuestionOptions);
    }
    set({
      screen: 'quiz',
      currentCategoryIndex: null,
      currentQuestions: selected,
      currentQuestionIdx: 0,
      selectedAnswers: new Array(selected.length).fill(null),
      answered: false,
      score: 0,
    });
  },

  answerQuestion: (optionIndex) => {
    const { currentQuestionIdx, currentQuestions, selectedAnswers, score } = get();
    if (get().answered) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIdx] = optionIndex;

    const isCorrect = optionIndex === currentQuestions[currentQuestionIdx].correctAnswerIndex;

    set({
      selectedAnswers: newAnswers,
      answered: true,
      score: isCorrect ? score + 1 : score,
    });
  },

  nextQuestion: () => {
    const { currentQuestionIdx, currentQuestions } = get();
    if (currentQuestionIdx < currentQuestions.length - 1) {
      set({
        currentQuestionIdx: currentQuestionIdx + 1,
        answered: false,
      });
    } else {
      set({ screen: 'result' });
    }
  },

  restart: () => {
    set({
      screen: 'home',
      currentCategoryIndex: null,
      currentQuestions: [],
      currentQuestionIdx: 0,
      selectedAnswers: [],
      answered: false,
      score: 0,
    });
  },

  toggleShuffle: () => {
    set({ shuffleEnabled: !get().shuffleEnabled });
  },
}));
