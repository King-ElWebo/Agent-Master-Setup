'use client';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/admin/Sidebar';

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === '/admin/login';

  if (isLogin) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#0a0a0a] text-black dark:text-brand-100 transition-colors duration-200">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#0a0a0a] text-black dark:text-brand-100 flex transition-colors duration-200">
      <Sidebar />
      <main className="flex-1 ml-72 p-12">
        {children}
      </main>
    </div>
  );
}
