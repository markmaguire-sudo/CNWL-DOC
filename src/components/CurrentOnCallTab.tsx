import React, { useState } from 'react';
import { OnCallRoleInfo, RotaPeriod } from '../types';
import { GroupedRotaTable } from './GroupedRotaTable';
import { 
  Phone, 
  MessageSquare, 
  ShieldAlert, 
  Clock,
  ChevronRight,
  Hospital,
  Users,
  LayoutGrid,
  Table
} from 'lucide-react';

interface CurrentOnCallTabProps {
  roles: OnCallRoleInfo[];
  rotaPeriods: RotaPeriod[];
  isAuthenticated: boolean;
  onRequestAuthenticate: () => void;
  onNavigateToDirectory?: (level: 'GOLD' | 'SILVER' | 'INPATIENT') => void;
}

export const CurrentOnCallTab: React.FC<CurrentOnCallTabProps> = ({
  roles,
  rotaPeriods,
  isAuthenticated,
  onRequestAuthenticate,
  onNavigateToDirectory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedRole, setCopiedRole] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'CARDS' | 'TABLE'>('CARDS');

  // Active period matching current date or falling within date range
  const todayStr = new Date().toISOString().slice(0, 10);
  const currentPeriod = rotaPeriods.find(p => p.startDate <= todayStr && p.endDate >= todayStr)
    || rotaPeriods.find(p => p.id === 'period-10')
    || rotaPeriods[0];

  const activeDocAssignment = currentPeriod?.assignments?.find(a => a.roleCategory === 'DoC');
  const activeDocName = activeDocAssignment?.personName || 'Mark Maguire';
  const docRole = roles.find(r => r.id === 'DoC');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRole(id);
    setTimeout(() => setCopiedRole(null), 2000);
  };

  const filteredRoles = roles.filter(role => {
    const roleTitle = role.title.toLowerCase();
    const search = searchTerm.toLowerCase();
    return roleTitle.includes(search) || role.shortCode.toLowerCase().includes(search) || role.phone.includes(search) || role.description.toLowerCase().includes(search);
  });

  // Group roles by Heading Category
  const mentalHealthRoles = filteredRoles.filter(r => r.group === 'Mental Health' || ['Ldn_SNoC', 'MK_MoC', 'MH_SMoC'].includes(r.id));
  const communityRoles = filteredRoles.filter(r => r.group === 'Community' || r.id === 'Com_SMoC');

  const renderRoleCard = (role: OnCallRoleInfo) => {
    const isCopied = copiedRole === role.id;

    return (
      <div
        key={role.id}
        className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl sm:rounded-2xl p-2 sm:p-4 flex flex-col justify-between shadow-xs transition-all hover:shadow-md relative overflow-hidden group h-full min-w-0"
      >
        <div className="space-y-1.5 sm:space-y-3 min-w-0">
          {/* Role Tag & Badge */}
          <div className="flex items-center justify-between gap-1 flex-wrap sm:flex-nowrap">
            <span className={`text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md tracking-wide shrink-0 ${role.color}`}>
              {role.shortCode}
            </span>
            <span className="text-[9px] sm:text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1 sm:px-2 py-0.5 rounded font-mono font-semibold flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="hidden xs:inline">24/7 Cover Active</span>
              <span className="xs:hidden">24/7</span>
            </span>
          </div>

          {/* Role Title & Description */}
          <div className="min-w-0">
            <h3 className="text-[11px] sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
              {role.title}
            </h3>
            <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-tight hidden xs:block">
              {role.description}
            </p>
          </div>

          {/* Dedicated Phone Line Display */}
          <div className="bg-slate-50 rounded-lg sm:rounded-xl p-1.5 sm:p-3 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-0.5 sm:gap-2 font-mono text-[10px] sm:text-xs">
            <span className="text-slate-500 text-[9px] sm:text-[11px] font-sans font-semibold">Direct Line:</span>
            <a
              href={`tel:${role.phone.replace(/\s+/g, '')}`}
              className="font-extrabold text-emerald-700 text-[11px] sm:text-base tracking-tight sm:tracking-wide hover:underline truncate w-full sm:w-auto"
            >
              {role.phone}
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 sm:pt-4 mt-2 sm:mt-3 border-t border-slate-100 flex items-center gap-1 sm:gap-2">
          <a
            href={`tel:${role.phone.replace(/\s+/g, '')}`}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 sm:py-2.5 px-1 sm:px-3 rounded-lg sm:rounded-xl text-[10px] sm:text-xs flex items-center justify-center gap-1 transition-colors shadow-xs min-h-[34px] sm:min-h-[44px]"
            title={`Call ${role.title}`}
          >
            <Phone className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
            <span className="text-[10px] sm:text-xs">Call</span>
          </a>

          <a
            href={`sms:${role.phone.replace(/\s+/g, '')}`}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-semibold p-1 sm:p-2.5 rounded-lg sm:rounded-xl text-xs flex items-center justify-center gap-1 transition-colors min-h-[34px] sm:min-h-[44px] shrink-0"
            title={`SMS ${role.title}`}
          >
            <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-[10px] sm:text-xs">SMS Text</span>
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Active Shift Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              LIVE ON CALL ROSTER ACTIVE
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 flex flex-wrap items-center gap-2">
              <span>Director on Call</span>
              <span className="text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-3 py-0.5 rounded-xl font-bold">
                {activeDocName}
              </span>
            </h2>
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Shift Window: <strong className="text-slate-900 font-mono">{currentPeriod.displayStart}</strong> to <strong className="text-slate-900 font-mono">{currentPeriod.displayEnd}</strong></span>
            </p>
            {docRole && (
              <div className="mt-3 flex items-center gap-2 pt-2.5 border-t border-slate-100">
                <span className="text-xs text-slate-500 font-semibold">DoC Direct Line:</span>
                <a
                  href={`tel:${docRole.phone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer min-h-[36px]"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {docRole.phone}</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Directories Shortcut Cards on Homescreen */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
        <button
          onClick={() => onNavigateToDirectory?.('INPATIENT')}
          className="bg-emerald-50 hover:bg-emerald-100/90 text-emerald-950 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border border-emerald-200 hover:border-emerald-300 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between text-left group transition-all cursor-pointer min-w-0"
        >
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 w-full">
            <div className="p-1.5 sm:p-2.5 bg-emerald-200/80 rounded-lg sm:rounded-xl text-emerald-900 border border-emerald-300 shrink-0">
              <Hospital className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-emerald-800" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-extrabold text-[10px] xs:text-[11px] sm:text-xs text-emerald-950 group-hover:text-emerald-900 transition-colors truncate">
                Inpatient Sites
              </h4>
              <p className="hidden sm:block text-[11px] text-emerald-800/80 mt-0.5 truncate">
                KCW, Brent, Harrow, Camden, Hillingdon, MK, CAMHS, Rehab & Prisons
              </p>
            </div>
          </div>
          <ChevronRight className="hidden md:block w-4 h-4 text-emerald-700 group-hover:translate-x-1 transition-transform shrink-0 ml-1" />
        </button>

        <button
          onClick={() => onNavigateToDirectory?.('GOLD')}
          className="bg-green-50 hover:bg-green-100/90 text-green-950 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border border-green-200 hover:border-green-300 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between text-left group transition-all cursor-pointer min-w-0"
        >
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 w-full">
            <div className="p-1.5 sm:p-2.5 bg-green-200/80 text-green-900 rounded-lg sm:rounded-xl border border-green-300 shrink-0">
              <ShieldAlert className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-green-800" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-extrabold text-[10px] xs:text-[11px] sm:text-xs text-green-950 group-hover:text-green-900 transition-colors truncate">
                Director on-call list
              </h4>
              <p className="hidden sm:block text-[11px] text-green-800/80 mt-0.5 truncate">
                Executive Directors & Escalations
              </p>
            </div>
          </div>
          <ChevronRight className="hidden md:block w-4 h-4 text-green-700 group-hover:translate-x-1 transition-transform shrink-0 ml-1" />
        </button>

        <button
          onClick={() => onNavigateToDirectory?.('SILVER')}
          className="bg-teal-50 hover:bg-teal-100/90 text-teal-950 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border border-teal-200 hover:border-teal-300 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between text-left group transition-all cursor-pointer min-w-0"
        >
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 w-full">
            <div className="p-1.5 sm:p-2.5 bg-teal-200/80 text-teal-900 rounded-lg sm:rounded-xl border border-teal-300 shrink-0">
              <Users className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-teal-800" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-extrabold text-[10px] xs:text-[11px] sm:text-xs text-teal-950 group-hover:text-teal-900 transition-colors truncate">
                Silver Command
              </h4>
              <p className="hidden sm:block text-[11px] text-teal-800/80 mt-0.5 truncate">
                Tactical Officers & Operational Leads
              </p>
            </div>
          </div>
          <ChevronRight className="hidden md:block w-4 h-4 text-teal-700 group-hover:translate-x-1 transition-transform shrink-0 ml-1" />
        </button>
      </div>

      {/* Security Banner if Unauthenticated */}
      {!isAuthenticated && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-amber-950">Contact Details Masked</h4>
              <p className="text-xs text-amber-800 mt-0.5">
                Direct mobile lines are hidden under CNWL Data Protection Policy. Enter Director PIN to unlock full dialer actions.
              </p>
            </div>
          </div>
          <button
            onClick={onRequestAuthenticate}
            className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shrink-0 transition-colors min-h-[44px] flex items-center justify-center"
          >
            Unlock Phone Lines
          </button>
        </div>
      )}

      {/* View Mode & Active Lines Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
        <span className="text-xs text-slate-600 font-mono font-bold px-2">
          {filteredRoles.length} Active On-Call Lines
        </span>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('CARDS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 min-h-[34px] ${
                viewMode === 'CARDS'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grouped Cards</span>
            </button>

            <button
              onClick={() => setViewMode('TABLE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 min-h-[34px] ${
                viewMode === 'TABLE'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Grouped Rota Table</span>
            </button>
          </div>
        </div>

      {viewMode === 'TABLE' ? (
        <GroupedRotaTable
          roles={roles}
          rotaPeriods={rotaPeriods}
          isAuthenticated={isAuthenticated}
          searchTerm={searchTerm}
        />
      ) : (
        /* Grouped Rota Officers Cards */
        <div className="space-y-6">
          {/* Mental Health Senior Managers */}
          {mentalHealthRoles.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-blue-100 text-blue-800 rounded-lg font-bold text-xs border border-blue-200">
                    🧠
                  </span>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
                      Mental Health Senior Managers on Call
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Ldn-SNoC (Senior Nurse), MK-MoC (Milton Keynes) & MH-SMoC (Senior Manager)
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {mentalHealthRoles.length} Active Lines
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 sm:gap-3 md:gap-4 items-stretch">
                {mentalHealthRoles.map(renderRoleCard)}
              </div>
            </div>
          )}

          {/* Community Senior Manager */}
          {communityRoles.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-sky-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-sky-100 text-sky-800 rounded-lg font-bold text-xs border border-sky-200">
                    🏡
                  </span>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
                      Community Senior Manager on Call
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Com-SMoC (Senior Operational Manager for Community Services & Urgent Care)
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold bg-sky-50 text-sky-800 px-2.5 py-0.5 rounded-full border border-sky-200">
                  {communityRoles.length} Active Line
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 items-stretch">
                {communityRoles.map(renderRoleCard)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
