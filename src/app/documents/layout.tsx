import { Metadata } from 'next';
import Sidebar from '@/components/layout/Sidebar';

export const metadata: Metadata = {
  title: 'Documents - Codestam ERP',
  description: 'Document generation and management system',
};

export default function DocumentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}