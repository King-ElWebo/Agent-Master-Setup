'use client';

import React, { useState, useEffect } from 'react';
import { FaqList, FaqItem } from '@/components/admin/FaqList';
import { useTranslation } from '@/hooks/useTranslation';

export default function FaqsPage() {
  const { t } = useTranslation();
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchFaqs = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/faqs');
      if (res.ok) {
        const data = await res.json();
        setFaqs(data);
      } else {
        throw new Error('Failed to load FAQs');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error fetching FAQs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setErrorMsg('');
    try {
      const res = await fetch(`/api/admin/faqs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!res.ok) {
        throw new Error('Failed to update FAQ status');
      }

      setFaqs((prev) =>
          prev.map((f) => (f.id === id ? { ...f, isActive: !currentStatus } : f))
      );
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleChangeOrder = async (id: string, newOrder: number) => {
    setErrorMsg('');
    try {
      const res = await fetch(`/api/admin/faqs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sortOrder: newOrder }),
      });

      if (!res.ok) {
        throw new Error('Failed to update FAQ ordering');
      }

      setFaqs((prev) =>
          prev
              .map((f) => (f.id === id ? { ...f, sortOrder: newOrder } : f))
              .sort((a, b) => a.sortOrder - b.sortOrder)
      );
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ rule permanently?')) return;
    setErrorMsg('');
    try {
      const res = await fetch(`/api/admin/faqs/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete FAQ rule');
      }

      setFaqs((prev) => prev.filter((f) => f.id !== id));
      setSuccessMsg(t('faqs.successPurged'));
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          answer,
          sortOrder,
          isActive,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to declare FAQ rule');
      }

      setQuestion('');
      setAnswer('');
      setSortOrder(0);
      setIsActive(true);
      setIsModalOpen(false);
      setSuccessMsg(t('faqs.successDeclared'));
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchFaqs();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <>
        {/* Header */}
        <div className="flex items-end justify-between mb-12 border-b border-neutral-300 dark:border-brand-100/10 pb-8 transition-colors duration-200 select-none">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-black dark:text-brand-100 mb-2">{t('faqs.title')}</h1>
            <p className="text-sm tracking-[0.1em] text-neutral-700 dark:text-brand-100/50 uppercase select-none font-bold">{t('faqs.subtitle')}</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-brand-100 dark:text-brand-950 dark:hover:bg-white px-8 py-4 text-xs tracking-[0.2em] font-bold uppercase active:scale-[0.97] transition-[background-color,transform] duration-[100ms] ease-out cursor-pointer rounded shadow border-none"
          >
            {t('faqs.addButton')}
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-950/10 dark:bg-red-950/40 border border-red-500/30 text-red-700 dark:text-red-400 text-xs p-4 mb-8 uppercase tracking-wider transition-colors duration-200 rounded font-semibold">
            Error: {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-white dark:bg-white/5 border border-neutral-400 dark:border-white/20 text-black dark:text-brand-100 text-xs p-4 mb-8 uppercase tracking-wider animate-pulse shadow transition-colors duration-200 rounded font-bold">
            {successMsg}
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-neutral-300 dark:border-brand-100/10 p-6 flex flex-col space-y-4 animate-pulse bg-white dark:bg-brand-950/20 shadow rounded">
                <div className="h-4 bg-neutral-300 dark:bg-brand-100/15 w-1/3"></div>
                <div className="h-10 bg-neutral-300 dark:bg-brand-100/5 w-full"></div>
              </div>
            ))}
          </div>
        ) : faqs.length === 0 ? (
          <div className="h-64 border border-neutral-400 dark:border-brand-100/10 border-dashed flex items-center justify-center text-sm text-neutral-700 dark:text-brand-100/40 uppercase tracking-widest bg-white dark:bg-brand-950/20 shadow rounded select-none font-bold">
            {t('faqs.empty')}
          </div>
        ) : (
          <FaqList 
            faqs={faqs} 
            onToggleActive={handleToggleActive} 
            onChangeOrder={handleChangeOrder} 
            onDelete={handleDelete} 
          />
        )}

        {/* New FAQ Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-neutral-950/40 dark:bg-brand-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-brand-950 border border-neutral-300 dark:border-brand-100/10 w-full max-w-xl p-8 flex flex-col shadow-2xl animate-[fadeIn_0.2s_ease-out] rounded">
              <div className="flex items-center justify-between mb-8 border-b border-neutral-300 dark:border-brand-100/10 pb-4 transition-colors duration-200">
                <h2 className="text-xs tracking-[0.2em] uppercase font-bold text-black dark:text-brand-100 select-none">
                  {t('faqs.modalTitle')}
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-neutral-700 dark:text-brand-100/50 hover:text-black dark:hover:text-brand-100 text-sm tracking-wider uppercase transition-colors duration-[100ms] cursor-pointer font-bold"
                >
                  {t('faqs.close')}
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col space-y-3">
                  <label htmlFor="faqQuestion" className="text-xs tracking-[0.1em] uppercase text-neutral-700 dark:text-brand-100/50 select-none font-bold">
                    {t('faqs.question')}
                  </label>
                  <input 
                    id="faqQuestion"
                    type="text" 
                    required 
                    value={question} 
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder={t('faqs.placeholderQuestion')}
                    className="w-full bg-white dark:bg-brand-100/5 border border-neutral-400 dark:border-brand-100/10 text-black dark:text-brand-100 text-sm p-4 font-semibold focus:outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/20 dark:focus:ring-white/10 focus:bg-neutral-100 dark:focus:bg-brand-100/10 transition-[border-color,box-shadow,background-color] duration-[100ms] ease-out placeholder:text-neutral-500 dark:placeholder:text-brand-100/30 rounded"
                  />
                </div>

                <div className="flex flex-col space-y-3">
                  <label htmlFor="faqAnswer" className="text-xs tracking-[0.1em] uppercase text-neutral-700 dark:text-brand-100/50 select-none font-bold">
                    {t('faqs.answer')}
                  </label>
                  <textarea 
                    id="faqAnswer"
                    required 
                    value={answer} 
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder={t('faqs.placeholderAnswer')}
                    rows={5}
                    className="w-full bg-white dark:bg-brand-100/5 border border-neutral-400 dark:border-brand-100/10 text-black dark:text-brand-100 text-sm p-4 font-semibold focus:outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/20 dark:focus:ring-white/10 focus:bg-neutral-100 dark:focus:bg-brand-100/10 transition-[border-color,box-shadow,background-color] duration-[100ms] ease-out placeholder:text-neutral-500 dark:placeholder:text-brand-100/30 resize-none rounded"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-3">
                    <label htmlFor="faqOrder" className="text-xs tracking-[0.1em] uppercase text-neutral-700 dark:text-brand-100/50 select-none font-bold">
                      {t('faqs.sortOrder')}
                    </label>
                    <input 
                      id="faqOrder"
                      type="number" 
                      required 
                      value={sortOrder} 
                      onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                      className="w-full bg-white dark:bg-brand-100/5 border border-neutral-400 dark:border-brand-100/10 text-black dark:text-brand-100 text-sm p-4 font-semibold focus:outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/20 dark:focus:ring-white/10 focus:bg-neutral-100 dark:focus:bg-brand-100/10 transition-[border-color,box-shadow,background-color] duration-[100ms] ease-out rounded"
                    />
                  </div>

                  <div className="flex flex-col space-y-3">
                    <span className="text-xs tracking-[0.1em] uppercase text-neutral-700 dark:text-brand-100/50 select-none font-bold">{t('faqs.activeStatus')}</span>
                    <div className="flex items-center h-full">
                      <button 
                        type="button"
                        onClick={() => setIsActive(!isActive)}
                        className={`w-10 h-5 rounded-full relative transition-[background-color,border-color] duration-[100ms] ease-out focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/10 focus:border-black dark:focus:border-white cursor-pointer ${
                          isActive 
                            ? 'bg-neutral-900 border border-neutral-900 dark:bg-white dark:border-white' 
                            : 'bg-neutral-300 border border-neutral-400 dark:bg-brand-100/5 dark:border-brand-100/20'
                        }`}
                      >
                        <div 
                          className={`w-3 h-3 rounded-full absolute top-0.5 transition-transform duration-[100ms] ease-out ${
                            isActive ? 'translate-x-[22px] bg-white dark:bg-neutral-900' : 'translate-x-1 bg-neutral-600 dark:bg-brand-100/50'
                          }`}
                        />
                      </button>
                      <span className="text-xs tracking-wider uppercase ml-3 text-neutral-800 dark:text-brand-100/70 select-none font-bold">
                        {isActive ? t('faqs.statusPublished') : t('faqs.statusDraft')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-300 dark:border-brand-100/10 transition-colors duration-200 flex justify-end space-x-4">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-4 text-xs tracking-[0.15em] text-neutral-700 dark:text-brand-100/50 hover:text-black dark:hover:text-brand-100 uppercase transition-colors duration-[100ms] cursor-pointer font-bold select-none"
                  >
                    {t('faqs.cancel')}
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-neutral-900 text-white dark:bg-brand-100 dark:text-brand-950 px-8 py-4 text-xs tracking-[0.15em] uppercase font-bold hover:bg-neutral-800 dark:hover:bg-white active:scale-[0.97] transition-[background-color,color,transform] duration-[100ms] ease-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none rounded border-none shadow"
                  >
                    {isSubmitting ? t('faqs.submitting') : t('faqs.submit')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
  );
}
