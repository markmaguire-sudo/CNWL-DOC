import React from 'react';
import { 
  PhoneCall, 
  Calendar, 
  AlertOctagon, 
  BookOpen, 
  Bot, 
  Lock, 
  ShieldCheck,
  Clock,
  Users
} from 'lucide-react';

export type TabType = 'active' | 'directories' | 'full' | 'incidents' | 'protocols' | 'ai';

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
            <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium hidden sm:inline-block">
              EPRR Directory
            </span>

            {isAuthenticated ? (
              <button
                onClick={onLockSession}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors text-xs font-medium"
                title="Lock Director Session"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden xs:inline">Authenticated</span>
                <Lock className="w-3 h-3 text-slate-400" />
              </button>
            ) : (
              <span className="bg-red-950/60 text-red-400 border border-red-800/60 px-2.5 py-1 rounded-lg flex items-center gap-1 text-xs font-semibold">
                <Lock className="w-3.5 h-3.5" />
                Locked
              </span>
            )}
          </div>
        </div>

        {/* Main App Title */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-sm shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Director on Call
                <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 font-mono font-semibold px-2 py-0.5 rounded-full">
                  Info Resource
                </span>
              </h1>
              <p className="text-xs text-slate-500">
                On-Call Directory, Escalation Protocols & METHANE Guide
              </p>
            </div>
          </div>

          {/* Current Active Rota Period Indicator */}
          <div className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs flex items-center gap-2 text-slate-700 shrink-0 self-start sm:self-auto">
            <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <span className="text-slate-500 text-[10px] block uppercase tracking-wider font-semibold">
                Current Rota Shift
              </span>
              <span className="font-semibold text-slate-900">
                Fri 31/07/2026 – Tue 04/08/2026
              </span>
            </div>
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

          <button
            onClick={() => onSelectTab('directories')}
            className={`px-3.5 py-2.5 rounded-t-lg text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors border-b-2 min-h-[40px] ${
              activeTab === 'directories'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-600 font-bold'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Gold & Silver Directories</span>
          </button>

          <button
            onClick={() => onSelectTab('full')}
            className={`px-3.5 py-2.5 rounded-t-lg text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors border-b-2 min-h-[40px] ${
              activeTab === 'full'
                ? 'bg-slate-100 text-blue-700 border-blue-600 font-bold'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Full Rota Schedule</span>
          </button>

          <button
            onClick={() => onSelectTab('incidents')}
            className={`px-3.5 py-2.5 rounded-t-lg text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors border-b-2 min-h-[40px] ${
              activeTab === 'incidents'
                ? 'bg-amber-50 text-amber-800 border-amber-600 font-bold'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-50'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Incident Log & METHANE</span>
          </button>

          <button
            onClick={() => onSelectTab('protocols')}
            className={`px-3.5 py-2.5 rounded-t-lg text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors border-b-2 min-h-[40px] ${
              activeTab === 'protocols'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-600 font-bold'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Escalation Protocols</span>
          </button>

          <button
            onClick={() => onSelectTab('ai')}
            className={`px-3.5 py-2.5 rounded-t-lg text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors border-b-2 min-h-[40px] ${
              activeTab === 'ai'
                ? 'bg-purple-50 text-purple-800 border-purple-600 font-bold'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-50'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Executive Advisor</span>
          </button>
        </nav>
      </header>

      {/* Mobile Sticky Bottom Tab Bar (Mobile-First Ergonomics) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-50 py-1.5 px-2 flex justify-around items-center shadow-lg">
        <button
          onClick={() => onSelectTab('active')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors min-h-[44px] min-w-[56px] justify-center ${
            activeTab === 'active' ? 'text-blue-600 bg-blue-50 font-bold' : 'text-slate-600'
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          <span>On Call</span>
        </button>

        <button
          onClick={() => onSelectTab('directories')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors min-h-[44px] min-w-[56px] justify-center ${
            activeTab === 'directories' ? 'text-emerald-600 bg-emerald-50 font-bold' : 'text-slate-600'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Gold/Silver</span>
        </button>

        <button
          onClick={() => onSelectTab('full')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors min-h-[44px] min-w-[56px] justify-center ${
            activeTab === 'full' ? 'text-blue-600 bg-blue-50 font-bold' : 'text-slate-600'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Rota</span>
        </button>

        <button
          onClick={() => onSelectTab('incidents')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors min-h-[44px] min-w-[56px] justify-center ${
            activeTab === 'incidents' ? 'text-amber-600 bg-amber-50 font-bold' : 'text-slate-600'
          }`}
        >
          <AlertOctagon className="w-4 h-4" />
          <span>Incidents</span>
        </button>

        <button
          onClick={() => onSelectTab('protocols')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors min-h-[44px] min-w-[56px] justify-center ${
            activeTab === 'protocols' ? 'text-emerald-600 bg-emerald-50 font-bold' : 'text-slate-600'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Protocols</span>
        </button>

        <button
          onClick={() => onSelectTab('ai')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors min-h-[44px] min-w-[56px] justify-center ${
            activeTab === 'ai' ? 'text-purple-600 bg-purple-50 font-bold' : 'text-slate-600'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>AI Advisor</span>
        </button>
      </div>
    </>
  );
};
