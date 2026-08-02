import React, { useState } from 'react';
import { OnCallRoleInfo, RotaPeriod } from '../types';
import { GroupedRotaTable } from './GroupedRotaTable';
import { 
  Phone, 
  MessageSquare, 
  Copy, 
  Check, 
  ShieldAlert, 
  Search, 
  Send,
  User,
  Clock,
  ChevronRight,
  ExternalLink,
  Sparkles,
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

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRole(id);
    setTimeout(() => setCopiedRole(null), 2000);
  };

  // Helper to find officer name for a role in current period
  const getOfficerName = (roleId: string) => {
    const assignment = currentPeriod?.assignments.find(a => a.roleCategory === roleId);
    return assignment ? assignment.personName : 'On Call Officer';
  };

  const filteredRoles = roles.filter(role => {
    const officer = getOfficerName(role.id).toLowerCase();
    const roleTitle = role.title.toLowerCase();
    const search = searchTerm.toLowerCase();
    return officer.includes(search) || roleTitle.includes(search) || role.shortCode.toLowerCase().includes(search);
  });

  // Group roles by Heading Category
  const mentalHealthRoles = filteredRoles.filter(r => r.group === 'Mental Health');
  const communityRoles = filteredRoles.filter(r => r.group === 'Community');
  const docRoles = filteredRoles.filter(r => r.group === 'Director on Call' || (!r.group && r.id === 'DoC'));

  const renderRoleCard = (role: OnCallRoleInfo) => {
    const officerName = getOfficerName(role.id);
    const isCopied = copiedRole === role.id;

    return (
      <div
        key={role.id}
        className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-4 flex flex-col justify-between shadow-xs transition-all hover:shadow-md relative overflow-hidden group"
      >
        <div className="space-y-3">
          {/* Role Tag & Badge */}
          <div className="flex items-center justify-between gap-2">
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md tracking-wide ${role.color}`}>
              {role.shortCode}
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded font-mono font-medium">
              24/7 Cover
            </span>
          </div>

          {/* Role Title & Description */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {role.title}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
              {role.description}
            </p>
          </div>

          {/* Officer Name Card */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center font-bold text-sm shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">
                Duty Officer On Call
              </span>
              <span className="text-sm font-extrabold text-slate-900 truncate block">
                {officerName}
              </span>
            </div>
          </div>

          {/* Dedicated Phone Line Display */}
          <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200/80 flex items-center justify-between font-mono text-xs">
            <span className="text-slate-500 text-[11px]">Direct Line:</span>
            {isAuthenticated ? (
              <span className="font-bold text-emerald-600 text-sm tracking-wide">
                {role.phone}
              </span>
            ) : (
              <span className="text-slate-400 tracking-widest font-bold">
                {role.phone.slice(0, 4)} ••• •••
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 mt-3 border-t border-slate-100 flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <a
                href={`tel:${role.phone.replace(/\s+/g, '')}`}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs min-h-[44px]"
                title={`Call ${officerName}`}
              >
                <Phone className="w-4 h-4" />
                <span>Call Now</span>
              </a>

              <a
                href={`sms:${role.phone.replace(/\s+/g, '')}`}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-semibold p-2.5 rounded-xl text-xs flex items-center justify-center transition-colors min-h-[44px] min-w-[44px]"
                title={`SMS ${officerName}`}
              >
                <MessageSquare className="w-4 h-4" />
              </a>

              <button
                onClick={() => handleCopy(`${officerName} (${role.title}): ${role.phone}`, role.id)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-semibold p-2.5 rounded-xl text-xs flex items-center justify-center transition-colors min-h-[44px] min-w-[44px]"
                title="Copy contact info"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
              </button>
            </>
          ) : (
            <button
              onClick={onRequestAuthenticate}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition-colors min-h-[44px]"
            >
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Unlock Call Actions</span>
            </button>
          )}
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
            <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">
              Director on Call Team - Active Shift
            </h2>
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Shift Window: <strong className="text-slate-900 font-mono">{currentPeriod.displayStart}</strong> to <strong className="text-slate-900 font-mono">{currentPeriod.displayEnd}</strong></span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateToDirectory?.('INPATIENT')}
              className="bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all min-h-[42px] shadow-xs border border-emerald-300 hover:shadow-md active:scale-95 cursor-pointer"
            >
              <Hospital className="w-4 h-4 shrink-0 text-emerald-700" />
              <span>Inpatient Sites Directory</span>
              <ChevronRight className="w-3 h-3 text-emerald-800" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Directories Shortcut Cards on Homescreen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => onNavigateToDirectory?.('INPATIENT')}
          className="bg-emerald-50 hover:bg-emerald-100/90 text-emerald-950 p-3.5 rounded-2xl border border-emerald-200 hover:border-emerald-300 shadow-xs flex items-center justify-between text-left group transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-200/80 rounded-xl text-emerald-900 border border-emerald-300 shrink-0">
              <Hospital className="w-5 h-5 text-emerald-800" />
            </div>
            <div className="min-w-0">
              <h4 className="font-extrabold text-xs text-emerald-950 group-hover:text-emerald-900 transition-colors flex items-center gap-1.5">
                <span className="truncate">Inpatient Sites</span>
                <span className="text-[9px] bg-emerald-200/80 text-emerald-900 border border-emerald-300 font-mono px-1.5 py-0.2 rounded font-semibold uppercase">50+ Contacts</span>
              </h4>
              <p className="text-[11px] text-emerald-800/80 mt-0.5 truncate">
                KCW, Brent, Harrow, Camden, Hillingdon, MK, CAMHS, Rehab & Prisons
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-1 transition-transform shrink-0 ml-1" />
        </button>

        <button
          onClick={() => onNavigateToDirectory?.('GOLD')}
          className="bg-green-50 hover:bg-green-100/90 text-green-950 p-3.5 rounded-2xl border border-green-200 hover:border-green-300 shadow-xs flex items-center justify-between text-left group transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-200/80 text-green-900 rounded-xl border border-green-300 shrink-0">
              <ShieldAlert className="w-5 h-5 text-green-800" />
            </div>
            <div className="min-w-0">
              <h4 className="font-extrabold text-xs text-green-950 group-hover:text-green-900 transition-colors">
                Director on-call list
              </h4>
              <p className="text-[11px] text-green-800/80 mt-0.5 truncate">
                Executive Directors & Escalation Contacts
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-green-700 group-hover:translate-x-1 transition-transform shrink-0 ml-1" />
        </button>

        <button
          onClick={() => onNavigateToDirectory?.('SILVER')}
          className="bg-teal-50 hover:bg-teal-100/90 text-teal-950 p-3.5 rounded-2xl border border-teal-200 hover:border-teal-300 shadow-xs flex items-center justify-between text-left group transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-200/80 text-teal-900 rounded-xl border border-teal-300 shrink-0">
              <Users className="w-5 h-5 text-teal-800" />
            </div>
            <div className="min-w-0">
              <h4 className="font-extrabold text-xs text-teal-950 group-hover:text-teal-900 transition-colors">
                Silver Command
              </h4>
              <p className="text-[11px] text-teal-800/80 mt-0.5 truncate">
                Tactical Officers & Operational Leads
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-teal-700 group-hover:translate-x-1 transition-transform shrink-0 ml-1" />
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

      {/* Search & Filter & View Mode Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search on call officers by name or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors min-h-[40px]"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
          <span className="text-xs text-slate-500 font-mono px-2 hidden md:inline">
            {filteredRoles.length} Duty Officers
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
          {/* Group 1: Mental Health Heading */}
          {mentalHealthRoles.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-blue-100 text-blue-800 rounded-lg font-bold text-xs border border-blue-200">
                    🧠
                  </span>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
                      Mental Health On-Call Staff
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Ldn-SNoC (Senior Nurse), MK-MoC (Milton Keynes Manager) & MH-SMoC (Senior Manager)
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {mentalHealthRoles.length} Roles
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                {mentalHealthRoles.map(renderRoleCard)}
              </div>
            </div>
          )}

          {/* Group 2: Community Heading */}
          {communityRoles.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-sky-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-sky-100 text-sky-800 rounded-lg font-bold text-xs border border-sky-200">
                    🏡
                  </span>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
                      Community On-Call Staff
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Com-SMoC (Senior Operational Manager for Community Services & Urgent Care)
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold bg-sky-50 text-sky-800 px-2.5 py-0.5 rounded-full border border-sky-200">
                  {communityRoles.length} Role
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                {communityRoles.map(renderRoleCard)}
              </div>
            </div>
          )}

          {/* Group 3: Director on Call (DoC) Heading */}
          {docRoles.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg font-bold text-xs border border-emerald-200">
                    🎖️
                  </span>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
                      Director on Call (DoC)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Executive Lead for Trust-Wide On-Call & Major Incident Command
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {docRoles.length} Role
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                {docRoles.map(renderRoleCard)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
