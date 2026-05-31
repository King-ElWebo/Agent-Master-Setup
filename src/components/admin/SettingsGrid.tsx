'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <section className="border border-neutral-300 dark:border-brand-100/10 bg-white dark:bg-brand-950 p-8 flex flex-col mb-8 transition-[background-color,border-color] duration-200 rounded-premium-sm shadow-sm">
      <h2 className="text-xs tracking-[0.2em] uppercase font-bold text-black dark:text-brand-100 mb-8 border-b border-neutral-300 dark:border-brand-100/10 pb-4 select-none">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {children}
      </div>
    </section>
  );
}

interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (id: string, val: string) => void;
  type?: string;
  placeholder?: string;
  multiline?: boolean;
}

function InputField({ id, label, value, onChange, type = 'text', placeholder, multiline = false }: InputFieldProps) {
  const baseClasses = "w-full bg-white dark:bg-brand-100/5 border border-neutral-400 dark:border-brand-100/10 text-black dark:text-brand-100 text-sm p-4 font-semibold focus:outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/20 dark:focus:ring-white/10 focus:bg-neutral-100 dark:focus:bg-brand-100/10 transition-[border-color,box-shadow,background-color] duration-[100ms] ease-out placeholder:text-neutral-500 dark:placeholder:text-brand-100/30 rounded-premium-sm";
  
  return (
    <div className="flex flex-col space-y-3">
      <label htmlFor={id} className="text-xs tracking-[0.1em] uppercase text-neutral-700 dark:text-brand-100/50 select-none font-bold">
        {label}
      </label>
      {multiline ? (
        <textarea 
          id={id} 
          value={value || ''} 
          onChange={(e) => onChange(id, e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={`${baseClasses} resize-none`}
        />
      ) : (
        <input 
          id={id} 
          type={type} 
          value={value || ''} 
          onChange={(e) => onChange(id, e.target.value)}
          placeholder={placeholder}
          className={baseClasses}
        />
      )}
    </div>
  );
}

export interface SettingsData {
  metaTitle: string;
  metaDescription: string;
  seoKeywords: string;
  corporateEmail: string;
  phoneNumber: string;
  openHours: string;
  physicalAddress: string;
  logoUrl: string;
  twitterUrl: string;
  linkedInUrl: string;
}

interface SettingsGridProps {
  data: SettingsData;
  onChange: (id: string, val: string) => void;
}

export function SettingsGrid({ data, onChange }: SettingsGridProps) {
  const { t } = useTranslation();

  return (
    <div className="w-full flex flex-col">
      <SettingsSection title={t('settings.sectionMetadata')}>
        <InputField id="metaTitle" label={t('settings.metaTitle')} value={data.metaTitle} onChange={onChange} />
        <InputField id="seoKeywords" label={t('settings.seoKeywords')} value={data.seoKeywords} onChange={onChange} placeholder={t('settings.placeholderKeywords')} />
        <div className="md:col-span-2">
          <InputField id="metaDescription" label={t('settings.metaDescription')} value={data.metaDescription} onChange={onChange} multiline />
        </div>
      </SettingsSection>

      <SettingsSection title={t('settings.sectionContact')}>
        <InputField id="corporateEmail" label={t('settings.corporateEmail')} type="email" value={data.corporateEmail} onChange={onChange} />
        <InputField id="phoneNumber" label={t('settings.phoneNumber')} type="tel" value={data.phoneNumber} onChange={onChange} />
        <InputField id="openHours" label={t('settings.openHours')} value={data.openHours} onChange={onChange} />
        <div className="md:col-span-2">
          <InputField id="physicalAddress" label={t('settings.physicalAddress')} value={data.physicalAddress} onChange={onChange} multiline />
        </div>
      </SettingsSection>

      <SettingsSection title={t('settings.sectionAssets')}>
        <div className="md:col-span-2">
          <InputField id="logoUrl" label={t('settings.logoUrl')} type="url" value={data.logoUrl} onChange={onChange} placeholder={t('settings.placeholderUrl')} />
        </div>
        <InputField id="twitterUrl" label={t('settings.twitterUrl')} type="url" value={data.twitterUrl} onChange={onChange} />
        <InputField id="linkedInUrl" label={t('settings.linkedInUrl')} type="url" value={data.linkedInUrl} onChange={onChange} />
      </SettingsSection>
    </div>
  );
}
