import React from 'react';
import { OnCallRoleInfo, RotaPeriod } from '../types';
import { Calendar, Phone, CheckCircle2 } from 'lucide-react';

interface GroupedRotaTableProps {
  roles: OnCallRoleInfo[];
  rotaPeriods: RotaPeriod[];
  isAuthenticated: boolean;
  searchTerm?: string;
  highlightCurrentPeriodOnly?: boolean;
}

function formatPhoneDisplay(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0800')) {
    let cleanDigits = digits;
    if (cleanDigits.length === 11 && cleanDigits[4] === '0') {
      cleanDigits = cleanDigits.slice(0, 4) + cleanDigits.slice(5);
    }
    if (cleanDigits.length >= 10) {
      return `0800 ${cleanDigits.slice(4, 7)} ${cleanDigits.slice(7, 10)}`;
    }
  }
  return phone;
}

export const GroupedRotaTable: React.FC<GroupedRotaTableProps> = ({
  roles,
  rotaPeriods,
  isAuthenticated,
  searchTerm = '',
  highlightCurrentPeriodOnly = false,
}) => {
  const todayStr = new Date().toISOString().slice(0, 10);

  // Helper to find phone number for a role
  const getRolePhone = (roleId: string) => {
    const r = roles.find((item) => item.id === roleId);
    return r ? formatPhoneDisplay(r.phone) : '';
  };

  // Filter periods by search term
  const filteredPeriods = rotaPeriods.filter((period) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      period.displayStart.toLowerCase().includes(term) ||
      period.displayEnd.toLowerCase().includes(term)
    );
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Header Banner */}
      <div className="bg-slate-900 text-white p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-white">
              CNWL On Call Rota Master Matrix
            </h3>
            <p className="text-[11px] text-slate-300">
              Grouped by Service Division: Mental Health, Community & Director on Call (DoC)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{filteredPeriods.length} Rota Periods</span>
        </div>
      </div>

      {/* Overflow wrapper for desktop & tablet table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[900px]">
          <thead>
            {/* ROW 1: Service Groupings Header */}
            <tr className="border-b border-slate-300 font-extrabold uppercase tracking-wider text-center text-xs">
              <th
                rowSpan={2}
                className="bg-slate-800 text-white p-3 border-r border-slate-700 w-28 text-left"
              >
                Start
              </th>
              <th
                rowSpan={2}
                className="bg-slate-800 text-white p-3 border-r border-slate-700 w-28 text-left"
              >
                End
              </th>

              {/* Mental Health Header Group */}
              <th
                colSpan={3}
                className="bg-blue-900 text-blue-100 py-2.5 px-4 border-r border-blue-800 text-center text-xs font-black tracking-wide"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>🧠 MENTAL HEALTH</span>
                </div>
              </th>

              {/* Community Header Group */}
              <th
                colSpan={1}
                className="bg-sky-800 text-sky-100 py-2.5 px-4 border-r border-sky-700 text-center text-xs font-black tracking-wide"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>🏡 COMMUNITY</span>
                </div>
              </th>

              {/* DoC Header Group */}
              <th
                colSpan={1}
                className="bg-emerald-950 text-emerald-200 py-2.5 px-4 text-center text-xs font-black tracking-wide"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>🎖️ DoC</span>
                </div>
              </th>
            </tr>

            {/* ROW 2: Specific Role Columns */}
            <tr className="border-b border-slate-300 text-white font-bold text-[11px] text-center">
              {/* Ldn-SNoC */}
              <th className="bg-blue-600 p-2.5 border-r border-blue-500 w-1/5 text-left">
                <div className="font-extrabold text-xs">Ldn-SNoC</div>
                <div className="text-[10px] font-normal opacity-90 leading-tight">
                  Senior Nurse for CNWL London
                </div>
                <div className="font-mono text-[11px] text-blue-100 font-bold mt-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>{getRolePhone('Ldn_SNoC')}</span>
                </div>
              </th>

              {/* MK-MoC */}
              <th className="bg-rose-700 p-2.5 border-r border-rose-600 w-1/5 text-left">
                <div className="font-extrabold text-xs">MK-MoC</div>
                <div className="text-[10px] font-normal opacity-90 leading-tight">
                  Manager for CNWL Milton Keynes
                </div>
                <div className="font-mono text-[11px] text-rose-100 font-bold mt-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>{getRolePhone('MK_MoC')}</span>
                </div>
              </th>

              {/* MH-SMoC */}
              <th className="bg-amber-600 p-2.5 border-r border-amber-500 w-1/5 text-left">
                <div className="font-extrabold text-xs">MH-SMoC</div>
                <div className="text-[10px] font-normal opacity-90 leading-tight">
                  Senior Manager Mental Health
                </div>
                <div className="font-mono text-[11px] text-amber-100 font-bold mt-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>{getRolePhone('MH_SMoC')}</span>
                </div>
              </th>

              {/* Com-SMoC */}
              <th className="bg-sky-600 p-2.5 border-r border-sky-500 w-1/5 text-left">
                <div className="font-extrabold text-xs">Com-SMoC</div>
                <div className="text-[10px] font-normal opacity-90 leading-tight">
                  Senior Manager Community
                </div>
                <div className="font-mono text-[11px] text-sky-100 font-bold mt-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>{getRolePhone('Com_SMoC')}</span>
                </div>
              </th>

              {/* DoC */}
              <th className="bg-emerald-900 p-2.5 w-1/5 text-left">
                <div className="font-extrabold text-xs">DoC</div>
                <div className="text-[10px] font-normal opacity-90 leading-tight">
                  Director for CNWL
                </div>
                <div className="font-mono text-[11px] text-emerald-100 font-bold mt-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>{getRolePhone('DoC')}</span>
                </div>
              </th>
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody className="divide-y divide-slate-200 text-slate-900 text-xs font-medium">
            {filteredPeriods.map((period) => {
              const isCurrentActive =
                period.startDate <= todayStr && period.endDate >= todayStr;

              return (
                <tr
                  key={period.id}
                  className={`transition-colors ${
                    isCurrentActive
                      ? 'bg-blue-50/80 font-bold border-l-4 border-l-blue-600'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Start Date */}
                  <td className="p-3 font-mono font-bold text-slate-900 border-r border-slate-200 align-top">
                    <div className="flex flex-col gap-1">
                      <span>{period.displayStart}</span>
                      {isCurrentActive && (
                        <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-sans px-1.5 py-0.5 rounded-full w-max">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          ACTIVE
                        </span>
                      )}
                    </div>
                  </td>

                  {/* End Date */}
                  <td className="p-3 font-mono font-bold text-slate-900 border-r border-slate-200 align-top">
                    {period.displayEnd}
                  </td>

                  {/* Ldn-SNoC */}
                  <td className="p-3 border-r border-slate-200 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="font-extrabold text-slate-900">Ldn-SNoC On Call</span>
                      <a
                        href={`tel:${getRolePhone('Ldn_SNoC').replace(/\s+/g, '')}`}
                        className="font-mono text-blue-700 font-bold hover:underline flex items-center gap-1.5"
                      >
                        <Phone className="w-3 h-3 text-blue-600 shrink-0" />
                        <span>{getRolePhone('Ldn_SNoC')}</span>
                      </a>
                    </div>
                  </td>

                  {/* MK-MoC */}
                  <td className="p-3 border-r border-slate-200 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="font-extrabold text-slate-900">MK-MoC On Call</span>
                      <a
                        href={`tel:${getRolePhone('MK_MoC').replace(/\s+/g, '')}`}
                        className="font-mono text-rose-700 font-bold hover:underline flex items-center gap-1.5"
                      >
                        <Phone className="w-3 h-3 text-rose-600 shrink-0" />
                        <span>{getRolePhone('MK_MoC')}</span>
                      </a>
                    </div>
                  </td>

                  {/* MH-SMoC */}
                  <td className="p-3 border-r border-slate-200 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="font-extrabold text-slate-900">MH-SMoC On Call</span>
                      <a
                        href={`tel:${getRolePhone('MH_SMoC').replace(/\s+/g, '')}`}
                        className="font-mono text-amber-700 font-bold hover:underline flex items-center gap-1.5"
                      >
                        <Phone className="w-3 h-3 text-amber-600 shrink-0" />
                        <span>{getRolePhone('MH_SMoC')}</span>
                      </a>
                    </div>
                  </td>

                  {/* Com-SMoC */}
                  <td className="p-3 border-r border-slate-200 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="font-extrabold text-slate-900">Com-SMoC On Call</span>
                      <a
                        href={`tel:${getRolePhone('Com_SMoC').replace(/\s+/g, '')}`}
                        className="font-mono text-sky-700 font-bold hover:underline flex items-center gap-1.5"
                      >
                        <Phone className="w-3 h-3 text-sky-600 shrink-0" />
                        <span>{getRolePhone('Com_SMoC')}</span>
                      </a>
                    </div>
                  </td>

                  {/* DoC */}
                  <td className="p-3 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="font-extrabold text-slate-900">Director On Call</span>
                      <a
                        href={`tel:${getRolePhone('DoC').replace(/\s+/g, '')}`}
                        className="font-mono text-emerald-800 font-bold hover:underline flex items-center gap-1.5"
                      >
                        <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{getRolePhone('DoC')}</span>
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
