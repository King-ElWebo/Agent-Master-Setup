'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  defaultImageUrl?: string;
}

export function ImageUploader({ onUploadSuccess, defaultImageUrl }: ImageUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>(defaultImageUrl || '');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const uploadFile = async (file: File) => {
    setErrorMsg('');
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to upload image');
      }
      
      const data = await res.json();
      setUploadedUrl(data.url);
      onUploadSuccess(data.url);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      uploadFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      uploadFile(file);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full min-h-[140px] border border-dashed rounded-lg flex flex-col items-center justify-center p-6 cursor-pointer text-center select-none active:scale-[0.99] transition-[border-color,background-color,transform] duration-[100ms] ease-out ${
          dragOver 
            ? 'border-black bg-neutral-200 dark:border-white dark:bg-white/[0.02]' 
            : 'border-neutral-400 bg-neutral-100/50 hover:border-neutral-900 hover:bg-neutral-200/50 dark:border-brand-100/20 dark:bg-brand-100/5 dark:hover:border-white/40 dark:hover:bg-brand-100/10'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center space-y-3">
            <div className="w-6 h-6 border-2 border-neutral-900 border-t-transparent dark:border-white dark:border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-neutral-800 dark:text-brand-100/70 tracking-[0.1em] uppercase font-bold">Uploading asset...</span>
          </div>
        ) : uploadedUrl ? (
          <div className="relative w-full h-32 flex items-center justify-center">
            <div className="relative w-28 h-28 border border-neutral-300 dark:border-brand-100/10 bg-neutral-100 dark:bg-brand-950 overflow-hidden">
              <Image 
                src={uploadedUrl} 
                alt="Uploaded preview" 
                fill 
                className="object-cover opacity-90 hover:opacity-100 transition-[opacity] duration-[100ms] ease-out"
              />
            </div>
            <div className="absolute bottom-0 text-[10px] text-white dark:text-brand-100 bg-neutral-900 dark:bg-brand-950/80 px-2.5 py-0.5 border border-neutral-900 dark:border-brand-100/20 uppercase tracking-[0.15em] font-bold translate-y-2 rounded shadow-sm">
              Ready
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-600 dark:text-brand-100/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span className="text-xs font-bold text-black dark:text-brand-100 tracking-wide">Drag & Drop Cover Image</span>
            <span className="text-[10px] text-neutral-800 dark:text-brand-100/40 tracking-[0.05em] font-bold">JPEG, PNG, WEBP (MAX. 5MB)</span>
          </div>
        )}
      </div>

      {errorMsg && (
        <span className="text-xs text-red-600 dark:text-red-500 uppercase tracking-wider block font-bold">
          Upload Error: {errorMsg}
        </span>
      )}
    </div>
  );
}
