import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { MobileNav } from '@/components/layout/MobileNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/15 pb-20 md:pb-0">
      <Sidebar />
      <div className="flex min-h-screen flex-col md:pl-60">
        <Topbar />
        <main className="flex-1 p-4 md:p-8">{children}</main>
        <MobileNav />
      </div>
    </div>
  );
}
