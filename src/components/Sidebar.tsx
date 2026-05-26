import React from 'react';
import { 
  LayoutDashboard, 
  UploadCloud, 
  Sparkles, 
  LogOut, 
  GraduationCap 
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mockTestsCount: number;
  pdfFilesCount: number;
  onLogout?: () => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  mockTestsCount,
  pdfFilesCount,
  onLogout
}: SidebarProps) {
  const { profile, logout } = useAuth();

  if (!profile) return null;

  const handleLogoutAction = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: mockTestsCount > 0 ? mockTestsCount : null },
    { id: 'upload', label: 'PYQ Uploads', icon: UploadCloud, badge: pdfFilesCount > 0 ? pdfFilesCount : null },
    { id: 'ai-builder', label: 'AI Mock Builder', icon: Sparkles, badge: 'AI', isSparkle: true },
  ];

  return (
    <aside id="app-sidebar" className="w-64 border-r border-[#1F1F1F] bg-[#0C0C0C] flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none">
      <div className="flex flex-col flex-1 py-6 px-4 gap-8">
        {/* Branding Title */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <GraduationCap className="w-5 h-5 text-black stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-sans font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              InstaMocks
            </h1>
            <p className="font-mono text-[10px] text-[#555] tracking-widest uppercase font-bold">Academic Engine</p>
          </div>
        </div>

        {/* Navigation Modules */}
        <nav className="flex flex-col gap-1.5 flex-1">
          <div className="px-2 pb-2">
            <span className="font-mono text-[10px] text-[#555] font-bold tracking-widest uppercase">Navigation</span>
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || 
              (item.id === 'dashboard' && activeTab === 'results');

            return (
              <button
                key={item.id}
                id={`sidebar-link-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full py-2.5 px-3 rounded-md flex items-center justify-between text-left text-sm transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-[#1A1A1A] text-white font-medium border border-[#222] shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                     : 'text-[#888] hover:text-white hover:bg-[#111] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform duration-300 ${
                    item.isSparkle ? 'text-amber-500' : isActive ? 'text-white' : 'text-[#555] group-hover:text-white'
                  }`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    item.isSparkle
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-[#222] text-[#888]'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <motion.div 
                    layoutId="active-nav-indicator" 
                    className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-white rounded"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Workspace Footer Info & User Control */}
      <div className="p-4 border-t border-[#1F1F1F] bg-[#0A0A0A] flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <img 
              src={profile.profilePhoto} 
              alt={profile.name}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full border border-[#222] object-cover shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="font-sans text-xs font-semibold text-[#CCC] truncate">
                {profile.name}
              </span>
              <span className="font-mono text-[9px] text-[#555] truncate font-semibold">
                {profile.email}
              </span>
            </div>
          </div>
          <button
            id="sidebar-logout-btn"
            onClick={handleLogoutAction}
            title="Sign Out"
            className="p-2 rounded-lg text-[#555] hover:text-white hover:bg-[#1A1A1A] transition-colors duration-200 shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 bg-gradient-to-br from-[#111] to-[#0A0A0A] border border-[#1F1F1F] rounded-xl">
          <p className="text-[11px] text-[#555] uppercase tracking-widest mb-1 font-bold">Free Plan</p>
          <p className="text-xs text-[#888] mb-3 leading-relaxed">Syllabus mock compiler active</p>
          <div className="w-full text-center py-1.5 bg-[#1A1A1A] border border-[#222] text-xs text-white font-bold rounded">
            Verified Sessions
          </div>
        </div>
      </div>
    </aside>
  );
}
