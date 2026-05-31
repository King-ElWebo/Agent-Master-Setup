import React from 'react';
import { prisma } from '@/lib/prisma';
import { DashboardCockpitClient } from '@/components/admin/DashboardCockpitClient';
import { ActivityLog } from '@/components/admin/ActivityLogTable';

export const dynamic = 'force-dynamic';

function formatTimestamp(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

interface CombinedLog {
  id: string;
  action: string;
  entity: string;
  timestamp: string;
  user: string;
  rawDate: Date;
}

export default async function AdminDashboard() {
  const [activeItemsCount, activeFaqsCount] = await Promise.all([
    prisma.collectionItem.count(),
    prisma.faq.count({ where: { isActive: true } }),
  ]);

  // Fetch the latest 5 entries from operational tables for mapping activity logs
  const [latestItems, latestCategories, latestFaqs] = await Promise.all([
    prisma.collectionItem.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.category.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.faq.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' },
    }),
  ]);

  const combinedLogs: CombinedLog[] = [];

  latestItems.forEach((item) => {
    const isUpdate = item.updatedAt.getTime() - item.createdAt.getTime() > 1000;
    combinedLogs.push({
      id: `item-${item.id}`,
      action: isUpdate ? 'UPDATE' : 'CREATE',
      entity: `Item: ${item.title}`,
      timestamp: formatTimestamp(item.updatedAt),
      user: 'Admin',
      rawDate: item.updatedAt,
    });
  });

  latestCategories.forEach((cat) => {
    const isUpdate = cat.updatedAt.getTime() - cat.createdAt.getTime() > 1000;
    combinedLogs.push({
      id: `cat-${cat.id}`,
      action: isUpdate ? 'UPDATE' : 'CREATE',
      entity: `Category: ${cat.name}`,
      timestamp: formatTimestamp(cat.updatedAt),
      user: 'Admin',
      rawDate: cat.updatedAt,
    });
  });

  latestFaqs.forEach((faq) => {
    const isUpdate = faq.updatedAt.getTime() - faq.createdAt.getTime() > 1000;
    combinedLogs.push({
      id: `faq-${faq.id}`,
      action: isUpdate ? 'UPDATE' : 'CREATE',
      entity: `FAQ: ${faq.question}`,
      timestamp: formatTimestamp(faq.updatedAt),
      user: 'Admin',
      rawDate: faq.updatedAt,
    });
  });

  // Sort descending and take top 5
  const sortedLogs: ActivityLog[] = combinedLogs
    .sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime())
    .slice(0, 5)
    .map(({ id, action, entity, timestamp, user }) => ({
      id,
      action,
      entity,
      timestamp,
      user,
    }));

  return (
    <DashboardCockpitClient
      activeItemsCount={activeItemsCount}
      activeFaqsCount={activeFaqsCount}
      logs={sortedLogs}
    />
  );
}
