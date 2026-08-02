import React, { useState } from 'react';
import { OnCallRoleInfo, RotaPeriod } from '../types';
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
  Sparkles
} from 'lucide-react';

interface CurrentOnCallTabProps {
  roles: OnCallRoleInfo[];
  rotaPeriods: RotaPeriod[];
  isAuthenticated: boolean;
  onRequestAuthenticate: () => void;
}

export const CurrentOnCallTab: React.FC<CurrentOnCallTabProps> = ({
  roles,
  rotaPeriods,
  isAuthenticated,
  onRequestAuthenticate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedRole, setCopiedRole] = useState<string | null>(null);

  // Active period for system date (2026-08-02 is in period-4a: 31/07/2026 – 03/08/2026)
  const currentPeriod = rotaPeriods.find(p => p.id === 'period-4a') || rotaPeriods[4] || rotaPeriods[0];

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

          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-slate-100 border border-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>Information & Contact Directory</span>
            </div>
          </div>
        </div>
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

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search on call officers by name or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors min-h-[40px]"
          />
        </div>
        <div className="text-xs text-slate-500 font-mono px-2 shrink-0">
          {filteredRoles.length} Officers
        </div>
      </div>

      {/* Rota Officers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredRoles.map((role) => {
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

              {/* Action Buttons - Touch Target Optimized */}
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
        })}
      </div>
    </div>
  );
};
