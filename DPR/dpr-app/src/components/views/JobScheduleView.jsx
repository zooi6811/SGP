import React from 'react';
import { Zap, RefreshCw } from 'lucide-react';
import SortableTable from '../ui/SortableTable';

const JobScheduleView = ({
  t, handleAutoSchedule, fetchDashboardData, isFetchingDashboard,
  scheduleTab, setScheduleTab,
  extSchedule, pendingExtrusion,
  cutSchedule, pendingCutting,
  packSchedule, pendingPacking,
  activeOrdersData, setSelectedLog, handleUrgencyChange
}) => {
  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">{t("Job Schedule & Overview")}</h2>
          <p className="text-sm font-bold text-slate-500 mt-1">Master schedule and departmental backlog</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={handleAutoSchedule} className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm font-black bg-indigo-600 text-white px-5 py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm active:scale-95">
                <Zap size={16} /> {t("Auto-Schedule Jobs")}
            </button>
            <button onClick={fetchDashboardData} disabled={isFetchingDashboard} className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm font-black bg-white border border-slate-300 px-5 py-3 rounded-xl hover:bg-slate-50 transition-colors shadow-sm active:scale-95 text-slate-700">
                <RefreshCw size={16} className={isFetchingDashboard ? 'animate-spin text-blue-500' : 'text-slate-400'} /> Refresh
            </button>
        </div>
      </div>

      {/* Departmental Tab Switcher */}
      <div className="flex flex-col sm:flex-row bg-slate-200/60 p-1.5 rounded-2xl w-full max-w-md mx-auto sm:mx-0 shadow-inner">
        {['Extrusion', 'Cutting', 'Packing'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setScheduleTab(tab)} 
            className={`flex-1 py-3 px-4 text-base font-black rounded-xl transition-all duration-300 ${scheduleTab === tab ? 'bg-white text-blue-700 shadow-md transform scale-[1.02]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'}`}
          >
            {t(tab)}
          </button>
        ))}
      </div>

      {/* Departmental Schedule View */}
      <div className="mt-4 grid grid-cols-1 gap-6 md:gap-8">
        {scheduleTab === 'Extrusion' && (
          <>
            <SortableTable 
              title={`${t("Extrusion")} - ${t("Shift Schedule")}`}
              data={extSchedule}
              rowsPerPage={6}
              onRowClick={(row) => setSelectedLog({ type: 'Job Overview', data: activeOrdersData.find(o => o.jo === row.jo) || { jo: row.jo, customer: 'Unknown', description: row.details, target: row.originalTarget, extPending: 0, cutPending: 0, packPending: 0, runDateDisplay: row.runDateDisplay, schedMachine: row.machine } })}
              columns={[
                { label: t("Run Date"), dataIndex: 'runDateMs', type: 'number', render: (_, r) => <span className="font-bold text-slate-700 whitespace-nowrap">{r.runDateDisplay}</span> },
                { label: t("Shift"), dataIndex: 'shift', type: 'string', render: v => <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${v === 'AM' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>{v}</span> },
                { label: t("Machine"), dataIndex: 'machine', type: 'string', render: v => <span className="font-black text-slate-800 bg-slate-100 px-2 py-1 rounded-md">{v}</span> },
                { label: t("Job Order"), dataIndex: 'jo', type: 'string', render: v => <span className="font-black text-blue-700 text-base">{v}</span> },
                { label: t("Details"), dataIndex: 'details', type: 'string', render: v => <span className="text-sm font-semibold text-slate-600 truncate max-w-[200px] block" title={v}>{v}</span> },
                { label: t("Shift Target"), dataIndex: 'allocatedTarget', type: 'string', render: v => <span className="font-black text-emerald-600 whitespace-nowrap">{v}</span> }
              ]}
            />
            <SortableTable 
              title={`${t("Extrusion")} - ${t("Pending Extrusion")} (Backlog)`}
              data={pendingExtrusion}
              rowsPerPage={6}
              onRowClick={(row) => setSelectedLog({ type: 'Job Overview', data: row })}
              columns={[
                { label: t("Urgency"), dataIndex: 'urgency', type: 'number', render: (v, r) => (
                    <select
                      value={v || 5}
                      onClick={e => e.stopPropagation()}
                      onChange={e => handleUrgencyChange(r.jo, parseInt(e.target.value))}
                      className={`bg-transparent outline-none cursor-pointer font-black text-xs border-b-2 pb-0.5 ${
                        v === 1 ? 'text-rose-600 border-rose-600' :
                        v === 2 ? 'text-orange-500 border-orange-500' :
                        v === 3 ? 'text-amber-500 border-amber-500' :
                        v === 4 ? 'text-blue-500 border-blue-500' :
                        v === 5 ? 'text-emerald-500 border-emerald-500' :
                        'text-slate-400 border-slate-400'
                      }`}
                    >
                      <option value={1}>1 - CRITICAL</option>
                      <option value={2}>2 - HIGH</option>
                      <option value={3}>3 - NORMAL</option>
                      <option value={4}>4 - LOW</option>
                      <option value={5}>5 - WHENEVER</option>
                      <option value={6}>6 - IGNORE</option>
                    </select>
                )},
                { label: t("Start Date"), dataIndex: 'runDateMs', type: 'number', render: (_, r) => <span className={`font-bold whitespace-nowrap ${r.runDateDisplay === t("Unscheduled") ? 'text-slate-400 italic' : 'text-blue-700'}`}>{r.runDateDisplay}</span> },
                { label: t("Job Order"), dataIndex: 'jo', type: 'string', render: (v, r) => (
                  <div className="flex flex-col min-w-[120px]">
                    <span className="font-black text-slate-900 text-base">{v}</span>
                    <span className="text-xs font-bold text-slate-500 mt-0.5 truncate max-w-[150px]" title={r.customer}>{r.customer}</span>
                  </div>
                )},
                { label: t("Details"), dataIndex: 'dimension', type: 'string', render: (v, r) => (
                  <div className="flex flex-col min-w-[150px] max-w-[200px]">
                    <span className="text-slate-800 font-bold text-sm truncate" title={r.description}>{r.description || '-'}</span>
                    <span className="inline-block mt-1.5 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-slate-200 w-fit truncate" title={v}>{v || '-'}</span>
                  </div>
                )},
                { label: t("Formula Setup"), dataIndex: 'materialsDisplay', type: 'string', render: v => <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 bg-amber-100/50 px-2.5 py-1.5 rounded-lg border border-amber-200 shadow-sm">{v}</span> },
                { label: t("Machine"), dataIndex: 'schedMachine', type: 'string', render: v => <span className="font-black text-slate-700">{v}</span> },
                { label: t("Total Target"), dataIndex: 'target', type: 'string', render: v => <span className="font-bold text-slate-600 whitespace-nowrap">{v}</span> },
                { label: t("Left to run"), dataIndex: 'extPending', type: 'number', render: v => <span className="font-black text-blue-600 text-base whitespace-nowrap">{v.toFixed(1)} kg</span> }
              ]}
            />
          </>
        )}

        {scheduleTab === 'Cutting' && (
          <>
            <SortableTable 
              title={`${t("Cutting")} - ${t("Shift Schedule")}`}
              data={cutSchedule}
              rowsPerPage={6}
              onRowClick={(row) => setSelectedLog({ type: 'Job Overview', data: activeOrdersData.find(o => o.jo === row.jo) || { jo: row.jo, customer: 'Unknown', description: row.details, target: row.originalTarget, extPending: 0, cutPending: 0, packPending: 0, runDateDisplay: row.runDateDisplay, schedMachine: row.machine } })}
              columns={[
                { label: t("Run Date"), dataIndex: 'runDateMs', type: 'number', render: (_, r) => <span className="font-bold text-slate-700 whitespace-nowrap">{r.runDateDisplay}</span> },
                { label: t("Shift"), dataIndex: 'shift', type: 'string', render: v => <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${v === 'AM' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>{v}</span> },
                { label: t("Machine"), dataIndex: 'machine', type: 'string', render: v => <span className="font-black text-slate-800 bg-slate-100 px-2 py-1 rounded-md">{v}</span> },
                { label: t("Job Order"), dataIndex: 'jo', type: 'string', render: v => <span className="font-black text-emerald-700 text-base">{v}</span> },
                { label: t("Details"), dataIndex: 'details', type: 'string', render: v => <span className="text-sm font-semibold text-slate-600 truncate max-w-[200px] block" title={v}>{v}</span> },
                { label: t("Shift Target"), dataIndex: 'allocatedTarget', type: 'string', render: v => <span className="font-black text-emerald-600 whitespace-nowrap">{v}</span> }
              ]}
            />
            <SortableTable 
              title={`${t("Cutting")} - ${t("Pending Cutting")} (Backlog)`}
              data={pendingCutting}
              rowsPerPage={6}
              onRowClick={(row) => setSelectedLog({ type: 'Job Overview', data: row })}
              columns={[
                { label: t("Urgency"), dataIndex: 'urgency', type: 'number', render: (v, r) => (
                    <select
                      value={v || 5}
                      onClick={e => e.stopPropagation()}
                      onChange={e => handleUrgencyChange(r.jo, parseInt(e.target.value))}
                      className={`bg-transparent outline-none cursor-pointer font-black text-xs border-b-2 pb-0.5 ${
                        v === 1 ? 'text-rose-600 border-rose-600' :
                        v === 2 ? 'text-orange-500 border-orange-500' :
                        v === 3 ? 'text-amber-500 border-amber-500' :
                        v === 4 ? 'text-blue-500 border-blue-500' :
                        v === 5 ? 'text-emerald-500 border-emerald-500' :
                        'text-slate-400 border-slate-400'
                      }`}
                    >
                      <option value={1}>1 - CRITICAL</option>
                      <option value={2}>2 - HIGH</option>
                      <option value={3}>3 - NORMAL</option>
                      <option value={4}>4 - LOW</option>
                      <option value={5}>5 - WHENEVER</option>
                      <option value={6}>6 - IGNORE</option>
                    </select>
                )},
                { label: t("Start Date"), dataIndex: 'runDateMs', type: 'number', render: (_, r) => <span className={`font-bold whitespace-nowrap ${r.runDateDisplay === t("Unscheduled") ? 'text-slate-400 italic' : 'text-emerald-700'}`}>{r.runDateDisplay}</span> },
                { label: t("Job Order"), dataIndex: 'jo', type: 'string', render: (v, r) => (
                  <div className="flex flex-col min-w-[120px]">
                    <span className="font-black text-slate-900 text-base">{v}</span>
                    <span className="text-xs font-bold text-slate-500 mt-0.5 truncate max-w-[150px]" title={r.customer}>{r.customer}</span>
                  </div>
                )},
                { label: t("Details"), dataIndex: 'dimension', type: 'string', render: (v, r) => (
                  <div className="flex flex-col min-w-[150px] max-w-[200px]">
                    <span className="text-slate-800 font-bold text-sm truncate" title={r.description}>{r.description || '-'}</span>
                    <span className="inline-block mt-1.5 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-slate-200 w-fit truncate" title={v}>{v || '-'}</span>
                  </div>
                )},
                { label: t("Machine"), dataIndex: 'schedMachine', type: 'string', render: v => <span className="font-black text-slate-700">{v}</span> },
                { label: t("Total Target"), dataIndex: 'target', type: 'string', render: v => <span className="font-bold text-slate-600 whitespace-nowrap">{v}</span> },
                { label: t("Available to Cut"), dataIndex: 'availableToCut', type: 'number', render: (v, r) => (
                  <span className={`font-black text-base whitespace-nowrap ${v > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>{v.toFixed(1)} kg</span> 
                )}
              ]}
            />
          </>
        )}

        {scheduleTab === 'Packing' && (
          <>
            <SortableTable 
              title={`${t("Packing")} - ${t("Shift Schedule")}`}
              data={packSchedule}
              rowsPerPage={6}
              onRowClick={(row) => setSelectedLog({ type: 'Job Overview', data: activeOrdersData.find(o => o.jo === row.jo) || { jo: row.jo, customer: 'Unknown', description: row.details, target: row.originalTarget, extPending: 0, cutPending: 0, packPending: 0, runDateDisplay: row.runDateDisplay, schedMachine: row.machine } })}
              columns={[
                { label: t("Run Date"), dataIndex: 'runDateMs', type: 'number', render: (_, r) => <span className="font-bold text-slate-700 whitespace-nowrap">{r.runDateDisplay}</span> },
                { label: t("Shift"), dataIndex: 'shift', type: 'string', render: v => <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${v === 'AM' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>{v}</span> },
                { label: t("Machine"), dataIndex: 'machine', type: 'string', render: v => <span className="font-black text-slate-800 bg-slate-100 px-2 py-1 rounded-md">{v}</span> },
                { label: t("Job Order"), dataIndex: 'jo', type: 'string', render: v => <span className="font-black text-purple-700 text-base">{v}</span> },
                { label: t("Details"), dataIndex: 'details', type: 'string', render: v => <span className="text-sm font-semibold text-slate-600 truncate max-w-[200px] block" title={v}>{v}</span> },
                { label: t("Shift Target"), dataIndex: 'allocatedTarget', type: 'string', render: v => <span className="font-black text-emerald-600 whitespace-nowrap">{v}</span> }
              ]}
            />
            <SortableTable 
              title={`${t("Packing")} - ${t("Pending Packing")} (Backlog)`}
              data={pendingPacking}
              rowsPerPage={6}
              onRowClick={(row) => setSelectedLog({ type: 'Job Overview', data: row })}
              columns={[
                { label: t("Urgency"), dataIndex: 'urgency', type: 'number', render: (v, r) => (
                    <select
                      value={v || 5}
                      onClick={e => e.stopPropagation()}
                      onChange={e => handleUrgencyChange(r.jo, parseInt(e.target.value))}
                      className={`bg-transparent outline-none cursor-pointer font-black text-xs border-b-2 pb-0.5 ${
                        v === 1 ? 'text-rose-600 border-rose-600' :
                        v === 2 ? 'text-orange-500 border-orange-500' :
                        v === 3 ? 'text-amber-500 border-amber-500' :
                        v === 4 ? 'text-blue-500 border-blue-500' :
                        v === 5 ? 'text-emerald-500 border-emerald-500' :
                        'text-slate-400 border-slate-400'
                      }`}
                    >
                      <option value={1}>1 - CRITICAL</option>
                      <option value={2}>2 - HIGH</option>
                      <option value={3}>3 - NORMAL</option>
                      <option value={4}>4 - LOW</option>
                      <option value={5}>5 - WHENEVER</option>
                      <option value={6}>6 - IGNORE</option>
                    </select>
                )},
                { label: t("Start Date"), dataIndex: 'runDateMs', type: 'number', render: (_, r) => <span className={`font-bold whitespace-nowrap ${r.runDateDisplay === t("Unscheduled") ? 'text-slate-400 italic' : 'text-purple-700'}`}>{r.runDateDisplay}</span> },
                { label: t("Job Order"), dataIndex: 'jo', type: 'string', render: (v, r) => (
                  <div className="flex flex-col min-w-[120px]">
                    <span className="font-black text-slate-900 text-base">{v}</span>
                    <span className="text-xs font-bold text-slate-500 mt-0.5 truncate max-w-[150px]" title={r.customer}>{r.customer}</span>
                  </div>
                )},
                { label: t("Details"), dataIndex: 'dimension', type: 'string', render: (v, r) => (
                  <div className="flex flex-col min-w-[150px] max-w-[200px]">
                    <span className="text-slate-800 font-bold text-sm truncate" title={r.description}>{r.description || '-'}</span>
                    <span className="inline-block mt-1.5 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-slate-200 w-fit truncate" title={v}>{v || '-'}</span>
                  </div>
                )},
                { label: t("Machine"), dataIndex: 'schedMachine', type: 'string', render: v => <span className="font-black text-slate-700">{v}</span> },
                { label: t("Total Target"), dataIndex: 'target', type: 'string', render: v => <span className="font-bold text-slate-600 whitespace-nowrap">{v}</span> },
                { label: t("Available to Pack"), dataIndex: 'availableToPack', type: 'number', render: (v, r) => (
                  <span className={`font-black text-base whitespace-nowrap ${v > 0 ? 'text-purple-600' : 'text-slate-400'}`}>{v.toFixed(1)} kg</span> 
                )}
              ]}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default JobScheduleView;