import Sidebar from '@/components/layout/Sidebar';
import RightStickyPanel from '@/components/layout/RightStickyPanel';

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <RightStickyPanel />
    </div>
  );
}