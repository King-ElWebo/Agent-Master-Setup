'use client';

import React, { useState, useEffect } from 'react';
import { CollectionTable } from '@/components/admin/CollectionTable';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { useTranslation } from '@/hooks/useTranslation';

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface CollectionItem {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  price?: number;
  badge?: string;
  categoryId: string;
  category: Category;
  images: { id: string; url: string; isCover: boolean }[];
}

export default function AdminItems() {
  const { t } = useTranslation();
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [price, setPrice] = useState('');
  const [badge, setBadge] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch Items & Categories
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [itemsRes, catsRes] = await Promise.all([
        fetch('/api/admin/items'),
        fetch('/api/admin/categories'),
      ]);
      
      if (itemsRes.ok && catsRes.ok) {
        const [itemsData, catsData] = await Promise.all([
          itemsRes.json(),
          catsRes.json(),
        ]);
        setItems(itemsData);
        setCategories(catsData);
        if (catsData.length > 0) {
          setCategoryId(catsData[0].id);
        }
      }
    } catch (error) {
      console.error('Fetch Admin Data Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Sync Slug with Title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    setSlug(
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    );
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!categoryId) {
      setErrorMsg('A valid category selection is required.');
      return;
    }

    if (!imageUrl) {
      setErrorMsg('An uploaded cover image asset pointer is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const sanitizedPrice = price.replace(',', '.');
      const parsedPrice = parseFloat(sanitizedPrice);
      const payload = {
        title,
        slug,
        subtitle: subtitle || undefined,
        price: !isNaN(parsedPrice) && parsedPrice >= 0 ? parsedPrice : null,
        badge: badge || undefined,
        categoryId,
        imageUrl,
      };

      const res = await fetch('/api/admin/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create item');
      }

      // Reset form & close modal
      setTitle('');
      setSlug('');
      setSubtitle('');
      setPrice('');
      setBadge('');
      setImageUrl('');
      setIsModalOpen(false);
      
      // Refresh Data
      fetchData();
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      <header className="mb-12 flex justify-between items-end border-b border-neutral-300 dark:border-brand-100/10 pb-8 transition-colors duration-200 select-none">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-black dark:text-brand-100 mb-2">{t('items.title')}</h1>
          <p className="text-sm tracking-[0.1em] text-neutral-700 dark:text-brand-100/50 uppercase select-none font-bold">{t('items.subtitle')}</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-brand-100 dark:text-brand-950 dark:hover:bg-white px-8 py-4 text-xs tracking-[0.2em] font-bold uppercase active:scale-[0.97] transition-[background-color,transform] duration-[100ms] ease-out cursor-pointer rounded border-none shadow-sm"
        >
          {t('items.createButton')}
        </button>
      </header>

      <section>
        {isLoading ? (
          <div className="w-full border border-neutral-300 dark:border-brand-100/10 bg-white dark:bg-brand-950 overflow-hidden divide-y divide-neutral-300 dark:divide-brand-100/10 transition-[background-color,border-color] duration-200 rounded-premium-sm shadow-sm">
            {/* Skeleton Table Header */}
            <div className="border-b border-neutral-300 dark:border-brand-100/10 bg-neutral-100/50 dark:bg-brand-100/5 py-5 px-8 flex justify-between transition-colors duration-200">
              <div className="h-4 bg-neutral-300 dark:bg-brand-100/15 w-24 animate-pulse"></div>
              <div className="h-4 bg-neutral-300 dark:bg-brand-100/15 w-32 animate-pulse"></div>
              <div className="h-4 bg-neutral-300 dark:bg-brand-100/15 w-20 animate-pulse"></div>
              <div className="h-4 bg-neutral-300 dark:bg-brand-100/15 w-16 animate-pulse"></div>
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="py-5 px-8 flex items-center justify-between">
                <div className="w-16 h-16 bg-neutral-300 dark:bg-brand-100/5 border border-neutral-300 dark:border-brand-100/10 animate-pulse flex-shrink-0"></div>
                <div className="flex-1 ml-8 space-y-2">
                  <div className="h-4 bg-neutral-300 dark:bg-brand-100/15 w-1/3 animate-pulse"></div>
                  <div className="h-3 bg-neutral-300 dark:bg-brand-100/5 w-1/4 animate-pulse"></div>
                </div>
                <div className="h-6 bg-neutral-300 dark:bg-brand-100/5 border border-neutral-300 dark:border-brand-100/10 w-24 animate-pulse ml-8"></div>
                <div className="h-4 bg-neutral-300 dark:bg-brand-100/5 w-16 animate-pulse ml-12"></div>
                <div className="w-32 flex justify-end space-x-4 ml-12">
                  <div className="h-4 bg-neutral-300 dark:bg-brand-100/5 w-10 animate-pulse"></div>
                  <div className="h-4 bg-neutral-300 dark:bg-brand-100/5 w-12 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <CollectionTable items={items} onDelete={handleDeleteItem} />
        )}
      </section>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-neutral-950/40 dark:bg-brand-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="w-full max-w-xl border border-neutral-300 dark:border-brand-100/10 bg-white dark:bg-brand-950 p-8 shadow-2xl relative rounded-premium-md">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-xs text-neutral-700 dark:text-brand-100/50 hover:text-black dark:hover:text-brand-100 transition-[color] duration-[100ms] cursor-pointer font-bold"
            >
              {t('items.closeModal')}
            </button>

            <h2 className="text-xl font-light tracking-tight text-black dark:text-brand-100 mb-6 select-none">{t('items.modalTitle')}</h2>

            {errorMsg && (
              <div className="bg-red-950/10 dark:bg-red-950/40 border border-red-500/30 text-red-700 dark:text-red-400 text-xs p-4 mb-6 uppercase tracking-wider rounded font-semibold transition-colors duration-200">
                Error: {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-2">
                  <label className="text-xs uppercase tracking-[0.1em] text-neutral-700 dark:text-brand-100/50 select-none font-bold">{t('items.labelTitle')}</label>
                  <input 
                    type="text" 
                    required 
                    value={title} 
                    onChange={handleTitleChange} 
                    className="w-full bg-white dark:bg-brand-100/5 border border-neutral-400 dark:border-brand-100/10 text-black dark:text-brand-100 text-sm p-4 font-semibold focus:outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/20 dark:focus:ring-white/10 focus:bg-neutral-100 dark:focus:bg-brand-100/10 transition-[border-color,box-shadow,background-color] duration-[100ms] ease-out placeholder:text-neutral-500 dark:placeholder:text-brand-100/30 rounded"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-xs uppercase tracking-[0.1em] text-neutral-700 dark:text-brand-100/50 select-none font-bold">{t('items.labelSlug')}</label>
                  <input 
                    type="text" 
                    required 
                    value={slug} 
                    onChange={(e) => setSlug(e.target.value)} 
                    className="w-full bg-white dark:bg-brand-100/5 border border-neutral-400 dark:border-brand-100/10 text-black dark:text-brand-100 text-sm p-4 font-semibold focus:outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/20 dark:focus:ring-white/10 focus:bg-neutral-100 dark:focus:bg-brand-100/10 transition-[border-color,box-shadow,background-color] duration-[100ms] ease-out placeholder:text-neutral-500 dark:placeholder:text-brand-100/30 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-2">
                  <label className="text-xs uppercase tracking-[0.1em] text-neutral-700 dark:text-brand-100/50 select-none font-bold">{t('items.labelSubtitle')}</label>
                  <input 
                    type="text" 
                    value={subtitle} 
                    onChange={(e) => setSubtitle(e.target.value)} 
                    className="w-full bg-white dark:bg-brand-100/5 border border-neutral-400 dark:border-brand-100/10 text-black dark:text-brand-100 text-sm p-4 font-semibold focus:outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/20 dark:focus:ring-white/10 focus:bg-neutral-100 dark:focus:bg-brand-100/10 transition-[border-color,box-shadow,background-color] duration-[100ms] ease-out placeholder:text-neutral-500 dark:placeholder:text-brand-100/30 rounded"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-xs uppercase tracking-[0.1em] text-neutral-700 dark:text-brand-100/50 select-none font-bold">{t('items.labelCategory')}</label>
                  <select 
                    value={categoryId} 
                    onChange={(e) => setCategoryId(e.target.value)} 
                    className="w-full bg-white dark:bg-brand-950 border border-neutral-400 dark:border-brand-100/10 text-black dark:text-brand-100 text-sm p-4 font-semibold focus:outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/20 dark:focus:ring-white/10 focus:bg-neutral-100 dark:focus:bg-brand-100/10 transition-[border-color,box-shadow,background-color] duration-[100ms] ease-out rounded"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-white dark:bg-brand-950 text-black dark:text-brand-100 font-semibold">{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-2">
                  <label className="text-xs uppercase tracking-[0.1em] text-neutral-700 dark:text-brand-100/50 select-none font-bold">{t('items.labelPrice')}</label>
                  <input 
                    type="text" 
                    value={price} 
                    placeholder={t('items.placeholderPrice')}
                    onChange={(e) => setPrice(e.target.value)} 
                    className="w-full bg-white dark:bg-brand-100/5 border border-neutral-400 dark:border-brand-100/10 text-black dark:text-brand-100 text-sm p-4 font-semibold focus:outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/20 dark:focus:ring-white/10 focus:bg-neutral-100 dark:focus:bg-brand-100/10 transition-[border-color,box-shadow,background-color] duration-[100ms] ease-out placeholder:text-neutral-500 dark:placeholder:text-brand-100/30 rounded"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-xs uppercase tracking-[0.1em] text-neutral-700 dark:text-brand-100/50 select-none font-bold">{t('items.labelBadge')}</label>
                  <input 
                    type="text" 
                    value={badge} 
                    onChange={(e) => setBadge(e.target.value)} 
                    placeholder={t('items.placeholderBadge')}
                    className="w-full bg-white dark:bg-brand-100/5 border border-neutral-400 dark:border-brand-100/10 text-black dark:text-brand-100 text-sm p-4 font-semibold focus:outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/20 dark:focus:ring-white/10 focus:bg-neutral-100 dark:focus:bg-brand-100/10 transition-[border-color,box-shadow,background-color] duration-[100ms] ease-out placeholder:text-neutral-500 dark:placeholder:text-brand-100/30 rounded"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-xs uppercase tracking-[0.1em] text-neutral-700 dark:text-brand-100/50 mb-2 select-none font-bold">{t('items.labelImage')}</label>
                <ImageUploader onUploadSuccess={setImageUrl} defaultImageUrl={imageUrl} />
              </div>

              <div className="pt-4 flex justify-end space-x-4 border-t border-neutral-300 dark:border-brand-100/10 transition-colors duration-200">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="border border-neutral-450 dark:border-brand-100/20 bg-transparent text-neutral-800 dark:text-brand-100 hover:bg-neutral-200 dark:hover:bg-brand-100/5 px-6 py-4 text-xs tracking-[0.15em] font-bold uppercase active:scale-[0.97] transition-[border-color,background-color,transform] duration-[100ms] ease-out cursor-pointer rounded"
                >
                  {t('items.cancel')}
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting || !imageUrl}
                  className="bg-neutral-900 text-white dark:bg-brand-100 dark:text-brand-950 px-8 py-4 text-xs tracking-[0.15em] font-bold uppercase hover:bg-neutral-800 dark:hover:bg-white active:scale-[0.97] transition-[background-color,color,transform] duration-[100ms] ease-out disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded border-none shadow-sm"
                >
                  {isSubmitting ? t('items.submitting') : t('items.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
