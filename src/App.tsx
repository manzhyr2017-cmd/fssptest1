import React from 'react';
import { useQuizStore } from './state/quizStore';
import { HomeScreen } from './components/HomeScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';

const App: React.FC = () => {
  const screen = useQuizStore((s) => s.screen);

  switch (screen) {
    case 'quiz':
      return <QuizScreen />;
    case 'result':
      return <ResultScreen />;
    default:
      return <HomeScreen />;
  }
};

export default App;
