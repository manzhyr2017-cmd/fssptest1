import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, ChevronRight, Bookmark } from 'lucide-react';

const articles = [
  {
    title: 'Как подготовиться к комплексному зачету за 7 дней',
    excerpt: 'Практические советы и методика быстрого запоминания ответов на сложные вопросы...',
    date: '10 марта 2025',
    readTime: '5 мин',
    category: 'Подготовка',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60'
  },
  {
    title: 'Изменения в законодательстве об исполнительном производстве 2025',
    excerpt: 'Что изменилось в 229-ФЗ и на что обратить внимание при решении тестов...',
    date: '5 марта 2025',
    readTime: '8 мин',
    category: 'Законодательство',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=60'
  },
  {
    title: 'Типичные ошибки при выполнении упражнений учебных стрельб',
    excerpt: 'Разбор наиболее частых нарушений мер безопасности и техники стрельбы из ПМ...',
    date: '1 марта 2025',
    readTime: '10 мин',
    category: 'Огневая подготовка',
    image: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=800&auto=format&fit=crop&q=60'
  },
];

export const ArticlesTab: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 pb-10">
      {articles.map((article, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
          className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
        >
          <div className="relative h-48 overflow-hidden">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-full border border-white/30">
                {article.category}
              </span>
            </div>
            <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-indigo-600 transition-colors">
              <Bookmark size={16} />
            </button>
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-4 mb-3 text-xs text-gray-400 font-medium">
              <div className="flex items-center gap-1">
                <Clock size={14} />
                {article.readTime}
              </div>
              <div className="flex items-center gap-1">
                <BookOpen size={14} />
                {article.date}
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors leading-tight">
              {article.title}
            </h3>
            
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              {article.excerpt}
            </p>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <span className="text-sm font-bold text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Читать полностью
                <ChevronRight size={16} />
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
