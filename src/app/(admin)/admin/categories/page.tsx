'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export default function CategoryHub() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Form State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Fetch Categories Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (!editingCategory) {
      setSlug(
        value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      );
    }
  };

  const handleEditInit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      if (editingCategory) {
        // PUT Request to update
        const res = await fetch(`/api/admin/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, slug, description: description || null }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to update category');
        }

        setSuccessMsg(t('categories.successUpdate'));
        setEditingCategory(null);
      } else {
        // POST Request to create
        const res = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, slug, description: description || undefined }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to create category');
        }

        setSuccessMsg(t('categories.successCreate'));
      }

      setName('');
      setSlug('');
      setDescription('');
      
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchCategories();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (deletingId) return;
    if (!confirm('Are you sure you want to delete this scope and all its mapped items?')) return;
    setDeletingId(id);

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete category');
      }

      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      if (editingCategory?.id === id) {
        handleCancelEdit();
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="pb-24 select-none">
      <header className="mb-12 border-b border-neutral-300 dark:border-brand-100/10 pb-8 transition-colors duration-200">
        <h1 className="text-3xl font-light tracking-tight text-black dark:text-brand-100 mb-2">{t('categories.title')}</h1>
        <p className="text-sm tracking-[0.1em] text-neutral-700 dark:text-brand-100/50 uppercase select-none font-bold">{t('categories.subtitle')}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Side: Create/Edit Form */}
        <div className="lg:col-span-1 border border-neutral-300 dark:border-brand-100/10 bg-white dark:bg-brand-950 p-8 flex flex-col h-fit transition-[background-color,border-color] duration-200 rounded-premium-sm shadow-sm">
          <h2 className="text-xs tracking-[0.2em] uppercase font-bold text-black dark:text-brand-100 mb-8 border-b border-neutral-300 dark:border-brand-100/10 pb-4 select-none">
            {editingCategory ? t('categories.modifyTitle') : t('categories.declareTitle')}
          </h2>

          {errorMsg && (
            <div className="bg-red-950/10 dark:bg-red-950/40 border border-red-500/30 text-red-700 dark:text-red-400 text-xs p-4 mb-6 uppercase tracking-wider rounded font-semibold transition-colors duration-200">
              Error: {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="bg-neutral-900 border border-neutral-900 dark:bg-white/5 dark:border-white/20 text-white dark:text-brand-100 text-xs p-4 mb-6 uppercase tracking-wider animate-pulse shadow rounded font-bold transition-colors duration-200">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col space-y-3">
              <label htmlFor="categoryName" className="text-xs tracking-[0.1em] uppercase text-neutral-700 dark:text-brand-100/50 select-none font-bold">
                {t('categories.labelName')}
              </label>
              <input 
                id="categoryName"
                type="text" 
                required 
                value={name} 
                onChange={handleNameChange}
                placeholder={t('categories.placeholderName')}
                className="w-full bg-white dark:bg-brand-100/5 border border-neutral-400 dark:border-brand-100/10 text-black dark:text-brand-100 text-sm p-4 font-semibold focus:outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/20 dark:focus:ring-white/10 focus:bg-neutral-100 dark:focus:bg-brand-100/10 transition-[border-color,box-shadow,background-color] duration-[100ms] ease-out placeholder:text-neutral-500 dark:placeholder:text-brand-100/30 rounded"
              />
            </div>

            <div className="flex flex-col space-y-3">
              <label htmlFor="categorySlug" className="text-xs tracking-[0.1em] uppercase text-neutral-700 dark:text-brand-100/50 select-none font-bold">
                {t('categories.labelSlug')}
              </label>
              <input 
                id="categorySlug"
                type="text" 
                required 
                value={slug} 
                onChange={(e) => setSlug(e.target.value)}
                placeholder={t('categories.placeholderSlug')}
                className="w-full bg-white dark:bg-brand-100/5 border border-neutral-400 dark:border-brand-100/10 text-black dark:text-brand-100 text-sm p-4 font-semibold focus:outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/20 dark:focus:ring-white/10 focus:bg-neutral-100 dark:focus:bg-brand-100/10 transition-[border-color,box-shadow,background-color] duration-[100ms] ease-out placeholder:text-neutral-500 dark:placeholder:text-brand-100/30 rounded"
              />
            </div>

            <div className="flex flex-col space-y-3">
              <label htmlFor="categoryDesc" className="text-xs tracking-[0.1em] uppercase text-neutral-700 dark:text-brand-100/50 select-none font-bold">
                {t('categories.labelDesc')}
              </label>
              <textarea 
                id="categoryDesc"
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('categories.placeholderDesc')}
                rows={4}
                className="w-full bg-white dark:bg-brand-100/5 border border-neutral-400 dark:border-brand-100/10 text-black dark:text-brand-100 text-sm p-4 font-semibold focus:outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/20 dark:focus:ring-white/10 focus:bg-neutral-100 dark:focus:bg-brand-100/10 transition-[border-color,box-shadow,background-color] duration-[100ms] ease-out placeholder:text-neutral-500 dark:placeholder:text-brand-100/30 resize-none rounded"
              />
            </div>

            <div className="flex flex-col space-y-3 pt-2">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-neutral-900 text-white dark:bg-brand-100 dark:text-brand-950 py-5 text-xs tracking-[0.2em] font-bold uppercase hover:bg-neutral-800 dark:hover:bg-white active:scale-[0.97] transition-[background-color,color,transform] duration-[100ms] ease-out cursor-pointer rounded border-none shadow"
              >
                {isSubmitting 
                  ? (editingCategory ? t('categories.loadingModify') : t('categories.loadingDeclare')) 
                  : (editingCategory ? t('categories.submitModify') : t('categories.submitDeclare'))
                }
              </button>
              
              {editingCategory && (
                <button 
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full bg-transparent border border-neutral-400 dark:border-brand-100/10 hover:bg-neutral-200 dark:hover:bg-brand-100/5 text-neutral-800 dark:text-brand-100/70 py-4 text-xs tracking-[0.2em] font-bold uppercase active:scale-[0.97] transition-[background-color,transform] duration-[100ms] ease-out cursor-pointer rounded"
                >
                  {t('categories.cancelEdit')}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Side: Category List */}
        <div className="lg:col-span-2 border border-neutral-300 dark:border-brand-100/10 bg-white dark:bg-brand-950 p-8 flex flex-col transition-[background-color,border-color] duration-200 rounded-premium-sm shadow-sm">
          <h2 className="text-xs tracking-[0.2em] uppercase font-bold text-black dark:text-brand-100 mb-8 border-b border-neutral-300 dark:border-brand-100/10 pb-4 select-none">
            {t('categories.gridTitle')}
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border border-neutral-300 dark:border-brand-100/10 p-6 flex flex-col space-y-2 animate-pulse rounded bg-white">
                  <div className="h-4 bg-neutral-300 dark:bg-brand-100/15 w-1/4"></div>
                  <div className="h-3 bg-neutral-300 dark:bg-brand-100/5 w-1/2"></div>
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="h-48 border border-neutral-400 dark:border-brand-100/10 border-dashed flex items-center justify-center text-sm text-neutral-700 dark:text-brand-100/40 uppercase tracking-widest bg-white dark:bg-brand-950/20 rounded shadow-sm select-none font-bold">
              {t('categories.empty')}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((cat) => {
                const isDeleting = deletingId === cat.id;
                const isEditing = editingCategory?.id === cat.id;
                return (
                  <div 
                    key={cat.id} 
                    className={`border p-6 flex flex-col justify-between group transition-[border-color,opacity,transform] duration-[250ms] ease-out rounded shadow-sm ${
                      isEditing 
                        ? 'border-neutral-900 dark:border-white bg-neutral-100/30 dark:bg-white/[0.02]' 
                        : 'border-neutral-300 dark:border-brand-100/10 bg-white dark:bg-brand-950/40 hover:border-neutral-450 dark:hover:border-white/20'
                    } ${
                      isDeleting ? 'opacity-30 translate-x-2' : 'opacity-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-bold text-black dark:text-brand-100 tracking-wide">{cat.name}</h3>
                        <span className="text-[10px] text-black dark:text-brand-100 bg-neutral-100 dark:bg-brand-100/5 px-2 py-0.5 border border-neutral-400 dark:border-brand-100/10 uppercase tracking-[0.1em] font-bold select-none rounded">
                          {cat.slug}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-800 dark:text-brand-100/50 leading-relaxed mb-6 font-medium">
                        {cat.description || t('categories.noDesc')}
                      </p>
                    </div>
                    <div className="border-t border-neutral-300 dark:border-brand-100/10 pt-4 flex items-center justify-between transition-colors duration-200">
                      <span className="text-[10px] text-neutral-700 dark:text-brand-100/30 tracking-wider uppercase font-mono select-none font-medium">{t('categories.scopeId')}{cat.id.slice(0, 8)}...</span>
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => handleEditInit(cat)}
                          className="text-[10px] tracking-[0.15em] text-neutral-800 hover:text-black hover:bg-neutral-200 dark:text-brand-100/70 dark:hover:text-white px-2.5 py-1 border border-neutral-400 dark:border-brand-100/20 rounded font-bold uppercase transition-[color,background-color,transform] duration-[100ms] ease-out select-none"
                        >
                          {t('categories.edit')}
                        </button>
                        <button 
                          onClick={() => handleDelete(cat.id)}
                          disabled={isDeleting}
                          className={`text-[10px] tracking-[0.15em] text-red-600 hover:text-red-700 hover:bg-neutral-200 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-500/10 px-2.5 py-1 border border-neutral-400 dark:border-brand-100/20 rounded font-bold uppercase transition-[color,background-color,transform] duration-[100ms] ease-out select-none ${
                            isDeleting ? 'animate-pulse text-red-500' : ''
                          }`}
                        >
                          {isDeleting ? t('categories.deleting') : t('categories.delete')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
