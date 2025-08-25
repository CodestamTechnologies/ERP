import { Metadata } from 'next';
import Sidebar from '@/components/layout/Sidebar';
import RightStickyPanel from '@/components/layout/RightStickyPanel';

export const metadata: Metadata = {
  title: 'Suppliers - Codestam ERP',
  description: 'Supplier management and procurement',
};

export default function SuppliersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Right Sticky Panel */}
      <RightStickyPanel />
    </div>
  );
}