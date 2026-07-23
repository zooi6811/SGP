import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, Package, CheckCircle, ShoppingCart, ClipboardList, Box, 
  Settings, Trash2, Scale, PlusCircle, Truck, ArrowDownToLine, Camera, Edit2, Eye, EyeOff, AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import SortableTable from '../ui/SortableTable';

// --- SHARED FORM UI COMPONENTS ---

const InlineEdit = ({ value, onSave, suffix = "kg", className = "" }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => { setTempValue(value); }, [value]);
  useEffect(() => { if (isEditing && inputRef.current) inputRef.current.focus(); }, [isEditing]);

  const handleBlurOrEnter = () => {
    setIsEditing(false);
    const numValue = parseFloat(tempValue);
    if (!isNaN(numValue) && numValue !== value) {
      onSave(numValue);
      toast.success("Value updated", { position: 'bottom-right' });
    } else {
      setTempValue(value);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
        <input 
          ref={inputRef} type="number" step="0.01" value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleBlurOrEnter}
          onKeyDown={(e) => e.key === 'Enter' && handleBlurOrEnter()}
          className={`w-20 p-1 text-base border-2 border-blue-500 rounded outline-none font-bold text-slate-800 ${className}`}
        />
        <span className="text-sm font-medium text-slate-500">{suffix}</span>
      </div>
    );
  }

  return (
    <div 
      onClick={() => setIsEditing(true)} 
      className={`flex items-center gap-1 cursor-pointer group hover:bg-slate-100 p-1 -ml-1 rounded transition-colors ${className}`}
      title="Tap to edit"
    >
      <span className="font-bold text-slate-700 text-base">{value} {suffix}</span>
      <Edit2 size={14} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

const ImageUploadField = ({ preview, onFileChange, onClear, disabled, t }) => (
  <div className={`mt-3 mb-6 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
    <label className="block text-sm font-bold text-slate-700 mb-2">{t("Evidence Photo (Optional)")}</label>
    {!preview ? (
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Camera className="w-8 h-8 text-slate-400 mb-2" />
          <p className="text-sm text-slate-500 font-semibold">{t("Tap to take photo or upload")}</p>
        </div>
        <input type="file" accept="image/*" capture="environment" className="hidden" onChange={onFileChange} disabled={disabled} />
      </label>
    ) : (
      <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900">
        <img src={preview} alt="QC Evidence" className="w-full h-full object-contain" />
        <button type="button" onClick={onClear} disabled={disabled} className="absolute top-2 right-2 bg-red-500 text-white p-2.5 rounded-lg shadow-md hover:bg-red-600 transition-colors active:scale-95">
          <Trash2 size={16} />
        </button>
      </div>
    )}
  </div>
);

const QCField = ({ label, name, statusName, formData, onChange, placeholder, t, disabled }) => (
  <div className={`flex flex-col sm:flex-row sm:items-end gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm ${disabled ? 'opacity-70' : ''}`}>
    <div className="flex-1 min-w-0">
      <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
      <input type="text" name={name} value={formData[name]} onChange={onChange} placeholder={placeholder} disabled={disabled} className="w-full p-3 border border-slate-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 outline-none font-semibold disabled:bg-slate-50 transition-colors" />
    </div>
    <div className="w-full sm:w-32 shrink-0">
      <label className="block text-sm font-bold text-slate-700 mb-2 sm:hidden">{t("Status")}</label>
      <select name={statusName} value={formData[statusName]} onChange={onChange} disabled={disabled} className="w-full p-3 border border-slate-300 rounded-lg text-base focus:outline-none font-bold disabled:bg-slate-50 transition-colors">
        <option className="text-emerald-600" value="Pass">{t("Pass")}</option>
        <option className="text-red-600" value="Fail">{t("Fail")}</option>
        <option className="text-slate-400" value="N/A">{t("N/A")}</option>
      </select>
    </div>
  </div>
);

// --- MAIN VIEW COMPONENT ---

const ProductionFormView = ({
  formRef,
  department, t, formData, setFormData, handleInputChange, massBalance,
  pendingExtrusion, pendingCutting, pendingPacking, readyToShipData, dashboardData,
  showCompleted, setShowCompleted,
  joSuggestions, materialSuggestions, localHistory,
  quickMaterialBatch, setQuickMaterialBatch, quickMaterialWeight, setQuickMaterialWeight, 
  quickMaterialUom, setQuickMaterialUom, quickMaterialName, quickMaterialId,
  quickRollWeight, setQuickRollWeight, quickScrapType, setQuickScrapType, 
  quickScrapWeight, setQuickScrapWeight, quickPalletCount, setQuickPalletCount,
  handleAddMaterial, handleRemoveMaterial, handleAddRoll, handleRemoveRoll, 
  handleAddScrap, handleRemoveScrap, updateMaterialQuantity, updateRollWeight, 
  updateScrapWeight, updateBagWeight, addBagWeightRow, removeBagWeightRow,
  handleAutoBatch, updateIncomingBatchNo, updateIncomingBatchAmount, removeIncomingBatch,
  qcStage, setQcStage, qcActiveForm, handleQcFormSwitch,
  setIsScanningQR, evidenceImagePreview, handleEvidenceImageChange, clearEvidenceImage
}) => {
  // Set default tracker visibility to hidden
  const [isTrackerVisible, setIsTrackerVisible] = useState(false);

  // Dynamic Validation Variables
  const isJoEntered = formData.jobOrder && formData.jobOrder.trim().length > 0;
  const isValidJo = isJoEntered ? dashboardData?.masterOrders?.some(o => o.jo === formData.jobOrder) : true;

  return (
    <>
      <datalist id="jo-suggestions">{joSuggestions.map(jo => <option key={jo} value={jo} />)}</datalist>
      <datalist id="material-suggestions">{materialSuggestions.map(mat => <option key={mat} value={mat} />)}</datalist>
      <datalist id="batch-suggestions">{localHistory.batchNos.map(b => <option key={b} value={b} />)}</datalist>
      <datalist id="supplier-suggestions">{localHistory.suppliers.map(s => <option key={s} value={s} />)}</datalist>
      <datalist id="downtime-suggestions">{localHistory.downtimeReasons.map(d => <option key={d} value={d} />)}</datalist>

      {/* Attach ref to main form to enable submit blocker scrolling guidance */}
      <form ref={formRef} className="space-y-6 md:space-y-8 animate-in fade-in zoom-in-95 duration-300">
        
        <div className="hidden md:flex justify-between items-center mb-2">
          <div>
            <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
              {department === 'Extrusion' && <Activity className="text-blue-600" size={32} />}
              {department === 'Packing' && <Package className="text-purple-600" size={32} />}
              {department === 'Quality Control' && <CheckCircle className="text-emerald-600" size={32} />}
              {department === 'Purchase Requisition' && <ShoppingCart className="text-amber-500" size={32} />}
              {department} Report
            </h2>
          </div>
        </div>

        {/* Section 1: Session Parameters */}
        <section className="bg-white p-5 md:p-8 rounded-3xl border border-slate-200 shadow-sm relative">
          <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"><ClipboardList size={20} className="text-slate-400"/> {t("Session Parameters")}</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="min-w-0">
              <label className="block text-sm font-bold text-slate-700 mb-2">{t("Date")}</label>
              <input type="date" name="date" value={formData.date} onChange={handleInputChange} required className="box-border block w-full appearance-none h-14 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white transition-colors text-base font-bold" />
            </div>
            {(department !== 'Incoming Goods' && department !== 'Purchase Requisition') && (
              <div className="min-w-0">
                <label className="block text-sm font-bold text-slate-700 mb-2">{t("Shift")}</label>
                <select name="shift" value={formData.shift} onChange={handleInputChange} className="w-full h-14 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white transition-colors text-base font-black">
                  <option value="AM">{t("Morning (AM)")}</option>
                  <option value="PM">{t("Night (PM)")}</option>
                </select>
              </div>
            )}
            <div className={`min-w-0 ${(department === 'Incoming Goods' || department === 'Purchase Requisition') ? 'sm:col-span-2 lg:col-span-3' : ''}`}>
              <label className="block text-sm font-bold text-slate-700 mb-2">{department === 'Incoming Goods' ? t('Receiver / Admin Name') : department === 'Quality Control' ? t('QC Inspector') : t('Operator / Supervisor')}</label>
              <input type="text" name="supervisor" value={formData.supervisor} onChange={handleInputChange} required className="w-full h-14 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white transition-colors text-base font-bold" />
            </div>
            
            {/* Machine Number Selection dropdown */}
            {(department === 'Extrusion' || department === 'Cutting') && (
              <div className="min-w-0">
                <label className="block text-sm font-bold text-slate-700 mb-2">{t("Machine No.")}</label>
                <select 
                  name="machineId" 
                  value={formData.machineId} 
                  onChange={handleInputChange} 
                  required 
                  className="w-full h-14 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white uppercase transition-colors text-base font-black"
                >
                  <option value="" disabled>{t("Select Machine")}</option>
                  {department === 'Extrusion' && ['B1','B2','B3','B4','B5','B6','B7','B8','B9'].map(m => <option key={m} value={m}>{m}</option>)}
                  {department === 'Cutting' && ['C1','C2','C3','C4','C5','C6','C7','C8'].map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            )}
          </div>
        </section>

        {/* --- DEPARTMENTAL AUTO-FILL TRACKERS --- */}
        {((department === 'Extrusion' && pendingExtrusion.length > 0) || 
          (department === 'Cutting' && pendingCutting.length > 0) || 
          (department === 'Packing' && pendingPacking.length > 0)) && (
          <div className="flex justify-end mb-2 mt-4 mr-2">
            <button type="button" onClick={() => setIsTrackerVisible(!isTrackerVisible)} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors bg-slate-200/50 hover:bg-slate-200 px-3 py-1.5 rounded-full active:scale-95 shadow-sm">
              {isTrackerVisible ? <EyeOff size={14} /> : <Eye size={14} />}
              {isTrackerVisible ? t("Hide Tracker") : t("Show Tracker")}
            </button>
          </div>
        )}

        {isTrackerVisible && department === 'Extrusion' && pendingExtrusion.length > 0 && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500 mb-2">
            <SortableTable 
              title={t("Ready to Run Tracker")}
              data={pendingExtrusion}
              rowsPerPage={3}
              showCompletedToggle={true}
              showCompleted={showCompleted}
              setShowCompleted={setShowCompleted}
              onRowClick={(row) => {
                const materialsToAutoFill = (row.suggestedMaterials || []).map((mat, idx) => ({
                    id: Date.now() + idx,
                    batchNo: mat.matchBatch || '',
                    materialId: mat.matchName,
                    materialName: mat.matchName,
                    uom: 'bag',
                    originalQuantity: mat.ratio, 
                    quantity: mat.ratio * 25, 
                    time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                }));
                setFormData(prev => ({
                  ...prev, 
                  jobOrder: row.jo, 
                  machineId: row.schedMachine !== '-' ? row.schedMachine : prev.machineId,
                  extrusionMaterials: materialsToAutoFill
                }));
                toast.success(`Auto-filled Job: ${row.jo} with predicted materials`, { icon: '⚡' });
                window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
              }}
              columns={[
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
                { label: t("Progress"), dataIndex: 'extProgress', type: 'number', render: v => (
                  <div className="w-28 sm:w-36">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider hidden sm:inline">Extrusion</span>
                      <span className="text-xs font-black text-blue-700">{v.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden shadow-inner border border-slate-300/50">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-full transition-all duration-500" style={{width: `${Math.min(v, 100)}%`}}></div>
                    </div>
                  </div>
                )},
                { label: t("Machine"), dataIndex: 'schedMachine', type: 'string', render: v => <span className="font-black text-slate-700 bg-slate-100 px-2 py-1 rounded-md">{v}</span> },
                { label: t("Left to run"), dataIndex: 'extPending', type: 'number', render: v => <span className="font-black text-blue-600 text-base whitespace-nowrap">{v.toFixed(1)} kg</span> }
              ]}
            />
          </div>
        )}

        {isTrackerVisible && department === 'Cutting' && pendingCutting.length > 0 && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500 mb-2">
            <SortableTable 
              title={t("Ready to Cut Tracker")}
              data={pendingCutting}
              rowsPerPage={3}
              showCompletedToggle={true}
              showCompleted={showCompleted}
              setShowCompleted={setShowCompleted}
              onRowClick={(row) => {
                setFormData(prev => ({...prev, jobOrder: row.jo, machineId: row.schedMachine !== '-' ? row.schedMachine : prev.machineId}));
                toast.success(`Auto-filled Job: ${row.jo}`, { icon: '✂️' });
                window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
              }}
              columns={[
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
                { label: t("Progress"), dataIndex: 'cutProgress', type: 'number', render: v => (
                  <div className="w-28 sm:w-36">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider hidden sm:inline">Cutting</span>
                      <span className="text-xs font-black text-emerald-700">{v.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden shadow-inner border border-slate-300/50">
                      <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full transition-all duration-500" style={{width: `${Math.min(v, 100)}%`}}></div>
                    </div>
                  </div>
                )},
                { label: t("Machine"), dataIndex: 'schedMachine', type: 'string', render: v => <span className="font-black text-slate-700 bg-slate-100 px-2 py-1 rounded-md">{v}</span> },
                { label: t("Available to Cut"), dataIndex: 'availableToCut', type: 'number', render: (v, r) => (
                  <span className={`font-black text-base whitespace-nowrap ${v > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>{v.toFixed(1)} kg</span> 
                )}
              ]}
            />
          </div>
        )}

        {isTrackerVisible && department === 'Packing' && pendingPacking.length > 0 && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500 mb-2">
            <SortableTable 
              title={t("Ready to Pack Tracker")}
              data={pendingPacking}
              rowsPerPage={3}
              showCompletedToggle={true}
              showCompleted={showCompleted}
              setShowCompleted={setShowCompleted}
              onRowClick={(row) => {
                setFormData(prev => ({...prev, jobOrder: row.jo}));
                toast.success(`Auto-filled Job: ${row.jo}`, { icon: '📦' });
                window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
              }}
              columns={[
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
                { label: t("Progress"), dataIndex: 'packProgress', type: 'number', render: v => (
                  <div className="w-28 sm:w-36">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider hidden sm:inline">Packing</span>
                      <span className="text-xs font-black text-purple-700">{v.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden shadow-inner border border-slate-300/50">
                      <div className="bg-gradient-to-r from-purple-500 to-purple-400 h-full rounded-full transition-all duration-500" style={{width: `${Math.min(v, 100)}%`}}></div>
                    </div>
                  </div>
                )},
                { label: t("Available to Pack"), dataIndex: 'availableToPack', type: 'number', render: (v, r) => (
                  <span className={`font-black text-base whitespace-nowrap ${v > 0 ? 'text-purple-600' : 'text-slate-400'}`}>{v.toFixed(1)} kg</span> 
                )}
              ]}
            />
          </div>
        )}
        {/* --- END TRACKERS --- */}

        {/* MANUFACTURING DEPARTMENTS (Extrusion & Cutting) -> 2 Column Grid */}
        {(department === 'Extrusion' || department === 'Cutting') && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
            
            {/* Left Column: 1. Material Inputs */}
            <section className="bg-white p-5 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"><Box size={22} className="text-blue-500"/> {t("Material Inputs")}</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">{t("Job Order No.")}</label>
                <input type="text" name="jobOrder" value={formData.jobOrder} onChange={handleInputChange} required placeholder="e.g. 99-1" className={`w-full h-14 px-4 border rounded-xl focus:ring-2 outline-none uppercase font-black text-base transition-colors ${!isValidJo && isJoEntered ? 'border-red-400 focus:ring-red-500 bg-red-50 text-red-900' : 'border-slate-300 focus:ring-blue-500 bg-slate-50 focus:bg-white text-slate-800'}`} list="jo-suggestions" />
                {!isValidJo && isJoEntered && (
                  <p className="text-xs font-bold text-red-500 mt-2 flex items-center gap-1.5"><AlertTriangle size={14} /> {t("Invalid JO: Not found in Master List")}</p>
                )}
              </div>

              {department === 'Extrusion' ? (
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex-1">
                  <h4 className="text-sm font-black text-slate-700 mb-4 tracking-wide">{t("Shift Accumulator (Materials)")}</h4>
                  <div className="flex flex-col gap-3 mb-5">
                    <div className="min-w-0">
                      <input type="text" value={quickMaterialBatch} onChange={e => setQuickMaterialBatch(e.target.value.toUpperCase())} className="w-full h-14 px-4 border border-slate-300 rounded-xl focus:ring-blue-500 outline-none text-base font-bold uppercase" placeholder="e.g. LDN1CY-2" list="batch-suggestions" />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                      <div className="flex min-w-0 sm:flex-1 gap-2">
                        <input type="number" step="0.01" value={quickMaterialWeight} onChange={e => setQuickMaterialWeight(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddMaterial())} className="min-w-0 flex-1 h-14 px-4 border border-slate-300 rounded-xl focus:ring-blue-500 outline-none text-base font-black" placeholder="Amount" />
                        <select value={quickMaterialUom} onChange={e => setQuickMaterialUom(e.target.value)} className="h-14 w-24 sm:w-28 px-2 border border-slate-300 rounded-xl focus:ring-blue-500 outline-none text-base font-bold bg-white shrink-0">
                          <option value="kg">kg</option>
                          <option value="bag">{t("bag")}</option>
                        </select>
                      </div>
                      <button type="button" onClick={handleAddMaterial} className="h-14 w-full sm:w-auto px-6 bg-blue-100 hover:bg-blue-200 text-blue-700 font-black rounded-xl transition-colors shrink-0 active:scale-95">Add Mat.</button>
                    </div>
                    {quickMaterialBatch && quickMaterialName && (
                      <div className="text-xs text-emerald-700 flex items-center gap-1.5 font-bold bg-emerald-100 p-2.5 rounded-lg border border-emerald-200 mt-1"><CheckCircle size={16}/> Matched: {quickMaterialName}</div>
                    )}
                  </div>
                  
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
                    {formData.extrusionMaterials.map((mat) => (
                      <div key={mat.id} className="flex justify-between items-center bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200 shadow-sm group gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="font-black text-slate-800 text-sm truncate">{mat.materialId !== 'N/A' ? mat.materialId : (mat.materialName !== 'N/A' ? mat.materialName : 'Unknown')}</div>
                          <div className="text-[11px] text-slate-500 font-bold mt-0.5 truncate">Batch: {mat.batchNo}</div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                          <InlineEdit value={mat.quantity} onSave={(val) => updateMaterialQuantity(mat.id, val)} suffix="kg" />
                          <button type="button" onClick={() => handleRemoveMaterial(mat.id)} className="text-slate-300 hover:text-red-500 p-1.5 sm:p-2 bg-slate-50 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-600 uppercase tracking-wide">{t("Total Input Material:")}</span>
                    <span className="text-blue-700 text-lg font-black">{formData.extrusionMaterials.reduce((sum, m) => sum + Number(m.quantity || 0), 0).toFixed(2)} kg</span>
                  </div>
                </div>
              ) : (
                <div className="min-w-0">
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t("Input Roll Weight (kg)")}</label>
                  <input type="number" step="0.01" name="inputRollWeight" value={formData.inputRollWeight} onChange={handleInputChange} className="w-full h-14 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-base font-black bg-white" placeholder="0.00" />
                </div>
              )}
            </section>

            {/* Right Column: Output & Wastage Joined */}
            <section className="bg-white p-5 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"><Settings size={22} className="text-emerald-500"/> {t("Production Output & Wastage")}</h3>

              {department === 'Extrusion' && (
                <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 mb-6">
                  <h4 className="text-sm font-black text-emerald-800 mb-4 tracking-wide">{t("Shift Accumulator (Rolls)")}</h4>
                  <div className="flex flex-col sm:flex-row gap-3 mb-5">
                    <input type="number" step="0.01" value={quickRollWeight} onChange={e => setQuickRollWeight(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddRoll())} className="w-full sm:flex-1 h-14 px-4 border border-emerald-200 rounded-xl focus:ring-emerald-500 outline-none font-black text-base bg-white" placeholder="Weight (kg)" />
                    <button type="button" onClick={handleAddRoll} className="w-full sm:w-auto h-14 px-6 bg-emerald-200 hover:bg-emerald-300 text-emerald-800 font-black rounded-xl transition-colors shrink-0 active:scale-95">Add Roll</button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                    {formData.extrusionRolls.map((roll, i) => (
                      <div key={roll.id} className="flex justify-between items-center bg-white p-3 sm:p-3.5 rounded-xl border border-emerald-100 shadow-sm group gap-2">
                        <span className="text-slate-600 font-bold text-sm shrink-0">Roll {i + 1}</span>
                        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                          <InlineEdit value={roll.weight} onSave={(val) => updateRollWeight(roll.id, val)} suffix="kg" />
                          <button type="button" onClick={() => handleRemoveRoll(roll.id)} className="text-slate-300 hover:text-red-500 p-1.5 sm:p-2 bg-slate-50 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-4 mb-6">
                <div className="flex-1 min-w-0">
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t("Actual Good Output")}</label>
                  <input 
                    type="number" step="0.01" name="actualOutput" value={formData.actualOutput} onChange={handleInputChange} required
                    readOnly={department === 'Extrusion' && formData.extrusionRolls?.length > 0}
                    className={`w-full h-14 px-4 border-2 rounded-xl outline-none text-xl font-black transition-colors ${massBalance.isFailed ? 'border-red-400 text-red-700 bg-red-50' : 'border-slate-300 focus:border-emerald-500 text-slate-800 bg-white'}`} 
                  />
                </div>
                <div className="w-24 sm:w-28 shrink-0">
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t("UoM")}</label>
                  <select name="uom" value={formData.uom} onChange={handleInputChange} className="w-full h-14 px-3 border border-slate-300 rounded-xl outline-none bg-white font-bold text-base">
                    <option value="kg">kg</option>
                    <option value="pcs">pcs</option>
                  </select>
                </div>
              </div>

              {/* Wastage */}
              <div className="bg-rose-50/40 p-5 rounded-2xl border border-rose-100 flex-1 flex flex-col mt-auto">
                <h4 className="text-sm font-black text-rose-800 mb-4 tracking-wide">{t("Wastage Accumulator")}</h4>
                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                  <select value={quickScrapType} onChange={e => setQuickScrapType(e.target.value)} className="w-full sm:flex-1 h-14 px-3 border border-rose-200 rounded-xl focus:ring-rose-500 outline-none text-base font-bold bg-white">
                    <option value="setupScrap">{t("Setup Wastage")}</option>
                    <option value="processScrap">{t("Process Wastage")}</option>
                  </select>
                  <div className="flex w-full sm:w-auto sm:flex-[0.8] gap-2">
                    <input type="number" step="0.01" value={quickScrapWeight} onChange={e => setQuickScrapWeight(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddScrap())} className="min-w-0 flex-1 h-14 px-4 border border-rose-200 rounded-xl focus:ring-rose-500 outline-none text-base font-black bg-white" placeholder="kg" />
                    <button type="button" onClick={handleAddScrap} className="h-14 w-20 sm:w-auto px-5 bg-rose-200 hover:bg-rose-300 text-rose-900 font-black rounded-xl transition-colors active:scale-95 shrink-0 text-base">Add</button>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-1 custom-scrollbar flex-1">
                  {formData.scrapEntries?.length > 0 && formData.scrapEntries.map((scrap) => (
                    <div key={scrap.id} className="flex justify-between items-center bg-white p-3 sm:p-3.5 rounded-xl border border-rose-100 shadow-sm gap-2">
                      <span className="text-slate-600 font-bold text-sm shrink-0">{scrap.type === 'setupScrap' ? 'Setup' : 'Process'}</span>
                      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                        <InlineEdit value={scrap.weight} onSave={(val) => updateScrapWeight(scrap.id, val)} suffix="kg" className="text-rose-700" />
                        <button type="button" onClick={() => handleRemoveScrap(scrap.id)} className="text-slate-300 hover:text-rose-600 p-1.5 sm:p-2 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-4 pt-4 border-t border-rose-100 mt-auto">
                  <div className="flex-1 min-w-0">
                    <label className="block text-[11px] font-black text-rose-700 uppercase tracking-wider mb-2">Total Setup</label>
                    <input type="number" name="setupScrap" value={formData.setupScrap} onChange={handleInputChange} readOnly={formData.scrapEntries?.some(s => s.type === 'setupScrap')} className={`w-full h-12 px-3 rounded-xl outline-none text-base font-black border ${formData.scrapEntries?.some(s => s.type === 'setupScrap') ? 'bg-rose-50 border-transparent text-rose-900' : 'bg-white border-rose-200 focus:border-rose-400'}`} placeholder="0.00" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-[11px] font-black text-rose-700 uppercase tracking-wider mb-2">Total Process</label>
                    <input type="number" name="processScrap" value={formData.processScrap} onChange={handleInputChange} readOnly={formData.scrapEntries?.some(s => s.type === 'processScrap')} className={`w-full h-12 px-3 rounded-xl outline-none text-base font-black border ${formData.scrapEntries?.some(s => s.type === 'processScrap') ? 'bg-rose-50 border-transparent text-rose-900' : 'bg-white border-rose-200 focus:border-rose-400'}`} placeholder="0.00" />
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* PACKING DEPARTMENT */}
        {department === 'Packing' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 w-full">
            <section className="bg-white p-5 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"><Package size={22} className="text-purple-500"/> {t("Finished Goods Packing")}</h3>
              <div className="space-y-5">
                <div className="min-w-0">
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t("Job Order No.")}</label>
                  <input type="text" name="jobOrder" value={formData.jobOrder} onChange={handleInputChange} required placeholder="e.g. 99-1" className={`w-full h-14 px-4 border rounded-xl focus:ring-2 outline-none uppercase font-black text-base transition-colors ${!isValidJo && isJoEntered ? 'border-red-400 focus:ring-purple-500 bg-red-50 text-red-900' : 'border-slate-300 focus:ring-purple-500 bg-slate-50 focus:bg-white text-slate-800'}`} list="jo-suggestions" />
                  {!isValidJo && isJoEntered && (
                    <p className="text-xs font-bold text-red-500 mt-2 flex items-center gap-1.5"><AlertTriangle size={14} /> {t("Invalid JO: Not found in Master List")}</p>
                  )}
                  
                  {/* Intelligent Packing Progress Bar */}
                  {(() => {
                    if (!formData.jobOrder || !dashboardData?.masterOrders) return null;
                    const order = dashboardData.masterOrders.find(o => o.jo === formData.jobOrder);
                    if (!order) return null;

                    const targetQty = parseFloat(order.targetQty) || 1;
                    const totals = dashboardData.joTotals?.[formData.jobOrder] || { packing: 0 };
                    const packedQty = totals.packing || 0;
                    const progress = Math.min((packedQty / targetQty) * 100, 100);

                    const packingLogs = (dashboardData.packing || []).filter(r => r[3] === formData.jobOrder);
                    const totalPallets = packingLogs.length;
                    const totalBags = packingLogs.reduce((sum, r) => {
                      const bags = r[8] ? String(r[8]).split(',').filter(b => b.trim() !== '') : [];
                      return sum + bags.length;
                    }, 0);

                    return (
                      <div className="mt-4 p-4 bg-purple-50/50 border border-purple-100 rounded-xl animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-black uppercase text-purple-600 tracking-wider">JO Progress: {order.customer}</span>
                          <span className="text-sm font-black text-purple-800">{progress.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5 mb-3 overflow-hidden">
                          <div className="bg-gradient-to-r from-purple-500 to-purple-400 h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-slate-500">
                          <span>Packed: <span className="text-slate-700">{packedQty.toFixed(1)} {order.targetUom}</span> / {targetQty} {order.targetUom}</span>
                          <span className="flex gap-3">
                            <span>Bags: <span className="text-slate-700">{totalBags}</span></span>
                            <span>Pallets: <span className="text-slate-700">{totalPallets}</span></span>
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-sm font-bold text-slate-700 mb-2">{t("Packing Size")}</label>
                    <input type="number" step="0.01" name="packingSize" value={formData.packingSize} onChange={handleInputChange} placeholder="e.g. 25.00" className="w-full h-14 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white font-black text-base" />
                  </div>
                  <div className="w-28 sm:w-32 shrink-0">
                    <label className="block text-sm font-bold text-slate-700 mb-2">{t("UoM")}</label>
                    <select name="packingUom" value={formData.packingUom} onChange={handleInputChange} className="w-full h-14 px-3 border border-slate-300 rounded-xl outline-none bg-white font-bold text-base">
                      <option value="kg/bag">kg/bag</option><option value="pcs/bag">pcs/bag</option><option value="kg/roll">kg/roll</option><option value="kg/carton">kg/carton</option>
                    </select>
                  </div>
                </div>
                <div className="min-w-0">
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t("Quantity Packed")}</label>
                  <input type="number" name="quantityPacked" value={formData.quantityPacked} onChange={handleInputChange} placeholder="e.g. 10" className="w-full h-14 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white font-black text-xl text-purple-700" />
                </div>
              </div>
            </section>

            <section className="bg-white p-5 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"><Scale size={22} className="text-blue-500"/> {t("Palletisation Details")}</h3>
              
              <div className="mb-6 min-w-0">
                <label className="block text-sm font-bold text-slate-700 mb-2">{t("Pallet Weight (kg) [Tare/Gross]")}</label>
                <input type="number" step="0.01" name="palletWeight" value={formData.palletWeight} onChange={handleInputChange} placeholder="e.g. 15.00" className="w-full md:w-1/2 h-14 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white font-black text-base" />
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex-1 flex flex-col">
                <h4 className="text-sm font-black text-slate-700 mb-1 tracking-wide">{t("Individual Bag Accumulator")}</h4>
                <p className="text-[11px] sm:text-xs font-semibold text-slate-500 mb-5">Tap added weights below to edit inline.</p>
                
                <div className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
                  {formData.bagWeights.map((bag, index) => (
                    <div key={bag.id} className="flex gap-2 sm:gap-3 items-center">
                      <span className="text-[11px] font-black uppercase text-slate-400 w-10 sm:w-12 shrink-0 tracking-wider">Bag {index + 1}</span>
                      <input type="number" step="0.01" value={bag.weight} onChange={(e) => updateBagWeight(bag.id, e.target.value)} placeholder="0.00 kg" className="min-w-0 flex-1 h-12 px-3 sm:px-4 border border-slate-300 rounded-xl focus:border-blue-500 outline-none font-bold bg-white text-base" />
                      {formData.bagWeights.length > 1 && (
                        <button type="button" onClick={() => removeBagWeightRow(bag.id)} className="text-slate-300 hover:text-red-500 p-2 sm:p-3 bg-white border border-slate-200 rounded-xl transition-colors shrink-0"><Trash2 size={18}/></button>
                      )}
                    </div>
                  ))}
                </div>
                
                <button type="button" onClick={addBagWeightRow} className="mt-5 flex items-center justify-center gap-2 py-3.5 text-base text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-xl font-black transition-colors active:scale-95">
                  <PlusCircle size={18} /> Add Another Bag
                </button>
              </div>

              <div className={`mt-6 p-4 border-2 rounded-xl flex items-center justify-between cursor-pointer transition-all ${formData.jobComplete ? 'bg-emerald-50 border-emerald-500 ring-4 ring-emerald-50' : 'bg-white border-slate-200 hover:border-emerald-300'}`} onClick={() => setFormData(prev => ({...prev, jobComplete: !prev.jobComplete}))}>
                <div>
                    <p className="font-black text-slate-800 text-sm">{t("Mark Job as Complete")}</p>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">{t("Flag this order as fully packed and ready for shipping.")}</p>
                </div>
                <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-colors shrink-0 ${formData.jobComplete ? 'bg-emerald-500 border-emerald-500' : 'bg-slate-100 border-slate-300'}`}>
                    {formData.jobComplete && <CheckCircle size={16} className="text-white" />}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* DISPATCH & INCOMING */}
        {department === 'Dispatch' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8 w-full items-start">
            
            {/* Left Column: Trackers (Span 2 Columns) */}
            <div className="xl:col-span-2">
              <SortableTable 
                title={t("Ready to Ship Tracker")} 
                data={readyToShipData}
                rowsPerPage={4}
                onRowClick={(row) => {
                  setFormData(prev => ({...prev, jobOrder: row.jo, dispatchQty: row.pendingDispatch > 0 ? row.pendingDispatch.toFixed(2) : ''}));
                  toast.success(`Selected ${row.jo} for Dispatch`, { icon: '📦' });
                  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }}
                columns={[
                  { label: 'Job Order', dataIndex: 'jo', type: 'string', render: (v, row) => (
                    <div className="flex flex-col min-w-[120px]">
                      <span className="font-black text-slate-900 text-base">{v}</span>
                      <span className="text-xs font-bold text-slate-500 mt-0.5 truncate max-w-[150px]" title={row.customer}>{row.customer}</span>
                    </div>
                  )},
                  { label: 'Details', dataIndex: 'description', type: 'string', render: (v, row) => (
                    <div className="flex flex-col min-w-[150px] max-w-[200px]">
                      <span className="text-slate-800 font-bold text-sm truncate" title={v}>{v || '-'}</span>
                      <span className="inline-block mt-1.5 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-slate-200 w-fit truncate" title={row.dimension}>{row.dimension || '-'}</span>
                    </div>
                  )},
                  { label: 'Packing', dataIndex: 'packingSize', type: 'string', render: (v, row) => (
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-slate-700">{v}</span>
                      <span className="text-xs font-bold text-slate-500">{row.packingUom}</span>
                    </div>
                  )},
                  { label: 'Total Packed', dataIndex: 'totalPackedWeight', type: 'number', render: (v, row) => (
                    <div className="flex flex-col">
                      <span className="font-black text-emerald-700 text-base">{v.toFixed(1)} kg</span>
                      <span className="text-[10px] font-black uppercase text-slate-400 mt-0.5">Pallets: {row.totalPalletWeight.toFixed(1)} kg</span>
                    </div>
                  )},
                  { label: 'Pending', dataIndex: 'pendingDispatch', type: 'number', render: v => (
                    <span className={`font-black text-base ${v > 0 ? 'text-amber-600' : 'text-slate-400'}`}>{v.toFixed(1)} kg</span>
                  )}
                ]}
              />

              {/* Container Logistics Table */}
              <div className="mt-6 md:mt-8">
                <SortableTable 
                  title={t("Container Logistics")} 
                  data={dashboardData.containers || []}
                  rowsPerPage={3}
                  columns={[
                    { label: t("Customer"), dataIndex: 0, type: 'string', render: v => <span className="font-bold text-slate-800">{v || '-'}</span> },
                    { label: t("Container"), dataIndex: 1, type: 'string', render: v => <span className="font-black text-blue-700">{v || '-'}</span> },
                    { label: t("Arrival Date"), dataIndex: 2, type: 'string', render: v => <span className="text-slate-600 font-bold">{v ? (isNaN(new Date(v).getTime()) ? String(v) : new Date(v).toLocaleDateString('en-GB')) : '-'}</span> },
                    { label: t("Laden Date"), dataIndex: 3, type: 'string', render: v => <span className="text-slate-600 font-bold">{v ? (isNaN(new Date(v).getTime()) ? String(v) : new Date(v).toLocaleDateString('en-GB')) : '-'}</span> },
                    { label: t("ETD PK Date"), dataIndex: 4, type: 'string', render: v => <span className="text-slate-600 font-bold">{v ? (isNaN(new Date(v).getTime()) ? String(v) : new Date(v).toLocaleDateString('en-GB')) : '-'}</span> }
                  ]}
                />
              </div>
            </div>

            {/* Dispatch Submission Form (Sticky on Desktop) */}
            <section className="bg-white p-5 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col xl:sticky xl:top-24">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"><Truck size={22} className="text-blue-500"/> {t("Dispatch / Shipping")}</h3>
              <div className="space-y-5">
                <div className="min-w-0">
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t("Job Order No.")}</label>
                  <input type="text" name="jobOrder" value={formData.jobOrder} onChange={handleInputChange} required placeholder="e.g. 99-1" className={`w-full h-14 px-4 border rounded-xl focus:ring-2 outline-none uppercase font-black text-base transition-colors ${!isValidJo && isJoEntered ? 'border-red-400 focus:ring-blue-500 bg-red-50 text-red-900' : 'border-slate-300 focus:ring-blue-500 bg-slate-50 focus:bg-white text-slate-800'}`} list="jo-suggestions" />
                  {!isValidJo && isJoEntered && (
                    <p className="text-xs font-bold text-red-500 mt-2 flex items-center gap-1.5"><AlertTriangle size={14} /> {t("Invalid JO: Not found in Master List")}</p>
                  )}
                </div>
                <div className="min-w-0">
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t("Shipped Quantity (kg)")}</label>
                  <input type="number" step="0.01" name="dispatchQty" value={formData.dispatchQty} onChange={handleInputChange} className="w-full h-14 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-black text-xl text-blue-700" />
                </div>
                <div className="min-w-0">
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t("Delivery Order (DO) / Invoice No.")}</label>
                  <input type="text" name="deliveryOrderNo" value={formData.deliveryOrderNo} onChange={handleInputChange} className="w-full h-14 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-base" />
                </div>
              </div>
              
              <div className="pt-6 border-t border-slate-200 mt-6">
                <ImageUploadField preview={evidenceImagePreview} onFileChange={handleEvidenceImageChange} onClear={clearEvidenceImage} t={t} />
              </div>
            </section>
          </div>
        )}

        {department === 'Incoming Goods' && (
          <section className="bg-white p-5 md:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-4xl mx-auto">
            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"><ArrowDownToLine size={22} className="text-blue-500"/> {t("Raw Material Inwards")}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div className="min-w-0"><label className="block text-sm font-bold text-slate-700 mb-2">{t("Material Name / ID")}</label><input type="text" name="restockMaterial" value={formData.restockMaterial} onChange={handleInputChange} required className="w-full h-14 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-base uppercase" list="material-suggestions" /></div>
              <div className="min-w-0"><label className="block text-sm font-bold text-slate-700 mb-2">{t("Supplier Name")}</label><input type="text" name="supplier" value={formData.supplier} onChange={handleInputChange} className="w-full h-14 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-base uppercase" list="supplier-suggestions" /></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              <div className="min-w-0"><label className="block text-sm font-bold text-slate-700 mb-2">{t("PO No.")}</label><input type="text" name="poNumber" value={formData.poNumber} onChange={handleInputChange} className="w-full h-14 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-base uppercase" /></div>
              <div className="min-w-0"><label className="block text-sm font-bold text-slate-700 mb-2">{t("Location")}</label><input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full h-14 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold uppercase text-base" /></div>
              <div className="min-w-0">
                <label className="block text-sm font-bold text-slate-700 mb-2">{t("Condition")}</label>
                <select name="incomingQualityCheck" value={formData.incomingQualityCheck} onChange={handleInputChange} className="w-full h-14 px-4 border border-slate-300 rounded-xl outline-none bg-white font-bold text-base">
                  <option value="Pass">Pass</option><option value="Damaged">Damaged</option><option value="Contaminated">Contaminated</option>
                </select>
              </div>
            </div>

            {/* Batch Generator Section */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <h4 className="text-sm font-black text-slate-700 mb-4 tracking-wide">Pallet / Batch Generator</h4>
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="w-full sm:w-1/3">
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Amount Per Pallet (kg)</label>
                  <input type="number" step="0.01" name="restockAmount" value={formData.restockAmount} onChange={handleInputChange} className="w-full h-14 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-black text-xl text-blue-700" placeholder="e.g. 1250" />
                </div>
                <div className="w-full sm:w-1/3">
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">No. of Pallets</label>
                  <input type="number" value={quickPalletCount} onChange={e => setQuickPalletCount(e.target.value)} className="w-full h-14 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-black text-lg" min="1" />
                </div>
                <button type="button" onClick={handleAutoBatch} className="w-full sm:w-1/3 h-14 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all shadow-md active:scale-95 text-base">Generate Batches</button>
              </div>

              {/* List of generated batches */}
              {(formData.incomingBatches && formData.incomingBatches.length > 0) && (
                <div className="mt-6 space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                  {formData.incomingBatches.map((batch, idx) => (
                     <div key={batch.id} className="flex justify-between items-center bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200 shadow-sm gap-2">
                       <div className="flex items-center gap-2 flex-1 min-w-0">
                         <span className="text-[11px] font-black uppercase text-slate-400 w-6 shrink-0">{idx + 1}</span>
                         <input type="text" value={batch.batchNo} onChange={e => updateIncomingBatchNo(batch.id, e.target.value)} className="w-full sm:w-48 h-10 px-3 border border-slate-300 rounded-lg outline-none text-sm font-bold uppercase bg-slate-50 focus:bg-white" />
                       </div>
                       <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                         <InlineEdit value={batch.amount} onSave={val => updateIncomingBatchAmount(batch.id, val)} suffix="kg" className="text-blue-700" />
                         <button type="button" onClick={() => removeIncomingBatch(batch.id)} className="text-slate-300 hover:text-red-500 p-2 bg-slate-50 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16}/></button>
                       </div>
                     </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="pt-6 border-t border-slate-200 mt-6">
              <ImageUploadField preview={evidenceImagePreview} onFileChange={handleEvidenceImageChange} onClear={clearEvidenceImage} t={t} />
            </div>
          </section>
        )}

        {department === 'Purchase Requisition' && (
          <section className="bg-white p-5 md:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-4xl mx-auto">
            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"><ShoppingCart size={22} className="text-amber-500"/> {t("Purchase Requisition")}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div className="min-w-0">
                <label className="block text-sm font-bold text-slate-700 mb-2">{t("Item Name")}</label>
                <input type="text" name="reqItemName" value={formData.reqItemName} onChange={handleInputChange} required className="w-full h-14 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-bold text-base uppercase" placeholder="e.g. PACKING TAPE" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1 min-w-0">
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t("Quantity")}</label>
                  <input type="number" step="0.01" name="reqQuantity" value={formData.reqQuantity} onChange={handleInputChange} required className="w-full h-14 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-black text-base" />
                </div>
                <div className="w-28 shrink-0">
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t("UoM")}</label>
                  <input type="text" name="reqUom" value={formData.reqUom} onChange={handleInputChange} required className="w-full h-14 px-4 border border-slate-300 rounded-xl outline-none font-bold text-base" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div className="min-w-0">
                <label className="block text-sm font-bold text-slate-700 mb-2">{t("Current Stock")}</label>
                <input type="number" step="0.01" name="reqCurrentStock" value={formData.reqCurrentStock} onChange={handleInputChange} className="w-full h-14 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-bold text-base" />
              </div>
              <div className="min-w-0">
                <label className="block text-sm font-bold text-slate-700 mb-2">{t("Remarks")}</label>
                <input type="text" name="reqRemarks" value={formData.reqRemarks} onChange={handleInputChange} className="w-full h-14 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-base" placeholder="Optional notes..." />
              </div>
            </div>
          </section>
        )}

        {department === 'Quality Control' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8 items-start w-full">
            <section className="bg-white p-5 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"><CheckCircle size={22} className="text-emerald-500"/> {t("Quality Control Assessment")}</h3>
              
              <div className="mb-6 bg-slate-50 p-1.5 rounded-xl flex">
                {['Product / Film', 'Machine Inspection'].map(form => (
                  <button key={form} type="button" onClick={() => handleQcFormSwitch(form === 'Product / Film' ? 'product' : 'machine')} className={`flex-1 py-3 px-4 text-sm font-black rounded-lg transition-all ${qcActiveForm === (form === 'Product / Film' ? 'product' : 'machine') ? 'bg-white shadow text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}>
                    {t(form)}
                  </button>
                ))}
              </div>

              {qcActiveForm === 'product' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div className="min-w-0"><label className="block text-sm font-bold text-slate-700 mb-2">{t("Job Order No. (Under Inspection)")}</label><input type="text" name="jobOrder" value={formData.jobOrder} onChange={handleInputChange} required className="w-full h-14 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase font-bold bg-white text-base" list="jo-suggestions" /></div>
                    <div className="min-w-0">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Stage</label>
                      <select value={qcStage} onChange={e => setQcStage(e.target.value)} className="w-full h-14 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold bg-white text-base">
                        <option value="Extrusion">{t("Extrusion")}</option><option value="Cutting">{t("Cutting")}</option><option value="Packing">{t("Packing")}</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                    {qcStage === 'Extrusion' && (
                      <>
                        <QCField label={t("Thickness Check (Microns)")} name="qcExtThickness" statusName="qcExtThicknessStatus" formData={formData} onChange={handleInputChange} placeholder="e.g. 0.040" t={t} />
                        <QCField label={t("Width Check (mm)")} name="qcExtWidth" statusName="qcExtWidthStatus" formData={formData} onChange={handleInputChange} placeholder="e.g. 500" t={t} />
                      </>
                    )}
                    {qcStage === 'Cutting' && (
                      <>
                        <QCField label={t("Seal Integrity Assessment")} name="qcCutSeal" statusName="qcCutSealStatus" formData={formData} onChange={handleInputChange} placeholder="e.g. Intact / Broken" t={t} />
                        <QCField label={t("Length Check (mm)")} name="qcCutLength" statusName="qcCutLengthStatus" formData={formData} onChange={handleInputChange} placeholder="e.g. 800" t={t} />
                      </>
                    )}
                    {qcStage === 'Packing' && (
                      <>
                        <QCField label={t("Packing Size (Bag Weight - kg)")} name="qcPackBagWeight" statusName="qcPackBagWeightStatus" formData={formData} onChange={handleInputChange} placeholder="e.g. 25.00" t={t} />
                        <QCField label={t("Quantity Check (Bags per Pallet)")} name="qcPackBagsPerPallet" statusName="qcPackBagsPerPalletStatus" formData={formData} onChange={handleInputChange} placeholder="e.g. 40" t={t} />
                        <QCField label={t("Total Bags Verified")} name="qcPackTotalBags" statusName="qcPackTotalBagsStatus" formData={formData} onChange={handleInputChange} placeholder="e.g. 120" t={t} />
                        <QCField label={t("Total Pallets Counted")} name="qcPackTotalPallets" statusName="qcPackTotalPalletsStatus" formData={formData} onChange={handleInputChange} placeholder="e.g. 3" t={t} />
                      </>
                    )}
                  </div>
                </div>
              )}

              {qcActiveForm === 'machine' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div className="min-w-0">
                      <label className="block text-sm font-bold text-slate-700 mb-2">{t("Machine Type")}</label>
                      <select name="qcMachineType" value={formData.qcMachineType} onChange={(e) => { handleInputChange(e); setFormData(prev => ({...prev, machineId: ''})); }} className="w-full h-14 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold bg-white text-base">
                        <option value="Extrusion">{t("Extrusion")}</option><option value="Cutting">{t("Cutting")}</option>
                      </select>
                    </div>
                    <div className="min-w-0">
                      <label className="block text-sm font-bold text-slate-700 mb-2">{t("Machine No.")}</label>
                      <select name="machineId" value={formData.machineId} onChange={handleInputChange} required className="w-full h-14 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase font-bold bg-white text-base">
                        <option value="" disabled>{t("Select Machine")}</option>
                        {formData.qcMachineType === 'Extrusion' 
                          ? ['B1','B2','B3','B4','B5','B6','B7','B8','B9'].map(m => <option key={m} value={m}>{m}</option>)
                          : ['C1','C2','C3','C4','C5','C6','C7','C8'].map(m => <option key={m} value={m}>{m}</option>)
                        }
                      </select>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                    {formData.qcMachineType === 'Extrusion' ? (
                      <>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="flex-1"><label className="block text-sm font-bold text-slate-700 mb-2">{t("Filter Status")}</label><select name="qcExtFilter" value={formData.qcExtFilter} onChange={handleInputChange} className="w-full h-12 px-3 border border-slate-300 rounded-lg outline-none font-bold text-base"><option value="Good">{t("Good")}</option><option value="Needs Change">{t("Needs Change")}</option><option value="Changed">{t("Changed")}</option></select></div>
                          <div className="flex-1"><label className="block text-sm font-bold text-slate-700 mb-2">{t("Scrap Purged")}</label><select name="qcExtPurged" value={formData.qcExtPurged} onChange={handleInputChange} className="w-full h-12 px-3 border border-slate-300 rounded-lg outline-none font-bold text-base"><option value="Yes">{t("Yes")}</option><option value="No">{t("No")}</option></select></div>
                        </div>
                      </>
                    ) : (
                      <>
                        <QCField label={t("Sealing Temperature (℃)")} name="qcCutTemp" statusName="qcCutTempStatus" formData={formData} onChange={handleInputChange} placeholder="e.g. 180" t={t} />
                        <QCField label={t("Blade / Thickness Check")} name="qcCutMachineThickness" statusName="qcCutMachineThicknessStatus" formData={formData} onChange={handleInputChange} placeholder="e.g. Sharp / Blunt" t={t} />
                      </>
                    )}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200 mt-4">
                        <div className="flex-1"><label className="block text-sm font-bold text-slate-700 mb-2">{t("Machine Cleanliness")}</label><select name="qcMachineCleanliness" value={formData.qcMachineCleanliness} onChange={handleInputChange} className="w-full h-12 px-3 border border-slate-300 rounded-lg outline-none font-bold text-base"><option value="Pass">{t("Pass")}</option><option value="Fail">{t("Fail")}</option></select></div>
                        <div className="flex-1"><label className="block text-sm font-bold text-slate-700 mb-2">{t("Safety Guards")}</label><select name="qcMachineSafety" value={formData.qcMachineSafety} onChange={handleInputChange} className="w-full h-12 px-3 border border-slate-300 rounded-lg outline-none font-bold text-base"><option value="Pass">{t("Pass")}</option><option value="Fail">{t("Fail")}</option><option value="N/A">{t("N/A")}</option></select></div>
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section className="bg-white p-5 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col h-full xl:sticky xl:top-24">
              <div className="min-w-0 mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">{t("Overall QC Remarks / Issues Noted")}</label>
                <textarea name="qcNotes" value={formData.qcNotes} onChange={handleInputChange} rows="4" className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-base resize-none" placeholder="Include any specific details or required actions..."></textarea>
              </div>
              <div className="mt-auto">
                <ImageUploadField preview={evidenceImagePreview} onFileChange={handleEvidenceImageChange} onClear={clearEvidenceImage} t={t} />
              </div>
            </section>
          </div>
        )}

      </form>
    </>
  );
};

export default ProductionFormView;