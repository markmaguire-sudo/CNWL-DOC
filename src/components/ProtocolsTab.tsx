import React, { useState } from 'react';
import { EscalationPlaybook } from '../types';
import { 
  BookOpen, 
  Search, 
  CheckSquare, 
  Square, 
  AlertTriangle, 
  ShieldCheck, 
  PhoneCall, 
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';

interface ProtocolsTabProps {
  playbooks: EscalationPlaybook[];
}

export const ProtocolsTab: React.FC<ProtocolsTabProps> = ({ playbooks }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activePlaybookId, setActivePlaybookId] = useState<string>(playbooks[0]?.id || '');
  const [checkedActions, setCheckedActions] = useState<Record<string, boolean>>({});

  const toggleAction = (key: string) => {
    setCheckedActions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filteredPlaybooks = playbooks.filter(p => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return p.title.toLowerCase().includes(term) || p.category.toLowerCase().includes(term);
  });

  const selectedPlaybook = playbooks.find(p => p.id === activePlaybookId) || playbooks[0];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Playbooks Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">CNWL Escalation Protocols & Playbooks</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Standard Operating Procedures for Gold/Silver Command, EPR failure, fire evacuation & CQC notifications
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search playbooks (e.g. cyber, fire, CQC)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 transition-colors shadow-xs min-h-[44px]"
          />
        </div>
      </div>

      {/* Main Playbooks Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Playbook List Sidebar (Left 1 col) */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Emergency Protocols ({filteredPlaybooks.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
            {filteredPlaybooks.map((pb) => {
              const isSelected = pb.id === activePlaybookId;
              return (
                <button
                  key={pb.id}
                  onClick={() => setActivePlaybookId(pb.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between gap-2 min-h-[50px] ${
                    isSelected
                      ? 'bg-white text-slate-900 border-emerald-500 shadow-xs ring-2 ring-emerald-500/20'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 block mb-0.5">
                      {pb.category}
                    </span>
                    <h4 className="text-xs font-extrabold leading-snug text-slate-900">
                      {pb.title}
                    </h4>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 mt-1 transition-transform ${isSelected ? 'text-emerald-600 translate-x-1' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Playbook Content Detail (Right 2 cols) */}
        {selectedPlaybook && (
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-5">
              {/* Title & Badge */}
              <div className="border-b border-slate-100 pb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase">
                    {selectedPlaybook.category}
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-2">
                    {selectedPlaybook.title}
                  </h3>
                </div>

                <div className="bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1 rounded-lg text-xs font-mono font-semibold">
                  Threshold: {selectedPlaybook.severityThreshold}
                </div>
              </div>

              {/* Immediate Action Checklist */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                  Immediate Executive Action Checklist:
                </h4>

                <div className="space-y-2">
                  {selectedPlaybook.immediateActions.map((action, idx) => {
                    const checkKey = `${selectedPlaybook.id}-action-${idx}`;
                    const isChecked = !!checkedActions[checkKey];

                    return (
                      <div
                        key={idx}
                        onClick={() => toggleAction(checkKey)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 min-h-[44px] ${
                          isChecked
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800 line-through opacity-80'
                            : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-white'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <span className="text-xs font-medium leading-relaxed">
                          {action}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mandatory Notifications */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Mandatory Statutory & Regional Notifications:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-700 font-mono text-[11px] pl-1">
                  {selectedPlaybook.mandatoryNotifications.map((notif, idx) => (
                    <li key={idx}>{notif}</li>
                  ))}
                </ul>
              </div>

              {/* CQC Requirement Notice */}
              {selectedPlaybook.cqcRequirement && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-900 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold text-blue-950">CQC Regulation Requirement:</strong>
                    <span className="text-blue-800">{selectedPlaybook.cqcRequirement}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
