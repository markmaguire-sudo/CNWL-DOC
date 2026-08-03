import React from 'react';
import { 
  PhoneCall, 
  Bot, 
  ShieldCheck,
  Clock,
  ExternalLink
} from 'lucide-react';

export type TabType = 'active' | 'directories' | 'full' | 'ai';

interface HeaderNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  isAuthenticated: boolean;
  onLockSession: () => void;
  activeIncidentCount?: number;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  onSelectTab,
  isAuthenticated,
  onLockSession,
  activeIncidentCount,
}) => {
  const currentDateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 text-slate-900 shadow-xs">
        {/* Top Banner */}
        <div className="bg-slate-900 text-white px-3 sm:px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold tracking-wider uppercase text-[10px] sm:text-[11px] text-slate-200">
              CNWL NHS Foundation Trust
            </span>
            <span className="hidden sm:inline-block text-slate-600">|</span>
            <span className="hidden sm:flex items-center gap-1 text-slate-300">
              <Clock className="w-3 h-3 text-slate-400" />
              {currentDateStr}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://nhs.sharepoint.com/:u:/r/sites/RV3_NDEPRR/Data/Director%20On%20Call%20Folder/Director%20On%20Call%20Advice.agent?d=w75d069ef117b4649871a6c841b42dedf&csf=1&web=1&e=1nvVNr"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-500 active:scale-95 text-white px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer min-h-[32px]"
              title="Launch NHS SharePoint Copilot Bot"
            >
              <Bot className="w-3 h-3" />
              <span>NHS Copilot Bot</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-80" />
            </a>
          </div>
        </div>

        {/* Desktop & Tablet Tab Navigation */}
        <nav className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center space-x-1 overflow-x-auto no-scrollbar border-t border-slate-200 pt-1">
          <button
            onClick={() => onSelectTab('active')}
            className={`px-3.5 py-2.5 rounded-t-lg text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors border-b-2 min-h-[40px] ${
              activeTab === 'active'
                ? 'bg-slate-100 text-blue-700 border-blue-600 font-bold'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-50'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>On Call Today</span>
          </button>
        </nav>
      </header>

      {/* Mobile Sticky Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-50 py-1.5 px-2 flex justify-around items-center shadow-lg">
        <button
          onClick={() => onSelectTab('active')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors min-h-[44px] min-w-[56px] justify-center ${
            activeTab === 'active' ? 'text-blue-600 bg-blue-50 font-bold' : 'text-slate-600'
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          <span>On Call Today</span>
        </button>
      </div>
    </>
  );
};
