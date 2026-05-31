'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CollectionItem } from '@/app/(admin)/admin/items/page';

interface CollectionTableProps {
  items: CollectionItem[];
  onDelete: (id: string) => void;
}

export function CollectionTable({ items, onDelete }: CollectionTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const placeholderSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%231a1a1a'/%3E%3C/svg%3E";

  const handleDelete = async (id: string) => {
    if (deletingId) return;
    
    setDeletingId(id);

    try {
      const res = await fetch(`/api/admin/items/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete item');
      }

      onDelete(id);
    } catch (error) {
      console.error('Delete Item Error:', error);
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full border border-neutral-300 dark:border-brand-100/10 bg-white dark:bg-brand-950 overflow-hidden transition-[background-color,border-color] duration-200 rounded-premium-sm shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-neutral-300 dark:border-brand-100/10 bg-neutral-100/50 dark:bg-brand-100/5 transition-colors duration-200">
            <th className="py-5 px-8 text-xs font-bold tracking-[0.15em] text-neutral-900 dark:text-brand-100/50 uppercase w-24 select-none">Asset</th>
            <th className="py-5 px-8 text-xs font-bold tracking-[0.15em] text-neutral-900 dark:text-brand-100/50 uppercase select-none">Identity</th>
            <th className="py-5 px-8 text-xs font-bold tracking-[0.15em] text-neutral-900 dark:text-brand-100/50 uppercase select-none">Category</th>
            <th className="py-5 px-8 text-xs font-bold tracking-[0.15em] text-neutral-900 dark:text-brand-100/50 uppercase select-none">Price & Badge</th>
            <th className="py-5 px-8 text-xs font-bold tracking-[0.15em] text-neutral-900 dark:text-brand-100/50 uppercase text-right select-none">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-300 dark:divide-brand-100/10 transition-colors duration-200">
          {items.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-12 text-center text-sm font-semibold text-neutral-500 uppercase tracking-wider">
                No items declared in database.
              </td>
            </tr>
          ) : (
            items.map((item) => {
              const isDeleting = deletingId === item.id;
              const coverImage = item.images.find(img => img.isCover)?.url || placeholderSvg;

              return (
                <tr 
                  key={item.id} 
                  className={`hover:bg-neutral-100/30 dark:hover:bg-brand-100/5 transition-[background-color,opacity,transform] duration-[150ms] ease-out group ${
                    isDeleting ? 'opacity-30 translate-x-2' : 'opacity-100'
                  }`}
                >
                  <td className="py-5 px-8">
                    <div className="w-16 h-16 relative bg-neutral-100 dark:bg-brand-100/5 overflow-hidden border border-neutral-300 dark:border-brand-100/10 group-hover:border-neutral-400 dark:group-hover:border-white/30 transition-[border-color] duration-[100ms] ease-out rounded-premium-sm">
                      <Image 
                        src={coverImage} 
                        alt={item.title} 
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 transition-[opacity] duration-[100ms] ease-out"
                      />
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-black dark:text-brand-100 tracking-wide">{item.title}</span>
                      <span className="text-xs text-neutral-800 dark:text-brand-100/50 mt-1 font-medium">{item.subtitle || 'No subtitle'}</span>
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <span className="text-xs tracking-[0.1em] text-black dark:text-brand-100 font-bold border border-neutral-400 dark:border-brand-100/20 px-3 py-1 bg-neutral-100 dark:bg-brand-100/5 inline-block select-none rounded-premium-sm">
                      {item.category.name}
                    </span>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-bold text-black dark:text-brand-100">
                        {item.price !== undefined && item.price !== null ? `$${item.price.toFixed(2)}` : 'Free'}
                      </span>
                      {item.badge && (
                        <span className="text-[10px] tracking-[0.15em] text-white dark:text-brand-100 border border-neutral-900 dark:border-brand-100/20 px-2 py-0.5 uppercase bg-neutral-900 dark:bg-brand-100/5 select-none rounded-premium-sm font-bold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-5 px-8 text-right">
                    <div className="inline-flex space-x-3">
                      <button 
                        disabled={isDeleting}
                        className="text-xs tracking-[0.15em] text-neutral-800 dark:text-brand-100 hover:bg-neutral-200 hover:text-black dark:hover:bg-brand-100/10 px-3 py-1.5 font-bold uppercase transition-[color,background-color,transform] duration-[100ms] ease-out active:scale-[0.97] cursor-pointer border border-neutral-400 dark:border-brand-100/20 select-none rounded disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        disabled={isDeleting}
                        className={`text-xs tracking-[0.15em] text-red-600 hover:text-red-700 hover:bg-neutral-200 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-500/10 px-3 py-1.5 font-bold uppercase transition-[color,background-color,transform] duration-[100ms] ease-out active:scale-[0.97] cursor-pointer border border-neutral-400 dark:border-brand-100/20 select-none rounded disabled:opacity-40 disabled:cursor-not-allowed ${
                          isDeleting ? 'animate-pulse text-red-500' : ''
                        }`}
                      >
                        {isDeleting ? 'Deleting' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
