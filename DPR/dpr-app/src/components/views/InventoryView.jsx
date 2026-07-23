import React from 'react';
import { ClipboardCheck, RefreshCw, Box, Package, Truck, QrCode, Save, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import SortableTable from '../ui/SortableTable'; // Ensure this matches exactly

const InventoryView = ({
  t,
  inventoryTab, setInventoryTab,
  stocktakeCategory, setStocktakeCategory,
  stocktakeForm, setStocktakeForm, initialStocktakeForm,
  setIsScanningQR,
  fetchDashboardData, isFetchingDashboard,
  rawMaterialsSummary, warehouseGoodsData, dashboardData,
  activeRequisitions, handleResolveRequisition,
  uniqueFinishedGoods, uniqueRawMaterials,
  handleStocktakeSubmit
}) => {
  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">{t("Warehouse Overview")}</h2>
          <p className="text-sm font-bold text-slate-500 mt-1">Real-time inventory and stock levels</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* INVENTORY TABS */}
          <div className="flex bg-slate-200/60 p-1.5 rounded-xl shadow-inner">
            <button onClick={() => setInventoryTab('Overview')} className={`flex-1 sm:flex-none px-4 py-2 text-sm font-black rounded-lg transition-all duration-300 ${inventoryTab === 'Overview' ? 'bg-white shadow text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}>Overview</button>
            <button onClick={() => setInventoryTab('Stocktake')} className={`flex-1 sm:flex-none px-4 py-2 text-sm font-black rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${inventoryTab === 'Stocktake' ? 'bg-blue-600 shadow text-white' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}><ClipboardCheck size={16} /> Stocktake</button>
          </div>
          <button onClick={fetchDashboardData} disabled={isFetchingDashboard} className="flex items-center justify-center gap-2 text-sm font-black bg-white border border-slate-300 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors shadow-sm w-full sm:w-auto active:scale-95 text-slate-700">
            <RefreshCw size={16} className={isFetchingDashboard ? 'animate-spin text-blue-500' : 'text-slate-400'} /> Refresh
          </button>
        </div>
      </div>

      {inventoryTab === 'Overview' && (
        <div className="animate-in fade-in duration-300 space-y-6 md:space-y-8">
          {/* Inventory Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 md:p-8 rounded-2xl border border-blue-100 relative overflow-hidden group">
              <p className="text-[11px] md:text-xs font-black text-blue-500/80 uppercase tracking-widest mb-3">Total Raw Materials (Current)</p>
              <div className="flex items-end gap-3 relative z-10">
                <p className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
                  {rawMaterialsSummary.reduce((sum, item) => sum + item.current, 0).toFixed(0)} <span className="text-lg md:text-xl font-bold text-slate-500 tracking-normal">kg</span>
                </p>
              </div>
              <div className="mt-3 flex gap-4 text-xs font-bold text-blue-700/70 relative z-10">
                <span>In: {rawMaterialsSummary.reduce((sum, item) => sum + item.incoming, 0).toFixed(0)} kg</span>
                <span>Out: {rawMaterialsSummary.reduce((sum, item) => sum + item.consumed, 0).toFixed(0)} kg</span>
              </div>
              <Box className="absolute -right-6 -bottom-6 text-blue-500/10 transition-transform group-hover:scale-110 duration-500" size={120} />
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-6 md:p-8 rounded-2xl border border-amber-100 relative overflow-hidden group">
              <p className="text-[11px] md:text-xs font-black text-amber-600/80 uppercase tracking-widest mb-3">Finished Goods (Pending)</p>
              <div className="flex items-end gap-3 relative z-10">
                <p className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
                  {warehouseGoodsData.reduce((sum, item) => sum + item.pendingDispatch, 0).toFixed(0)} <span className="text-lg md:text-xl font-bold text-slate-500 tracking-normal">kg</span>
                </p>
              </div>
              <div className="mt-3 text-xs font-bold text-amber-700/70 relative z-10">
                Packed jobs awaiting physical dispatch
              </div>
              <Package className="absolute -right-6 -bottom-6 text-amber-500/10 transition-transform group-hover:scale-110 duration-500" size={120} />
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 p-6 md:p-8 rounded-2xl border border-indigo-100 relative overflow-hidden group">
              <p className="text-[11px] md:text-xs font-black text-indigo-500/80 uppercase tracking-widest mb-3">Active Logistics</p>
              <div className="flex items-end gap-3 relative z-10">
                <p className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
                  {dashboardData.containers?.length || 0} <span className="text-lg md:text-xl font-bold text-slate-500 tracking-normal">containers</span>
                </p>
              </div>
              <div className="mt-3 text-xs font-bold text-indigo-700/70 relative z-10">
                Scheduled shipping & arrivals
              </div>
              <Truck className="absolute -right-6 -bottom-6 text-indigo-500/10 transition-transform group-hover:scale-110 duration-500" size={120} />
            </div>
          </div>

          {/* Inventory Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 pb-8">
            <SortableTable
              title={t("Raw Material Stock")}
              data={rawMaterialsSummary}
              columns={[
                { label: t("Material"), dataIndex: 'material', type: 'string', render: v => <span className="font-bold text-slate-800">{v}</span> },
                { label: t("Incoming"), dataIndex: 'incoming', type: 'number', render: v => <span className="text-slate-500 font-semibold">{v.toFixed(1)}</span> },
                { label: t("Consumed"), dataIndex: 'consumed', type: 'number', render: v => <span className="text-slate-500 font-semibold">{v.toFixed(1)}</span> },
                { label: t("Current Stock"), dataIndex: 'current', type: 'number', render: v => <span className={`font-black ${v > 0 ? 'text-blue-700' : v < 0 ? 'text-red-500' : 'text-slate-400'}`}>{v.toFixed(1)} kg</span> }
              ]}
            />
            <SortableTable
              title={t("Finished Goods (Pending)")}
              data={warehouseGoodsData}
              columns={[
                {
                  label: 'J/O No.', dataIndex: 'jo', type: 'string', render: (v, row) => (
                    <div className="flex flex-col min-w-[120px]">
                      <span className="font-black text-slate-900 text-base">{v}</span>
                      <span className="text-xs font-bold text-slate-500 mt-0.5 truncate max-w-[150px]" title={row.customer}>{row.customer}</span>
                    </div>
                  )
                },
                { label: 'Details', dataIndex: 'dimension', type: 'string', render: v => <span className="inline-block bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-slate-200 w-fit truncate" title={v}>{v || '-'}</span> },
                { label: 'Pending', dataIndex: 'pendingDispatch', type: 'number', render: v => <span className="font-black text-amber-600 text-base">{v.toFixed(1)} kg</span> },
                {
                  label: 'Status', dataIndex: 'isReady', type: 'boolean', render: v => (
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${v ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                      {v ? 'Ready' : 'Packing'}
                    </span>
                  )
                }
              ]}
            />
          </div>

          {/* Purchase Requisition Tracker inside Inventory */}
          <div className="mt-6 md:mt-8 pb-8">
            <SortableTable
              title={t("Pending Purchase Requisitions")}
              data={activeRequisitions}
              rowsPerPage={4}
              columns={[
                { label: t("Date"), dataIndex: 'timestamp', type: 'date', render: (_, r) => <span className="font-bold text-slate-600">{new Date(r.timestamp).toLocaleDateString('en-GB')}</span> },
                { label: t("Item Name"), dataIndex: 'item', type: 'string', render: v => <span className="font-black text-slate-900 text-base">{v}</span> },
                { label: t("Quantity"), dataIndex: 'qty', type: 'number', render: (v, r) => <span className="font-black text-blue-700 text-base">{v} <span className="text-xs">{r.uom}</span></span> },
                { label: t("Current Stock"), dataIndex: 'stock', type: 'number', render: (v, r) => <span className="font-bold text-amber-600">{v} <span className="text-xs">{r.uom}</span></span> },
                { label: t("Remarks"), dataIndex: 'remarks', type: 'string', render: v => <span className="text-slate-600 italic text-sm">{v}</span> },
                {
                  label: t("Action"), dataIndex: 'timestamp', type: 'string', render: (v) => (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleResolveRequisition(v); }}
                      className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-500 hover:text-white rounded-lg text-xs font-black transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
                    >
                      <CheckCircle size={14} /> {t("Resolve")}
                    </button>
                  )
                }
              ]}
            />
          </div>
        </div>
      )}

      {/* --- NEW STOCKTAKE TOOL UI --- */}
      {inventoryTab === 'Stocktake' && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300 w-full">
          {/* Category Switcher */}
          <div className="flex flex-col md:flex-row gap-3 mb-6 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto custom-scrollbar">
            {['Finished Goods', 'Unpacked FG', 'Raw Materials', 'WIP'].map(cat => (
              <button
                key={cat}
                onClick={() => { setStocktakeCategory(cat); setStocktakeForm(initialStocktakeForm); }}
                className={`flex-1 whitespace-nowrap py-3 px-4 text-sm font-black rounded-xl transition-all duration-300 ${stocktakeCategory === cat ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8 items-start">

            {/* Left Column: Catalogue/Tracker */}
            <div className="w-full">
              {(stocktakeCategory === 'Finished Goods' || stocktakeCategory === 'Unpacked FG') ? (
                <SortableTable
                  title={`Product Catalogue (All Items)`}
                  data={uniqueFinishedGoods}
                  rowsPerPage={6}
                  onRowClick={(row) => {
                    setStocktakeForm(prev => ({
                      ...prev,
                      customer: row.customer,
                      description: row.description,
                      dimension: row.dimension,
                      uom: row.targetUom
                    }));
                    toast.success(`Selected: ${row.description}`, { icon: '🎯' });
                    window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
                  }}
                  columns={[
                    { label: 'Customer', dataIndex: 'customer', type: 'string', render: v => <span className="font-black text-slate-800">{v}</span> },
                    {
                      label: 'Description', dataIndex: 'description', type: 'string', render: (v, r) => (
                        <div className="flex flex-col min-w-[150px]">
                          <span className="text-slate-700 font-bold text-sm">{v}</span>
                          <span className="text-slate-500 text-xs font-semibold mt-0.5">{r.dimension}</span>
                        </div>
                      )
                    }
                  ]}
                />
              ) : (
                <SortableTable
                  title={`Material Catalogue`}
                  data={uniqueRawMaterials}
                  rowsPerPage={6}
                  onRowClick={(row) => {
                    setStocktakeForm(prev => ({
                      ...prev,
                      materialName: row.material,
                      uom: 'kg'
                    }));
                    toast.success(`Selected: ${row.material}`, { icon: '📦' });
                    window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
                  }}
                  columns={[
                    { label: 'Material Name', dataIndex: 'material', type: 'string', render: v => <span className="font-black text-slate-800 text-base">{v}</span> },
                    { label: 'Est. System Stock', dataIndex: 'currentStockEstimate', type: 'number', render: v => <span className="text-slate-500 font-bold">{v.toFixed(1)} kg</span> }
                  ]}
                />
              )}
            </div>

            {/* Right Column: Data Entry Form */}
            <form onSubmit={handleStocktakeSubmit} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm sticky top-24 w-full">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <ClipboardCheck size={22} className="text-indigo-600" /> Record Actual Stock
              </h3>

              {(stocktakeCategory === 'Finished Goods' || stocktakeCategory === 'Unpacked FG') ? (
                <div className="space-y-5">
                  <div className="min-w-0 relative">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Item Code / Item No.</label>
                    <div className="flex gap-2">
                      <input type="text" value={stocktakeForm.itemCode} onChange={(e) => setStocktakeForm({ ...stocktakeForm, itemCode: e.target.value.toUpperCase() })} className="w-full h-14 px-4 border border-slate-300 rounded-xl outline-none font-bold text-lg bg-white" placeholder="e.g. M014HDBGBNRPL009" />
                      <button type="button" onClick={() => setIsScanningQR(true)} className="h-14 px-4 sm:px-5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-xl flex items-center justify-center transition-colors shrink-0 shadow-sm active:scale-95" title="Scan QR Code">
                        <QrCode size={24} />
                      </button>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Customer</label>
                    <input type="text" value={stocktakeForm.customer} onChange={(e) => setStocktakeForm({ ...stocktakeForm, customer: e.target.value })} className="w-full h-12 px-4 border border-slate-300 rounded-xl outline-none font-bold text-base bg-slate-50" required placeholder="Select from catalogue..." />
                  </div>
                  <div className="min-w-0">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                    <input type="text" value={stocktakeForm.description} onChange={(e) => setStocktakeForm({ ...stocktakeForm, description: e.target.value })} className="w-full h-12 px-4 border border-slate-300 rounded-xl outline-none font-bold text-base bg-slate-50" required />
                  </div>
                  <div className="min-w-0">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Dimension / Size</label>
                    <input type="text" value={stocktakeForm.dimension} onChange={(e) => setStocktakeForm({ ...stocktakeForm, dimension: e.target.value })} className="w-full h-12 px-4 border border-slate-300 rounded-xl outline-none font-semibold text-base bg-slate-50" />
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="min-w-0 relative">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Item Code / Material Name</label>
                    <div className="flex gap-2">
                      <input type="text" value={stocktakeForm.materialName} onChange={(e) => setStocktakeForm({ ...stocktakeForm, materialName: e.target.value.toUpperCase() })} className="w-full h-14 px-4 border border-slate-300 rounded-xl outline-none font-black text-lg bg-slate-50" required placeholder="Select from catalogue..." />
                      <button type="button" onClick={() => setIsScanningQR(true)} className="h-14 px-4 sm:px-5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-xl flex items-center justify-center transition-colors shrink-0 shadow-sm active:scale-95" title="Scan QR Code">
                        <QrCode size={24} />
                      </button>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Location / Rack</label>
                    <select value={stocktakeForm.location} onChange={(e) => setStocktakeForm({ ...stocktakeForm, location: e.target.value })} className="w-full h-12 px-3 border border-slate-300 rounded-xl outline-none bg-white font-bold text-base">
                      <option value="">Select Location...</option>
                      <option value="Pallet 1">Pallet 1</option>
                      <option value="Rack A">Rack A</option>
                      <option value="Rack B">Rack B</option>
                      <option value="Rack C">Rack C</option>
                      <option value="Rack D">Rack D</option>
                      <option value="Rack E">Rack E</option>
                      <option value="Rack F">Rack F</option>
                      <option value="General">General / Floor</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Shared Quantity & Remarks */}
              <div className="mt-5 space-y-5 pt-5 border-t border-slate-100">
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-sm font-black text-indigo-700 mb-2">Actual Count (QTY)</label>
                    <input type="number" step="0.01" value={stocktakeForm.quantity} onChange={(e) => setStocktakeForm({ ...stocktakeForm, quantity: e.target.value })} className="w-full h-14 px-4 border-2 border-indigo-200 focus:border-indigo-500 rounded-xl outline-none font-black text-xl text-indigo-800 transition-colors" required placeholder="0.00" />
                  </div>
                  <div className="w-28 shrink-0">
                    <label className="block text-sm font-bold text-slate-700 mb-2">UoM</label>
                    <select value={stocktakeForm.uom} onChange={(e) => setStocktakeForm({ ...stocktakeForm, uom: e.target.value })} className="w-full h-14 px-3 border border-slate-300 rounded-xl outline-none bg-white font-bold text-base">
                      <option value="KG">KG</option>
                      <option value="PCS">PCS</option>
                      <option value="BAGS">BAGS</option>
                      <option value="PKT">PKT</option>
                      <option value="ROLL">ROLL</option>
                    </select>
                  </div>
                </div>
                <div className="min-w-0">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Remark / Notes</label>
                  <input type="text" value={stocktakeForm.remarks} onChange={(e) => setStocktakeForm({ ...stocktakeForm, remarks: e.target.value })} className="w-full h-12 px-4 border border-slate-300 rounded-xl outline-none text-base" placeholder="Optional notes..." />
                </div>

                <button type="submit" className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl transition-all shadow-md active:scale-95 text-lg mt-4 flex items-center justify-center gap-2">
                  <Save size={20} /> Save Stocktake Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryView;