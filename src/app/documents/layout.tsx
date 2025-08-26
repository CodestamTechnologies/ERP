import { Metadata } from 'next';
import Sidebar from '@/components/layout/Sidebar';
import SecondarySidebar from '@/components/layout/SecondarySidebar';
import { reportsServicesConfig } from '@/lib/sidebar-configs/reportsConfig';

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
      <SecondarySidebar config={reportsServicesConfig} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}