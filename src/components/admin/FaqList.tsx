'use client';

import React from 'react';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  isActive: boolean;
  sortOrder: number;
}

interface FaqListProps {
  faqs: FaqItem[];
  onToggleActive: (id: string, currentStatus: boolean) => void;
  onChangeOrder: (id: string, newOrder: number) => void;
  onDelete: (id: string) => void;
}

export function FaqList({ faqs, onToggleActive, onChangeOrder, onDelete }: FaqListProps) {
  return (
    <div className="w-full flex flex-col space-y-4">
      {faqs.map((faq) => (
        <div 
          key={faq.id} 
          className="border border-neutral-300 dark:border-brand-100/10 bg-white dark:bg-brand-950 p-6 flex flex-col space-y-6 group hover:border-neutral-400 dark:hover:border-white/20 hover:bg-neutral-100/10 dark:hover:bg-brand-100/[0.02] shadow-sm transition-[border-color,background-color] duration-[100ms] ease-out rounded-premium-sm"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-8">
              <h3 className="text-sm font-bold text-black dark:text-brand-100 tracking-wide mb-2">{faq.question}</h3>
              <p className="text-sm text-neutral-800 dark:text-brand-100/70 font-medium leading-relaxed">{faq.answer}</p>
            </div>
            
            <div className="flex flex-col items-end space-y-4 flex-shrink-0 w-36">
              {/* Status Toggle */}
              <div className="flex items-center space-x-3 w-full justify-between">
                <span className="text-xs tracking-[0.1em] text-neutral-700 dark:text-brand-100/50 uppercase select-none font-bold">Active</span>
                <button 
                  onClick={() => onToggleActive(faq.id, faq.isActive)}
                  className={`w-10 h-5 rounded-full relative transition-[background-color,border-color] duration-[100ms] ease-out focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/10 focus:border-black dark:focus:border-white cursor-pointer ${
                    faq.isActive 
                      ? 'bg-neutral-900 border border-neutral-900 dark:bg-white dark:border-white' 
                      : 'bg-neutral-300 border border-neutral-400 dark:bg-brand-100/5 dark:border-brand-100/20'
                  }`}
                >
                  <div 
                    className={`w-3 h-3 rounded-full absolute top-0.5 transition-transform duration-[100ms] ease-out ${
                      faq.isActive ? 'translate-x-[22px] bg-white dark:bg-neutral-900' : 'translate-x-1 bg-neutral-600 dark:bg-brand-100/50'
                    }`}
                  />
                </button>
              </div>

              {/* Order Input */}
              <div className="flex items-center space-x-3 w-full justify-between">
                <label htmlFor={`order-${faq.id}`} className="text-xs tracking-[0.1em] text-neutral-700 dark:text-brand-100/50 uppercase select-none font-bold">Order</label>
                <input 
                  type="number" 
                  id={`order-${faq.id}`}
                  value={faq.sortOrder}
                  onChange={(e) => onChangeOrder(faq.id, parseInt(e.target.value) || 0)}
                  className="w-14 h-8 bg-white dark:bg-brand-100/5 border border-neutral-400 dark:border-brand-100/10 text-black dark:text-brand-100 text-xs text-center font-bold focus:outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/20 dark:focus:ring-white/10 focus:bg-neutral-100 dark:focus:bg-brand-100/10 transition-[border-color,background-color] duration-[100ms] ease-out tabular-nums rounded"
                />
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-neutral-300 dark:border-brand-100/10 transition-colors duration-100 flex justify-end">
            <button 
              onClick={() => onDelete(faq.id)}
              className="text-xs tracking-[0.15em] text-red-600 hover:text-red-700 hover:bg-neutral-200 border border-neutral-400 dark:border-brand-100/20 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-500/10 px-4 py-2 font-bold uppercase transition-[color,background-color,transform] duration-[100ms] ease-out active:scale-[0.97] cursor-pointer select-none rounded"
            >
              Delete Rule
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
