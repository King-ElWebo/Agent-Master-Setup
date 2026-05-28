import React from 'react';

export const metadata = {
  title: 'Universal CMS Starter 2026',
  description: 'Modular Next.js AI-Powered Template',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}