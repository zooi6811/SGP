import React, { useMemo } from 'react';
import { RefreshCw, TrendingUp, Package, Box, Trash2, Layers, PackageCheck, Clock, CheckCircle, ChevronUp, ChevronDown, Flag } from 'lucide-react';
import SortableTable from '../ui/SortableTable'; // We will create this next!

const DashboardView = ({
  t, dashboardData, fetchDashboardData, isFetchingDashboard,
  analyticsDept, setAnalyticsDept, analyticsPeriod, setAnalyticsPeriod,
  currentAnalytics, trendOutput, trendConsumption, trendWastage,
  activeOrdersData, showCompleted, setShowCompleted, handleCycleStatus,
  setFlagData, setIsFlagModalOpen, setSelectedLog
}) => {
  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Operational Overview</h2>
          <p className="text-sm font-bold text-slate-500 mt-1">Real-time factory metrics and history</p>
        </div>
        <button onClick={fetchDashboardData} disabled={isFetchingDashboard} className="flex items-center justify-center gap-2 text-base font-black bg-white border border-slate-300 px-5 py-3 rounded-xl hover:bg-slate-50 transition-colors shadow-sm w-full sm:w-auto active:scale-95 text-slate-700">
          <RefreshCw size={18} className={isFetchingDashboard ? 'animate-spin text-blue-500' : 'text-slate-400'} /> Refresh Sync
        </button>
      </div>

      {/* Analytics Section */}
      <div className="bg-white p-5 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 md:mb-8 gap-5 border-b border-slate-100 pb-5 md:pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full xl:w-auto">
            <h3 className="font-black text-slate-800 flex items-center gap-2 text-lg"><TrendingUp size={22} className="text-blue-600"/> Analytics</h3>
            <div className="flex bg-slate-100 p-1.5 rounded-xl w-full sm:w-auto">
              {['Extrusion', 'Cutting', 'Packing'].map(dept => (
                <button key={dept} onClick={() => setAnalyticsDept(dept)} className={`flex-1 sm:flex-none px-4 md:px-6 py-2 md:py-2.5 text-sm font-black rounded-lg transition-all ${analyticsDept === dept ? 'bg-white shadow text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}>{t(dept)}</button>
              ))}
            </div>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-xl w-full xl:w-auto">
            {['daily', 'weekly', 'monthly', 'yearly'].map(period => (
              <button key={period} onClick={() => setAnalyticsPeriod(period)} className={`flex-1 sm:flex-none px-4 md:px-6 py-2 md:py-2.5 text-sm font-black rounded-lg capitalize transition-all ${analyticsPeriod === period ? 'bg-slate-800 shadow text-white' : 'text-slate-500 hover:text-slate-700'}`}>{period}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {/* Output Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 md:p-8 rounded-2xl border border-blue-100 relative overflow-hidden group">
            <p className="text-[11px] md:text-xs font-black text-blue-500/80 uppercase tracking-widest mb-3">Total Output</p>
            <div className="flex items-end gap-3 relative z-10">
              <p className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">{currentAnalytics.output.toFixed(0)} <span className="text-lg md:text-xl font-bold text-slate-500 tracking-normal">kg</span></p>
              {trendOutput.dir !== 'none' && (
                <span className={`flex items-center text-xs font-black mb-1.5 px-2 py-1 rounded-md ${trendOutput.dir === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {trendOutput.dir === 'up' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>} {trendOutput.val}%
                </span>
              )}
            </div>
            <Package className="absolute -right-6 -bottom-6 text-blue-500/10 transition-transform group-hover:scale-110 duration-500" size={120} />
          </div>

          {/* Dynamic Middle Card */}
          <div className={`p-6 md:p-8 rounded-2xl border relative overflow-hidden group ${analyticsDept === 'Packing' ? 'bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-100' : 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-100'}`}>
            <p className={`text-[11px] md:text-xs font-black uppercase tracking-widest mb-3 ${analyticsDept === 'Packing' ? 'text-purple-500/80' : 'text-emerald-500/80'}`}>{analyticsDept === 'Packing' ? 'Units Packed' : 'Consumption'}</p>
            <div className="flex items-end gap-3 relative z-10">
              <p className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">{analyticsDept === 'Packing' ? currentAnalytics.units : currentAnalytics.consumption.toFixed(0)} <span className="text-lg md:text-xl font-bold text-slate-500 tracking-normal">{analyticsDept === 'Packing' ? 'units' : 'kg'}</span></p>
              {analyticsDept !== 'Packing' && trendConsumption.dir !== 'none' && (
                <span className={`flex items-center text-xs font-black mb-1.5 px-2 py-1 rounded-md ${trendConsumption.dir === 'up' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {trendConsumption.dir === 'up' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>} {trendConsumption.val}%
                </span>
              )}
            </div>
            {analyticsDept === 'Packing' ? <PackageCheck className="absolute -right-6 -bottom-6 text-purple-500/10 transition-transform group-hover:scale-110 duration-500" size={120} /> : <Box className="absolute -right-6 -bottom-6 text-emerald-500/10 transition-transform group-hover:scale-110 duration-500" size={120} />}
          </div>

          {/* Dynamic Right Card (Wastage) */}
          <div className={`p-6 md:p-8 rounded-2xl border relative overflow-hidden group ${analyticsDept === 'Packing' ? 'bg-gradient-to-br from-indigo-50 to-indigo-100/50 border-indigo-100' : 'bg-gradient-to-br from-rose-50 to-rose-100/50 border-rose-100'}`}>
            <p className={`text-[11px] md:text-xs font-black uppercase tracking-widest mb-3 ${analyticsDept === 'Packing' ? 'text-indigo-500/80' : 'text-rose-500/80'}`}>{analyticsDept === 'Packing' ? 'Pallets Processed' : 'Wastage Generated'}</p>
            <div className="flex items-end gap-3 relative z-10">
              <p className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">{analyticsDept === 'Packing' ? currentAnalytics.pallets : currentAnalytics.wastage.toFixed(1)} <span className="text-lg md:text-xl font-bold text-slate-500 tracking-normal">{analyticsDept === 'Packing' ? 'plts' : 'kg'}</span></p>
              {analyticsDept !== 'Packing' && trendWastage.dir !== 'none' && (
                <span className={`flex items-center text-xs font-black mb-1.5 px-2 py-1 rounded-md ${trendWastage.dir === 'up' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {trendWastage.dir === 'up' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>} {trendWastage.val}%
                </span>
              )}
            </div>
            {analyticsDept === 'Packing' ? <Layers className="absolute -right-6 -bottom-6 text-indigo-500/10 transition-transform group-hover:scale-110 duration-500" size={120} /> : <Trash2 className="absolute -right-6 -bottom-6 text-rose-500/10 transition-transform group-hover:scale-110 duration-500" size={120} />}
          </div>
        </div>
      </div>

      {/* Live Order Tracker */}
      <div className="pb-2">
        <SortableTable 
          title="Live Order Tracker" data={activeOrdersData}
          rowsPerPage={2}
          showCompletedToggle={true}
          showCompleted={showCompleted}
          setShowCompleted={setShowCompleted}
          columns={[
            { label: 'Status', dataIndex: 'isReadyToShip', type: 'boolean', render: (v, row) => {
              const readyBalance = row.packedQty - row.dispatchedQty;
              const isSystemReady = readyBalance > 0.5;
              
              let displayStatus = "Pending";
              let statusClasses = "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200";
              let readyIcon = <Clock size={12} className="text-slate-500"/>;

              if (row.isCompleted) {
                displayStatus = "Completed";
                statusClasses = "bg-slate-200 text-slate-500 border-slate-300 hover:bg-slate-300";
                readyIcon = <CheckCircle size={12} className="fill-slate-400 text-white"/>;
              } else if (isSystemReady || row.isReadyToShip) {
                displayStatus = "Ready";
                statusClasses = "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100";
                readyIcon = <CheckCircle size={12} className="fill-emerald-200 text-emerald-600"/>;
              }

              return (
                <button 
                  onClick={(e) => { e.stopPropagation(); handleCycleStatus(row); }}
                  className={`flex items-center justify-center gap-1 px-2 py-1 rounded text-[10px] sm:text-[11px] font-black border transition-all active:scale-95 w-max shadow-sm whitespace-nowrap ${statusClasses}`}
                  title="Click to cycle status: Pending -> Ready -> Completed"
                >
                  {readyIcon} {displayStatus}
                </button>
              );
            }},
            { label: 'Issue Date', dataIndex: 'issueDateMs', type: 'number', render: (_, row) => <span className="text-slate-500 font-bold whitespace-nowrap">{row.issueDateDisplay}</span> },
            { label: 'J/O No.', dataIndex: 'jo', type: 'string', render: v => <span className="font-black text-slate-900 whitespace-nowrap text-base">{v}</span> },
            { label: 'Order Details', dataIndex: 'customer', type: 'string', render: (v, row) => (
              <div className="flex flex-col min-w-[160px] max-w-[220px]">
                <span className="text-slate-900 font-black text-base truncate" title={v}>{v}</span>
                {(row.description && row.description !== '-') && <span className="text-slate-600 text-sm font-bold truncate mt-0.5" title={row.description}>{row.description}</span>}
                {(row.dimension && row.dimension !== '-') && <span className="inline-block mt-1.5 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded border border-slate-200 w-fit truncate" title={row.dimension}>{row.dimension}</span>}
              </div>
            )},
            { label: 'Target', dataIndex: 'target', type: 'string', render: v => <span className="font-black text-slate-700 text-base whitespace-nowrap">{v}</span> },
            { label: 'Extrusion', dataIndex: 'extProgress', type: 'number', render: v => (
              <div className="w-32 sm:w-44">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] uppercase font-black text-slate-400 tracking-wider hidden sm:inline">Progress</span>
                  <span className="text-sm sm:text-base font-black text-blue-700">{v.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner border border-slate-300/50">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-full transition-all duration-500" style={{width: `${Math.min(v, 100)}%`}}></div>
                </div>
              </div>
            )},
            { label: 'Cutting', dataIndex: 'cutProgress', type: 'number', render: v => (
              <div className="w-32 sm:w-44">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] uppercase font-black text-slate-400 tracking-wider hidden sm:inline">Progress</span>
                  <span className="text-sm sm:text-base font-black text-emerald-700">{v.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner border border-slate-300/50">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full transition-all duration-500" style={{width: `${Math.min(v, 100)}%`}}></div>
                </div>
              </div>
            )},
            { label: 'Packing', dataIndex: 'packProgress', type: 'number', render: v => (
              <div className="w-32 sm:w-44">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] uppercase font-black text-slate-400 tracking-wider hidden sm:inline">Progress</span>
                  <span className="text-sm sm:text-base font-black text-purple-700">{v.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner border border-slate-300/50">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-400 h-full rounded-full transition-all duration-500" style={{width: `${Math.min(v, 100)}%`}}></div>
                </div>
              </div>
            )}
          ]}
        />
      </div>

      {/* Data Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 pb-8">
        <SortableTable 
          title="Latest Extrusion Runs" data={dashboardData.extrusion} onFlag={(r) => {setFlagData({department: 'Extrusion', date: new Date(r[1]).toLocaleDateString('en-GB'), jobOrder: r[3], reason: ''}); setIsFlagModalOpen(true);}}
          onRowClick={(r) => setSelectedLog({ type: 'Extrusion', data: r })}
          columns={[
            { label: 'Date', dataIndex: 1, type: 'date', render: d => new Date(d).toLocaleDateString('en-GB') },
            { label: 'Job Order', dataIndex: 3, type: 'string', render: v => <span className="font-bold text-slate-900">{v}</span> },
            { label: 'Output (kg)', dataIndex: 6, type: 'number', render: v => <span className="font-black text-blue-700">{v}</span> }
          ]}
        />
        <SortableTable 
          title="Latest Cutting Logs" data={dashboardData.cutting} onFlag={(r) => {setFlagData({department: 'Cutting', date: new Date(r[1]).toLocaleDateString('en-GB'), jobOrder: r[3], reason: ''}); setIsFlagModalOpen(true);}}
          onRowClick={(r) => setSelectedLog({ type: 'Cutting', data: r })}
          columns={[
            { label: 'Date', dataIndex: 1, type: 'date', render: d => new Date(d).toLocaleDateString('en-GB') },
            { label: 'Job Order', dataIndex: 3, type: 'string', render: v => <span className="font-bold text-slate-900">{v}</span> },
            { label: 'Output (kg)', dataIndex: 6, type: 'number', render: v => <span className="font-black text-emerald-700">{v}</span> }
          ]}
        />
        <SortableTable 
          title="Latest Packing Logs" data={dashboardData.packing} onFlag={(r) => {setFlagData({department: 'Packing', date: new Date(r[1]).toLocaleDateString('en-GB'), jobOrder: r[3], reason: ''}); setIsFlagModalOpen(true);}}
          onRowClick={(r) => setSelectedLog({ type: 'Packing', data: r })}
          columns={[
            { label: 'Date', dataIndex: 1, type: 'date', render: d => new Date(d).toLocaleDateString('en-GB') },
            { label: 'Job Order', dataIndex: 3, type: 'string', render: v => <span className="font-bold text-slate-900">{v}</span> },
            { label: 'Qty', dataIndex: 6, type: 'number', render: v => <span className="font-black text-purple-700">{v}</span> }
          ]}
        />
        <SortableTable 
          title="Incoming Materials" data={dashboardData.incoming} onFlag={(r) => {setFlagData({department: 'Incoming Goods', date: new Date(r[1]).toLocaleDateString('en-GB'), jobOrder: r[2], reason: ''}); setIsFlagModalOpen(true);}}
          onRowClick={(r) => setSelectedLog({ type: 'Incoming Goods', data: r })}
          columns={[
            { label: 'Date', dataIndex: 1, type: 'date', render: d => new Date(d).toLocaleDateString('en-GB') },
            { label: 'Material', dataIndex: 2, type: 'string', render: v => <span className="font-bold text-slate-900">{v}</span> },
            { label: 'Amount (kg)', dataIndex: 3, type: 'number', render: v => <span className="font-black text-blue-700">{v}</span> }
          ]}
        />
      </div>
    </div>
  );
};

export default DashboardView;