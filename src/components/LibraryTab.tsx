import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, ExternalLink, Archive, Shield, Scale, Gavel } from 'lucide-react';

const libraryItems = [
  {
    title: 'Федеральный закон "Об органах принудительного исполнения Российской Федерации"',
    number: '№ 118-ФЗ',
    icon: Gavel,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    tag: 'Закон'
  },
  {
    title: 'Федеральный закон "Об исполнительном производстве"',
    number: '№ 229-ФЗ',
    icon: Scale,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    tag: 'Закон'
  },
  {
    title: 'Кодекс об административных правонарушениях (КоАП РФ)',
    number: 'Извлечения',
    icon: Shield,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    tag: 'Кодекс'
  },
  {
    title: 'Уголовный кодекс (УК РФ)',
    number: 'Извлечения',
    icon: Archive,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    tag: 'Кодекс'
  },
  {
    title: 'Методические рекомендации по вопросам исполнительного производства',
    number: '2025',
    icon: FileText,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    tag: 'Методичка'
  },
];

export const LibraryTab: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 pb-10">
      <div className="bg-indigo-600/10 border border-indigo-100 rounded-2xl p-4 mb-2">
        <p className="text-xs font-semibold text-indigo-800 uppercase tracking-wider mb-1">Информация</p>
        <p className="text-sm text-indigo-900 leading-relaxed">
          В данном разделе собраны основные нормативно-правовые акты и методические материалы, 
          необходимые для подготовки к экзаменам и повседневной служебной деятельности.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {libraryItems.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group bg-white/70 backdrop-blur-sm border border-gray-200 rounded-3xl p-5 hover:bg-white hover:shadow-xl hover:border-indigo-200 transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-300`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 uppercase tracking-tighter">
                    {item.tag}
                  </span>
                  <span className="text-xs font-medium text-gray-400">
                    {item.number}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 leading-snug mb-3">
                  {item.title}
                </h3>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold transition-colors">
                    <Download size={14} />
                    PDF
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-blue-50 text-blue-600 rounded-xl text-xs font-bold transition-colors">
                    <ExternalLink size={14} />
                    Открыть
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
