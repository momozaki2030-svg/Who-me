import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ArrowRight } from 'lucide-react';

interface Props {
  key?: string | number;
  onBack: () => void;
}

export function HowToPlayScreen({ onBack }: Props) {
  const steps = [
    { icon: '👥', title: 'لاعبان', desc: 'اللعبة مخصصة للاعبين اثنين يستخدمان نفس الهاتف.' },
    { icon: '🤫', title: 'السر', desc: 'كل لاعب يحصل على بطاقة سرية يراها الخصم فقط.' },
    { icon: '📱', title: 'تمرير الهاتف', desc: 'مرر الهاتف لخصمك ليعرف بطاقتك السرية، ثم خذ الهاتف مجدداً لتسأله.' },
    { icon: '❓', title: 'الأسئلة', desc: 'اسأل خصمك أسئلة تكون إجابتها (نعم) أو (لا) لتعرف من أنت.' },
    { icon: '💡', title: 'التخمين', desc: 'عندما تعرف الإجابة، اضغط على (أريد التخمين). لديك محاولتان فقط!' },
    { icon: '🏆', title: 'الفوز', desc: 'من يخمن بشكل صحيح يجمع النقاط ويفوز!' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
      className="min-h-screen p-6 max-w-lg mx-auto pb-8"
    >
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="p-2 -mr-2 bg-surface-active rounded-full hover:bg-slate-300 transition-colors">
          <ArrowRight className="w-6 h-6 text-content" />
        </button>
        <h2 className="text-2xl font-bold mr-4 text-content">كيف تلعب؟</h2>
      </div>

      <div className="space-y-4">
        {steps.map((step, i) => (
          <Card key={i} className="p-4 flex gap-4 items-center">
            <div className="w-16 h-16 shrink-0 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl">
              {step.icon}
            </div>
            <div>
              <h3 className="font-bold text-lg text-content">{step.title}</h3>
              <p className="text-content-muted text-sm leading-relaxed">{step.desc}</p>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
