import React, { useState } from 'react';
import { OnCallRoleInfo, RotaPeriod } from '../types';
import { GroupedRotaTable } from './GroupedRotaTable';
import { 
  Calendar, 
  Search, 
  Plus, 
  User, 
  Phone, 
  Clock, 
  CheckCircle2, 
  Download, 
  Edit3, 
  Filter,
  X,
  Table,
  LayoutGrid
} from 'lucide-react';

interface FullRotaTabProps {
  roles: OnCallRoleInfo[];
  rotaPeriods: RotaPeriod[];
  isAuthenticated: boolean;
  onUpdatePeriods: (updated: RotaPeriod[]) => void;
  onRequestAuthenticate: () => void;
}

export const FullRotaTab: React.FC<FullRotaTabProps> = ({
  roles,
  rotaPeriods,
  isAuthenticated,
  onUpdatePeriods,
  onRequestAuthenticate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('all');
  const [editingPeriod, setEditingPeriod] = useState<RotaPeriod | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'TABLE' | 'CARDS'>('TABLE');

  // New shift form state
  const [newStart, setNewStart] = useState('');
  const [newEnd, setNewEnd] = useState('');
  const [newAssignments, setNewAssignments] = useState<Record<string, string>>({
    DoC: '',
    Ldn_SNoC: '',
    MK_MoC: '',
    MH_SMoC: '',
    Com_SMoC: '',
  });

  const getRoleTitle = (roleId: string) => {
    const r = roles.find(item => item.id === roleId);
    return r ? r.shortCode : roleId;
  };

  const getRolePhone = (roleId: string) => {
    const r = roles.find(item => item.id === roleId);
    return r ? r.phone : '';
  };

  // Filter periods
  const filteredPeriods = rotaPeriods.filter(period => {
    if (selectedPeriodId !== 'all' && period.id !== selectedPeriodId) {
      return false;
    }

    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();
    const matchesDates = period.displayStart.toLowerCase().includes(term) || period.displayEnd.toLowerCase().includes(term);
    const matchesPerson = period.assignments.some(a => 
      a.personName.toLowerCase().includes(term) || a.roleCategory.toLowerCase().includes(term)
    );

    return matchesDates || matchesPerson;
  });

  const handleCreateShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStart || !newEnd) return;

    const created: RotaPeriod = {
      id: `period-custom-${Date.now()}`,
      startDate: newStart,
      endDate: newEnd,
      displayStart: newStart,
      displayEnd: newEnd,
      assignments: Object.entries(newAssignments).map(([roleCategory, personName]) => ({
        roleCategory: roleCategory as any,
        personName: String(personName || 'TBC')
      }))
    };

    onUpdatePeriods([...rotaPeriods, created]);
    setShowAddModal(false);
    setNewStart('');
    setNewEnd('');
  };

  const handleExportCSV = () => {
    let csv = "Period Start,Period End,Role,Duty Officer,Contact Phone\n";
    rotaPeriods.forEach(p => {
      p.assignments.forEach(a => {
        csv += `"${p.displayStart}","${p.displayEnd}","${a.roleCategory}","${a.personName}","${getRolePhone(a.roleCategory)}"\n`;
      });
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CNWL_Director_On_Call_Rota_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            CNWL Master On Call Rota Schedule
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Full rota matrix covering Mental Health, Community, London Senior Nursing & Milton Keynes
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('TABLE')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 min-h-[38px] ${
                viewMode === 'TABLE'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Grouped Rota Table</span>
            </button>

            <button
              onClick={() => setViewMode('CARDS')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 min-h-[38px] ${
                viewMode === 'CARDS'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Period Cards</span>
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => isAuthenticated ? setShowAddModal(true) : onRequestAuthenticate()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Rota Period</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search officer name (e.g. Mark Maguire, Lucy Cooper, Gemma Brown, Luis Gracia)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors shadow-xs min-h-[44px]"
          />
        </div>

        <div className="relative">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <select
            value={selectedPeriodId}
            onChange={(e) => setSelectedPeriodId(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 appearance-none shadow-xs min-h-[44px]"
          >
            <option value="all">All Rota Periods</option>
            {rotaPeriods.map(p => (
              <option key={p.id} value={p.id}>
                {p.displayStart} – {p.displayEnd}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Rota Content */}
      {viewMode === 'TABLE' ? (
        <GroupedRotaTable
          roles={roles}
          rotaPeriods={filteredPeriods}
          isAuthenticated={isAuthenticated}
          searchTerm={searchTerm}
        />
      ) : (
      <div className="space-y-4 sm:space-y-6">
        {filteredPeriods.map((period) => {
          const todayStr = new Date().toISOString().slice(0, 10);
          const isCurrentActive = period.startDate <= todayStr && period.endDate >= todayStr;

          return (
            <div
              key={period.id}
              className={`bg-white rounded-2xl border transition-all shadow-xs overflow-hidden ${
                isCurrentActive
                  ? 'border-blue-500 ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Period Header */}
              <div className={`p-4 border-b flex flex-wrap items-center justify-between gap-3 ${
                isCurrentActive ? 'bg-blue-50/70 border-blue-200' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${isCurrentActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-extrabold text-slate-900">
                        {period.displayStart} — {period.displayEnd}
                      </h3>
                      {isCurrentActive && (
                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ACTIVE SHIFT
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      CNWL Director on Call Rota Roster
                    </p>
                  </div>
                </div>

                <div className="text-xs text-slate-500 font-mono">
                  {period.assignments.length} Assigned Roles
                </div>
              </div>

              {/* Mobile Card List View (For small screens) */}
              <div className="block sm:hidden divide-y divide-slate-100 p-2">
                {period.assignments.map((assignment, idx) => {
                  const roleObj = roles.find(r => r.id === assignment.roleCategory);
                  const isHighlightedName = searchTerm && assignment.personName.toLowerCase().includes(searchTerm.toLowerCase());

                  return (
                    <div key={idx} className={`p-3 space-y-2 rounded-xl ${isHighlightedName ? 'bg-blue-50/50' : ''}`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${roleObj?.color || 'bg-slate-100 text-slate-700'}`}>
                          {roleObj?.shortCode || assignment.roleCategory}
                        </span>
                        {assignment.startDate && assignment.endDate ? (
                          <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                            {assignment.startDate} – {assignment.endDate}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono">Full Shift</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className={`text-xs font-bold ${isHighlightedName ? 'text-blue-700 underline' : 'text-slate-900'}`}>
                            {assignment.personName}
                          </span>
                        </div>

                        <div className="font-mono text-xs font-bold text-emerald-700">
                          {isAuthenticated ? (
                            <span>{getRolePhone(assignment.roleCategory)}</span>
                          ) : (
                            <span className="text-slate-400 font-normal">🔒 Masked</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Assignments Table (For tablet and desktop screens) */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4">Role Title</th>
                      <th className="py-2.5 px-4">Duty Officer On Call</th>
                      <th className="py-2.5 px-4">Sub-Dates / Range</th>
                      <th className="py-2.5 px-4 text-right">Dedicated Phone Line</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {period.assignments.map((assignment, idx) => {
                      const roleObj = roles.find(r => r.id === assignment.roleCategory);
                      const isHighlightedName = searchTerm && assignment.personName.toLowerCase().includes(searchTerm.toLowerCase());

                      return (
                        <tr
                          key={idx}
                          className={`hover:bg-slate-50 transition-colors ${
                            isHighlightedName ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <td className="py-3 px-4 font-semibold">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${roleObj?.color || 'bg-slate-100 text-slate-700'}`}>
                                {roleObj?.shortCode || assignment.roleCategory}
                              </span>
                              <span className="text-slate-600 text-xs hidden lg:inline">
                                {roleObj?.title}
                              </span>
                            </div>
                          </td>

                          <td className="py-3 px-4 font-bold text-slate-900">
                            <div className="flex items-center gap-2">
                              <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              <span className={isHighlightedName ? 'text-blue-700 underline font-extrabold' : ''}>
                                {assignment.personName}
                              </span>
                            </div>
                          </td>

                          <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                            {assignment.startDate && assignment.endDate ? (
                              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                                {assignment.startDate} – {assignment.endDate}
                              </span>
                            ) : (
                              <span className="text-slate-400">Full Period</span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                            {isAuthenticated ? (
                              <span>{getRolePhone(assignment.roleCategory)}</span>
                            ) : (
                              <span className="text-slate-400 font-normal">🔒 Masked</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Add Shift Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 max-w-lg w-full text-slate-900 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">Add Custom Rota Period</h3>
            <p className="text-xs text-slate-500 mb-4">Define dates and assign duty officers for each key role.</p>

            <form onSubmit={handleCreateShift} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Start Date / Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Fri 07/08/2026"
                    value={newStart}
                    onChange={(e) => setNewStart(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 min-h-[40px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">End Date / Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Mon 10/08/2026"
                    value={newEnd}
                    onChange={(e) => setNewEnd(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 min-h-[40px]"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-slate-800 font-bold">Assign Officers:</label>
                {roles.map((role) => (
                  <div key={role.id} className="flex items-center gap-2">
                    <span className="w-24 text-slate-600 text-[11px] font-mono shrink-0">{role.shortCode}:</span>
                    <input
                      type="text"
                      placeholder={`Officer name for ${role.shortCode}`}
                      value={newAssignments[role.id] || ''}
                      onChange={(e) => setNewAssignments({ ...newAssignments, [role.id]: e.target.value })}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 min-h-[38px]"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-xs min-h-[44px]"
                >
                  Save Rota Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
