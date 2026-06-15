import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Settings, 
  Box, 
  AlertTriangle, 
  Clock, 
  Save,
  Printer,
  Scale,
  Package,
  Truck,
  ArrowDownToLine,
  PlusCircle,
  Trash2,
  CheckCircle,
  BarChart3,
  Activity,
  RefreshCw,
  Flag,
  TrendingUp,
  X
} from 'lucide-react';

// Reusable component for the new QC Data + Status rows
const QCField = ({ label, name, statusName, formData, onChange, placeholder }) => (
  <div className="flex flex-col sm:flex-row sm:items-end gap-3 p-3 bg-white rounded-md border border-slate-200">
    <div className="flex-1">
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input
        type="text"
        name={name}
        value={formData[name]}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
    <div className="w-full sm:w-32">
      <label className="block text-sm font-medium text-slate-700 mb-1 sm:hidden">Status</label>
      <select
        name={statusName}
        value={formData[statusName]}
        onChange={onChange}
        className="w-full p-2 border border-slate-300 rounded text-sm focus:outline-none font-medium"
      >
        <option className="text-green-600" value="Pass">Pass</option>
        <option className="text-red-600" value="Fail">Fail</option>
        <option className="text-slate-400" value="N/A">N/A</option>
      </select>
    </div>
  </div>
);

const getInitialFormData = () => ({
  date: new Date().toISOString().split('T')[0],
  shift: 'AM', 
  supervisor: '',
  machineId: '',
  jobOrder: '',
  inputRollWeight: '',
  extrusionMaterials: [{ id: Date.now(), batchNo: '', quantity: '' }],
  actualOutput: '',
  uom: 'kg',
  setupScrap: '',
  processScrap: '',
  rejections: '',
  plannedDowntime: '',
  unplannedDowntime: '',
  downtimeReason: '',
  discrepancyReason: '',
  packingSize: '',
  packingUom: 'kg/bag',
  quantityPacked: '',
  palletWeight: '',
  bagWeights: [{ id: Date.now(), weight: '' }],
  dispatchQty: '',
  deliveryOrderNo: '',
  restockMaterial: '',
  restockAmount: '',
  supplier: '',
  poNumber: '',
  batchNumber: '',
  location: '',
  incomingQualityCheck: 'Pass',
  qcNotes: '',
  qcExtThickness: '', qcExtThicknessStatus: 'Pass',
  qcExtWidth: '', qcExtWidthStatus: 'Pass',
  qcCutSeal: '', qcCutSealStatus: 'Pass',
  qcCutLength: '', qcCutLengthStatus: 'Pass',
  qcPackBagWeight: '', qcPackBagWeightStatus: 'Pass',
  qcPackBagsPerPallet: '', qcPackBagsPerPalletStatus: 'Pass',
  qcPackTotalBags: '', qcPackTotalBagsStatus: 'Pass',
  qcPackTotalPallets: '', qcPackTotalPalletsStatus: 'Pass'
});

const App = () => {
  const [department, setDepartment] = useState('Dashboard'); 
  const [qcStage, setQcStage] = useState('Extrusion'); 
  const [formData, setFormData] = useState(getInitialFormData());

  // Dashboard & Analytics State
  const [analyticsPeriod, setAnalyticsPeriod] = useState('daily');
  const [dashboardData, setDashboardData] = useState({ 
    extrusion: [], cutting: [], packing: [], dispatch: [], incoming: [], qc: [],
    analytics: { 
      daily: { output: 0, consumption: 0, wastage: 0 }, 
      weekly: { output: 0, consumption: 0, wastage: 0 }, 
      monthly: { output: 0, consumption: 0, wastage: 0 }, 
      yearly: { output: 0, consumption: 0, wastage: 0 } 
    }
  });
  const [isFetchingDashboard, setIsFetchingDashboard] = useState(false);
  const [dashboardError, setDashboardError] = useState(null);

  // Flag Modal State
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [isSubmittingFlag, setIsSubmittingFlag] = useState(false);
  const [flagData, setFlagData] = useState({ department: '', date: '', jobOrder: '', reason: '' });

  const [massBalance, setMassBalance] = useState({
    totalInput: 0, totalAccounted: 0, discrepancyKg: 0, discrepancyPercent: 0, isFailed: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // YOUR GOOGLE SCRIPT URL HERE
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwnRTSjS4L0q5x65fGZt4LJWzeyA_0EJf6tUPupYjuL_az9IeBpxSH4TTfeMibYf0BMxg/exec';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- Dynamic Array Handlers ---
  const handleMaterialChange = (id, field, value) => {
    setFormData(prev => ({ ...prev, extrusionMaterials: prev.extrusionMaterials.map(mat => mat.id === id ? { ...mat, [field]: value } : mat) }));
  };
  const addMaterialRow = () => setFormData(prev => ({ ...prev, extrusionMaterials: [...prev.extrusionMaterials, { id: Date.now(), batchNo: '', quantity: '' }] }));
  const removeMaterialRow = (id) => setFormData(prev => ({ ...prev, extrusionMaterials: prev.extrusionMaterials.filter(mat => mat.id !== id) }));
  
  const handleBagWeightChange = (id, value) => {
    setFormData(prev => ({ ...prev, bagWeights: prev.bagWeights.map(bag => bag.id === id ? { ...bag, weight: value } : bag) }));
  };
  const addBagWeightRow = () => setFormData(prev => ({ ...prev, bagWeights: [...prev.bagWeights, { id: Date.now(), weight: '' }] }));
  const removeBagWeightRow = (id) => setFormData(prev => ({ ...prev, bagWeights: prev.bagWeights.filter(bag => bag.id !== id) }));

  // --- Mass Balance ---
  useEffect(() => {
    if (!['Extrusion', 'Cutting'].includes(department)) {
      setMassBalance({ totalInput: 0, totalAccounted: 0, discrepancyKg: 0, discrepancyPercent: 0, isFailed: false });
      return;
    }
    let totalInput = department === 'Extrusion' 
      ? formData.extrusionMaterials.reduce((sum, mat) => sum + Number(mat.quantity || 0), 0)
      : Number(formData.inputRollWeight || 0);

    const outputWeight = formData.uom === 'kg' ? Number(formData.actualOutput || 0) : 0;
    const totalScrap = Number(formData.setupScrap || 0) + Number(formData.processScrap || 0) + Number(formData.rejections || 0);
    const totalAccounted = outputWeight + totalScrap;
    const discrepancyKg = totalInput - totalAccounted;
    const discrepancyPercent = totalInput > 0 ? (Math.abs(discrepancyKg) / totalInput) * 100 : 0;

    setMassBalance({ totalInput, totalAccounted, discrepancyKg, discrepancyPercent, isFailed: discrepancyPercent > 2.0 });
  }, [formData.extrusionMaterials, formData.inputRollWeight, formData.actualOutput, formData.setupScrap, formData.processScrap, formData.rejections, formData.uom, department]);

  // --- Dashboard Fetch Logic ---
  const fetchDashboardData = async () => {
    setIsFetchingDashboard(true);
    setDashboardError(null);
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, { method: "GET", redirect: "follow" });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (result.status === 'success') {
        setDashboardData(result.data);
      } else {
        setDashboardError(result.message || "Failed to parse data");
      }
    } catch (error) {
      console.error("Failed to fetch dashboard highlights:", error);
      setDashboardError("Failed to connect to Google Sheets. Ensure your Apps Script is deployed as a 'New Version' with 'Who has access' set to 'Anyone'.");
    } finally {
      setIsFetchingDashboard(false);
    }
  };

  useEffect(() => {
    if (department === 'Dashboard') fetchDashboardData();
  }, [department]);

  // --- Flag Logic ---
  const openFlagModal = (dept, date, jobOrder) => {
    setFlagData({ department: dept, date: new Date(date).toLocaleDateString('en-GB'), jobOrder: jobOrder || 'N/A', reason: '' });
    setIsFlagModalOpen(true);
  };

  const handleFlagSubmit = async () => {
    if (!flagData.reason) return alert("Please provide a reason for flagging this record.");
    setIsSubmittingFlag(true);
    try {
      const payload = {
        action: 'flag',
        flagDepartment: flagData.department,
        flagDate: flagData.date,
        flagJobOrder: flagData.jobOrder,
        flagReason: flagData.reason
      };
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload),
      });
      alert("Flag successfully raised to management.");
      setIsFlagModalOpen(false);
    } catch (error) {
      alert("Network error: Could not submit flag.");
    } finally {
      setIsSubmittingFlag(false);
    }
  };

  const handlePrint = () => window.print();

  const handleSave = async (e) => {
    e.preventDefault();
    if ((department === 'Extrusion' || department === 'Cutting') && massBalance.isFailed && !formData.discrepancyReason) {
      alert("Mass balance failed. You must provide a reason for the discrepancy before saving.");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = { ...formData, department, massDiscrepancyKg: massBalance.discrepancyKg, massDiscrepancyPercent: massBalance.discrepancyPercent };
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload),
      });
      alert(`Report saved successfully! [Department: ${department}]`);
      setFormData(getInitialFormData());
    } catch (error) {
      alert("Network error: Could not connect to the database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentAnalytics = dashboardData.analytics[analyticsPeriod] || { output: 0, consumption: 0, wastage: 0 };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans text-slate-800">
      
      {/* --- FLAG MODAL --- */}
      {isFlagModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2 text-amber-600">
                <Flag size={20} className="fill-amber-600" />
                <h3 className="font-bold">Flag Record Error</h3>
              </div>
              <button onClick={() => setIsFlagModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600">You are flagging a potential error in a recorded log. Management will review this record.</p>
              <div className="bg-slate-100 p-3 rounded-md text-sm text-slate-700 grid grid-cols-2 gap-2">
                <div><span className="font-semibold block text-xs uppercase opacity-70">Department</span> {flagData.department}</div>
                <div><span className="font-semibold block text-xs uppercase opacity-70">Date</span> {flagData.date}</div>
                <div className="col-span-2"><span className="font-semibold block text-xs uppercase opacity-70">Job Order</span> {flagData.jobOrder}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Flagging</label>
                <textarea 
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  rows="3"
                  placeholder="E.g., I accidentally typed 500kg instead of 50kg..."
                  value={flagData.reason}
                  onChange={(e) => setFlagData({...flagData, reason: e.target.value})}
                ></textarea>
              </div>
              <button 
                onClick={handleFlagSubmit}
                disabled={isSubmittingFlag}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {isSubmittingFlag ? 'Submitting Flag...' : 'Submit Error Flag'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        
        {/* Header & Department Toggle */}
        <div className="bg-slate-800 text-white p-6 print:bg-white print:text-slate-800 print:border-b">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Daily Production Report</h1>
              <p className="text-slate-300 print:text-slate-500 mt-1">Operational Log & Analytics</p>
            </div>
            <div className="flex gap-3 print:hidden mt-4 md:mt-0">
              <button type="button" onClick={handlePrint} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <Printer size={16} /> Print
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 bg-slate-900 rounded-lg p-1 print:hidden w-full">
            {['Dashboard', 'Extrusion', 'Cutting', 'Packing', 'Dispatch', 'Quality Control', 'Incoming Goods'].map((dept) => (
              <button 
                key={dept}
                type="button"
                onClick={() => setDepartment(dept)}
                className={`py-2 px-1 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-1 ${department === dept ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              >
                {dept === 'Dashboard' && <BarChart3 size={14} />}
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* ================= DASHBOARD VIEW ================= */}
        {department === 'Dashboard' && (
          <div className="p-6 md:p-8 bg-slate-50 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div className="flex items-center gap-2 text-slate-800">
                <Activity className="text-blue-600" />
                <h2 className="text-xl font-bold">Factory Operations Overview</h2>
              </div>
              <button 
                onClick={fetchDashboardData} 
                disabled={isFetchingDashboard}
                className="flex items-center gap-2 text-sm bg-white border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors shadow-sm"
              >
                <RefreshCw size={14} className={isFetchingDashboard ? 'animate-spin' : ''} /> 
                {isFetchingDashboard ? 'Refreshing...' : 'Refresh Data'}
              </button>
            </div>

            {dashboardError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
                <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="font-semibold text-sm">Connection Error</p>
                  <p className="text-sm mt-1">{dashboardError}</p>
                </div>
              </div>
            )}

            {/* --- ANALYTICS CARDS --- */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-100 pb-4">
                <h3 className="font-semibold text-slate-700 flex items-center gap-2"><TrendingUp size={18} className="text-blue-600"/> Extrusion Analytics</h3>
                
                {/* Period Toggle */}
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  {['daily', 'weekly', 'monthly', 'yearly'].map(period => (
                    <button 
                      key={period} 
                      onClick={() => setAnalyticsPeriod(period)}
                      className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-all ${analyticsPeriod === period ? 'bg-white shadow-sm text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50/50 p-5 rounded-lg border border-blue-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Total Output ({analyticsPeriod})</p>
                    <p className="text-3xl font-bold text-slate-800">{currentAnalytics.output.toFixed(2)} <span className="text-base font-normal text-slate-500">kg</span></p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full text-blue-600"><Package size={24} /></div>
                </div>
                <div className="bg-emerald-50/50 p-5 rounded-lg border border-emerald-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Material Consumed ({analyticsPeriod})</p>
                    <p className="text-3xl font-bold text-slate-800">{currentAnalytics.consumption.toFixed(2)} <span className="text-base font-normal text-slate-500">kg</span></p>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-full text-emerald-600"><Box size={24} /></div>
                </div>
                <div className="bg-rose-50/50 p-5 rounded-lg border border-rose-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Scrap / Wastage ({analyticsPeriod})</p>
                    <p className="text-3xl font-bold text-slate-800">{currentAnalytics.wastage.toFixed(2)} <span className="text-base font-normal text-slate-500">kg</span></p>
                  </div>
                  <div className="p-3 bg-rose-100 rounded-full text-rose-600"><Trash2 size={24} /></div>
                </div>
              </div>
            </div>

            {/* --- RECENT LOGS TABLES --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Extrusion */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-200"><h3 className="font-semibold text-slate-700">Latest Extrusion Runs</h3></div>
                <div className="overflow-x-auto p-2">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 bg-slate-100 uppercase">
                      <tr><th className="px-3 py-2 rounded-tl-lg">Date</th><th className="px-3 py-2">Job Order</th><th className="px-3 py-2">Output</th><th className="px-3 py-2 rounded-tr-lg text-center">Action</th></tr>
                    </thead>
                    <tbody>
                      {dashboardData.extrusion.length > 0 ? dashboardData.extrusion.map((row, i) => (
                        <tr key={i} className="border-b last:border-0 hover:bg-slate-50">
                          <td className="px-3 py-2 whitespace-nowrap">{new Date(row[1]).toLocaleDateString('en-GB')}</td>
                          <td className="px-3 py-2 font-medium">{row[3]}</td><td className="px-3 py-2">{row[6]} kg</td>
                          <td className="px-3 py-2 text-center"><button onClick={() => openFlagModal('Extrusion', row[1], row[3])} className="text-slate-400 hover:text-amber-600" title="Flag Error"><Flag size={16}/></button></td>
                        </tr>
                      )) : <tr><td colSpan="4" className="text-center py-4 text-slate-400">No data found.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cutting */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-200"><h3 className="font-semibold text-slate-700">Latest Cutting Logs</h3></div>
                <div className="overflow-x-auto p-2">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 bg-slate-100 uppercase">
                      <tr><th className="px-3 py-2 rounded-tl-lg">Date</th><th className="px-3 py-2">Job Order</th><th className="px-3 py-2">Output</th><th className="px-3 py-2 rounded-tr-lg text-center">Action</th></tr>
                    </thead>
                    <tbody>
                      {dashboardData.cutting.length > 0 ? dashboardData.cutting.map((row, i) => (
                        <tr key={i} className="border-b last:border-0 hover:bg-slate-50">
                          <td className="px-3 py-2 whitespace-nowrap">{new Date(row[1]).toLocaleDateString('en-GB')}</td>
                          <td className="px-3 py-2 font-medium">{row[3]}</td><td className="px-3 py-2">{row[6]} kg</td>
                          <td className="px-3 py-2 text-center"><button onClick={() => openFlagModal('Cutting', row[1], row[3])} className="text-slate-400 hover:text-amber-600" title="Flag Error"><Flag size={16}/></button></td>
                        </tr>
                      )) : <tr><td colSpan="4" className="text-center py-4 text-slate-400">No data found.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Packing */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-200"><h3 className="font-semibold text-slate-700">Latest Packing Logs</h3></div>
                <div className="overflow-x-auto p-2">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 bg-slate-100 uppercase">
                      <tr><th className="px-3 py-2 rounded-tl-lg">Date</th><th className="px-3 py-2">Job Order</th><th className="px-3 py-2">Total Qty</th><th className="px-3 py-2 rounded-tr-lg text-center">Action</th></tr>
                    </thead>
                    <tbody>
                      {dashboardData.packing.length > 0 ? dashboardData.packing.map((row, i) => (
                        <tr key={i} className="border-b last:border-0 hover:bg-slate-50">
                          <td className="px-3 py-2 whitespace-nowrap">{new Date(row[1]).toLocaleDateString('en-GB')}</td>
                          <td className="px-3 py-2 font-medium">{row[3]}</td><td className="px-3 py-2 font-semibold">{row[6]}</td>
                          <td className="px-3 py-2 text-center"><button onClick={() => openFlagModal('Packing', row[1], row[3])} className="text-slate-400 hover:text-amber-600" title="Flag Error"><Flag size={16}/></button></td>
                        </tr>
                      )) : <tr><td colSpan="4" className="text-center py-4 text-slate-400">No data found.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Dispatch */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-200"><h3 className="font-semibold text-slate-700">Latest Dispatch Records</h3></div>
                <div className="overflow-x-auto p-2">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 bg-slate-100 uppercase">
                      <tr><th className="px-3 py-2 rounded-tl-lg">Date</th><th className="px-3 py-2">Job Order</th><th className="px-3 py-2">DO No.</th><th className="px-3 py-2">Qty (kg)</th><th className="px-3 py-2 rounded-tr-lg text-center">Action</th></tr>
                    </thead>
                    <tbody>
                      {dashboardData.dispatch.length > 0 ? dashboardData.dispatch.map((row, i) => (
                        <tr key={i} className="border-b last:border-0 hover:bg-slate-50">
                          <td className="px-3 py-2 whitespace-nowrap">{new Date(row[1]).toLocaleDateString('en-GB')}</td>
                          <td className="px-3 py-2 font-medium">{row[2]}</td><td className="px-3 py-2 text-slate-500">{row[4]}</td><td className="px-3 py-2 font-semibold">{row[3]}</td>
                          <td className="px-3 py-2 text-center"><button onClick={() => openFlagModal('Dispatch', row[1], row[2])} className="text-slate-400 hover:text-amber-600" title="Flag Error"><Flag size={16}/></button></td>
                        </tr>
                      )) : <tr><td colSpan="5" className="text-center py-4 text-slate-400">No data found.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Incoming Goods */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-200"><h3 className="font-semibold text-slate-700">Recent Incoming Materials</h3></div>
                <div className="overflow-x-auto p-2">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 bg-slate-100 uppercase">
                      <tr><th className="px-3 py-2 rounded-tl-lg">Date</th><th className="px-3 py-2">Material</th><th className="px-3 py-2">Amount (kg)</th><th className="px-3 py-2 rounded-tr-lg text-center">Action</th></tr>
                    </thead>
                    <tbody>
                      {dashboardData.incoming.length > 0 ? dashboardData.incoming.map((row, i) => (
                        <tr key={i} className="border-b last:border-0 hover:bg-slate-50">
                          <td className="px-3 py-2 whitespace-nowrap">{new Date(row[1]).toLocaleDateString('en-GB')}</td>
                          <td className="px-3 py-2 font-medium">{row[2]}</td><td className="px-3 py-2 font-semibold text-blue-700">{row[3]}</td>
                          <td className="px-3 py-2 text-center"><button onClick={() => openFlagModal('Incoming Goods', row[1], row[2])} className="text-slate-400 hover:text-amber-600" title="Flag Error"><Flag size={16}/></button></td>
                        </tr>
                      )) : <tr><td colSpan="4" className="text-center py-4 text-slate-400">No data found.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quality Control */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-200"><h3 className="font-semibold text-slate-700">Quality Control Logs</h3></div>
                <div className="overflow-x-auto p-2">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 bg-slate-100 uppercase">
                      <tr><th className="px-3 py-2 rounded-tl-lg">Date</th><th className="px-3 py-2">Stage</th><th className="px-3 py-2">Job Order</th><th className="px-3 py-2 rounded-tr-lg text-center">Action</th></tr>
                    </thead>
                    <tbody>
                      {dashboardData.qc.length > 0 ? dashboardData.qc.map((row, i) => (
                        <tr key={i} className="border-b last:border-0 hover:bg-slate-50">
                          <td className="px-3 py-2 whitespace-nowrap">{new Date(row[1]).toLocaleDateString('en-GB')}</td>
                          <td className="px-3 py-2 text-blue-700 font-medium">{row[7] || 'General'}</td><td className="px-3 py-2">{row[3]}</td>
                          <td className="px-3 py-2 text-center"><button onClick={() => openFlagModal('Quality Control', row[1], row[3])} className="text-slate-400 hover:text-amber-600" title="Flag Error"><Flag size={16}/></button></td>
                        </tr>
                      )) : <tr><td colSpan="4" className="text-center py-4 text-slate-400">No data found.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= DATA ENTRY FORMS ================= */}
        {department !== 'Dashboard' && (
          <form className="p-6 md:p-8 space-y-8" onSubmit={handleSave}>
            
            {/* Section 1: Session Details */}
            <section className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-slate-700">
                <ClipboardList className="text-blue-600" />
                <h2 className="text-lg font-semibold">Session Parameters</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Date</label>
                  <input type="date" name="date" value={formData.date} onChange={handleInputChange} required className="w-full h-[42px] px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                </div>
                
                {department !== 'Incoming Goods' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Shift</label>
                    <select name="shift" value={formData.shift} onChange={handleInputChange} className="w-full h-[42px] px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                      <option value="AM">Morning (AM)</option>
                      <option value="PM">Night (PM)</option>
                    </select>
                  </div>
                )}

                <div className={department === 'Incoming Goods' ? 'md:col-span-3' : ''}>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    {department === 'Incoming Goods' ? 'Receiver / Admin Name' : 
                     department === 'Quality Control' ? 'QC Inspector' : 
                     'Operator / Supervisor'}
                  </label>
                  <input type="text" name="supervisor" value={formData.supervisor} onChange={handleInputChange} required placeholder="e.g. John Doe" className="w-full h-[42px] px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                </div>

                {(department === 'Extrusion' || department === 'Cutting' || department === 'Quality Control') && (
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Machine No. (Optional for QC)</label>
                    <input type="text" name="machineId" value={formData.machineId} onChange={handleInputChange} required={department !== 'Quality Control'} placeholder={department === 'Extrusion' ? "EXT-01" : department === 'Cutting' ? "CUT-01" : "e.g. EXT-01"} className="w-full h-[42px] px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                  </div>
                )}
              </div>
            </section>

            {/* MANUFACTURING DEPARTMENTS (Extrusion & Cutting) */}
            {(department === 'Extrusion' || department === 'Cutting') && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Material Inputs */}
                <section className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 text-slate-700">
                    <Box className="text-blue-600" />
                    <h2 className="text-lg font-semibold">Material Inputs</h2>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-600 mb-1">Job Order No.</label>
                    <input type="text" name="jobOrder" value={formData.jobOrder} onChange={handleInputChange} required placeholder="WO-12345" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                  </div>

                  {department === 'Extrusion' ? (
                    <div className="space-y-4">
                      {formData.extrusionMaterials.map((mat, index) => (
                        <div key={mat.id} className="flex gap-4 items-end relative">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-600 mb-1">Batch No. {index + 1}</label>
                            <input 
                              type="text" 
                              value={mat.batchNo} 
                              onChange={(e) => handleMaterialChange(mat.id, 'batchNo', e.target.value)} 
                              placeholder="e.g. B-1029" 
                              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" 
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-600 mb-1">Quantity (kg)</label>
                            <input 
                              type="number" 
                              step="0.01" 
                              value={mat.quantity} 
                              onChange={(e) => handleMaterialChange(mat.id, 'quantity', e.target.value)} 
                              placeholder="0.00" 
                              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" 
                            />
                          </div>
                          {formData.extrusionMaterials.length > 1 && (
                            <button 
                              type="button" 
                              onClick={() => removeMaterialRow(mat.id)} 
                              className="p-2 mb-0.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Remove Material"
                            >
                              <Trash2 size={20} />
                            </button>
                          )}
                        </div>
                      ))}
                      
                      <button 
                        type="button" 
                        onClick={addMaterialRow} 
                        className="mt-2 flex items-center gap-2 text-sm text-blue-600 font-medium hover:text-blue-800 transition-colors"
                      >
                        <PlusCircle size={18} /> Add Another Material
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Input Roll Weight (kg)</label>
                        <input type="number" step="0.01" name="inputRollWeight" value={formData.inputRollWeight} onChange={handleInputChange} placeholder="0.00" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                      </div>
                    </div>
                  )}
                </section>

                {/* Output & Scrap */}
                <section className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="flex items-center gap-2 mb-4 text-slate-700">
                    <Settings className="text-blue-600" />
                    <h2 className="text-lg font-semibold">Production Output & Scrap</h2>
                  </div>
                  
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-600 mb-1">Actual Good Output</label>
                      <input type="number" step="0.01" name="actualOutput" value={formData.actualOutput} onChange={handleInputChange} required placeholder="0.00" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-lg font-bold text-green-700" />
                    </div>
                    <div className="w-24">
                      <label className="block text-sm font-medium text-slate-600 mb-1">UoM</label>
                      <select name="uom" value={formData.uom} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                        <option value="kg">kg</option>
                        <option value="pcs">pcs</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Setup Scrap (kg) - Purging/Colour Change</label>
                      <input type="number" step="0.01" name="setupScrap" value={formData.setupScrap} onChange={handleInputChange} placeholder="0.00" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Process Scrap (kg) - Trims/Tears</label>
                      <input type="number" step="0.01" name="processScrap" value={formData.processScrap} onChange={handleInputChange} placeholder="0.00" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* PACKING DEPARTMENT */}
            {department === 'Packing' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                <section className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 text-slate-700">
                    <Package className="text-blue-600" />
                    <h2 className="text-lg font-semibold">Finished Goods Packing</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-600 mb-1">Job Order No.</label>
                      <input type="text" name="jobOrder" value={formData.jobOrder} onChange={handleInputChange} required placeholder="WO-12345" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-600 mb-1">Packing Size</label>
                        <input type="number" step="0.01" name="packingSize" value={formData.packingSize} onChange={handleInputChange} placeholder="e.g. 25.00" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                      </div>
                      <div className="w-28">
                        <label className="block text-sm font-medium text-slate-600 mb-1">UoM</label>
                        <select name="packingUom" value={formData.packingUom} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                          <option value="kg/bag">kg/bag</option>
                          <option value="pcs/bag">pcs/bag</option>
                          <option value="kg/roll">kg/roll</option>
                          <option value="kg/carton">kg/carton</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Quantity Packed</label>
                      <input type="number" name="quantityPacked" value={formData.quantityPacked} onChange={handleInputChange} placeholder="e.g. 10" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                    </div>
                  </div>
                  
                  {(formData.packingSize && formData.quantityPacked) ? (
                    <div className="pt-3 border-t border-slate-200 mt-4">
                      <p className="text-sm text-slate-500">Standardised Total: <strong className="text-slate-800">{(Number(formData.packingSize) * Number(formData.quantityPacked)).toFixed(2)} {formData.packingUom.split('/')[0]}</strong></p>
                    </div>
                  ) : null}
                </section>

                <section className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 text-slate-700">
                    <Scale className="text-blue-600" />
                    <h2 className="text-lg font-semibold">Palletisation Details</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-600 mb-1">Pallet Weight (kg) [Tare/Gross]</label>
                      <input type="number" step="0.01" name="palletWeight" value={formData.palletWeight} onChange={handleInputChange} placeholder="e.g. 15.00" className="w-full md:w-1/2 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                    </div>

                    <div className="pt-4 border-t border-slate-200">
                      <h3 className="text-sm font-semibold text-slate-600 mb-3">Individual Bag/Carton Weights (kg)</h3>
                      {formData.bagWeights.map((bag, index) => (
                        <div key={bag.id} className="flex gap-4 items-end mb-3">
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-slate-500 mb-1">Bag {index + 1}</label>
                            <input 
                              type="number" 
                              step="0.01" 
                              value={bag.weight} 
                              onChange={(e) => handleBagWeightChange(bag.id, e.target.value)} 
                              placeholder="e.g. 25.00" 
                              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" 
                            />
                          </div>
                          {formData.bagWeights.length > 1 && (
                            <button 
                              type="button" 
                              onClick={() => removeBagWeightRow(bag.id)} 
                              className="p-2 mb-0.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Remove Bag"
                            >
                              <Trash2 size={20} />
                            </button>
                          )}
                        </div>
                      ))}
                      
                      <button 
                        type="button" 
                        onClick={addBagWeightRow} 
                        className="mt-1 flex items-center gap-2 text-sm text-blue-600 font-medium hover:text-blue-800 transition-colors"
                      >
                        <PlusCircle size={18} /> Add Another Bag
                      </button>
                    </div>

                    <div className="pt-4 mt-2">
                      <p className="text-sm text-slate-500">Actual Bag Weight submitted: <strong className="text-slate-800">
                        {formData.bagWeights.reduce((sum, bag) => sum + Number(bag.weight || 0), 0).toFixed(2)} kg
                      </strong></p>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* DISPATCH DEPARTMENT */}
            {department === 'Dispatch' && (
              <section className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
                <div className="flex items-center gap-2 mb-4 text-slate-700">
                  <Truck className="text-blue-600" />
                  <h2 className="text-lg font-semibold">Dispatch / Shipping</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Job Order No.</label>
                    <input type="text" name="jobOrder" value={formData.jobOrder} onChange={handleInputChange} required placeholder="WO-12345" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Shipped Quantity (kg)</label>
                      <input type="number" step="0.01" name="dispatchQty" value={formData.dispatchQty} onChange={handleInputChange} placeholder="0.00" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Delivery Order (DO) / Invoice No.</label>
                      <input type="text" name="deliveryOrderNo" value={formData.deliveryOrderNo} onChange={handleInputChange} placeholder="e.g. DO-99812" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* INCOMING GOODS DEPARTMENT */}
            {department === 'Incoming Goods' && (
              <section className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
                <div className="flex items-center gap-2 mb-4 text-slate-700">
                  <ArrowDownToLine className="text-blue-600" />
                  <h2 className="text-lg font-semibold">Raw Material Inwards</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Material Name / ID</label>
                      <input type="text" name="restockMaterial" value={formData.restockMaterial} onChange={handleInputChange} required placeholder="e.g. LLDPE-1002" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Incoming / Received Amount (kg)</label>
                      <input type="number" step="0.01" name="restockAmount" value={formData.restockAmount} onChange={handleInputChange} required placeholder="0.00" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-lg font-bold text-blue-700" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Supplier Name</label>
                      <input type="text" name="supplier" value={formData.supplier} onChange={handleInputChange} placeholder="Optional" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Purchase Order (PO) No.</label>
                      <input type="text" name="poNumber" value={formData.poNumber} onChange={handleInputChange} placeholder="Optional" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Batch / Lot Number</label>
                      <input type="text" name="batchNumber" value={formData.batchNumber} onChange={handleInputChange} placeholder="e.g. B-202311" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Storage Location / Zone</label>
                      <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="e.g. Aisle 4, Rack B" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Quality / Condition Check</label>
                      <select name="incomingQualityCheck" value={formData.incomingQualityCheck} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                        <option value="Pass">Pass - Packaging Intact</option>
                        <option value="Damaged">Warning - Damaged Packaging</option>
                        <option value="Contaminated">Fail - Suspected Contamination</option>
                      </select>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* QUALITY CONTROL DEPARTMENT */}
            {department === 'Quality Control' && (
              <section className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm max-w-3xl mx-auto">
                <div className="flex items-center gap-2 mb-6 text-slate-700">
                  <CheckCircle className="text-blue-600" />
                  <h2 className="text-lg font-semibold">Quality Control Assessment</h2>
                </div>
                
                {/* QC Stage Toggle */}
                <div className="flex bg-slate-200 rounded-lg p-1 mb-6">
                  {['Extrusion', 'Cutting', 'Packing'].map(stage => (
                    <button 
                      key={stage}
                      type="button"
                      onClick={() => setQcStage(stage)}
                      className={`flex-1 py-2 px-2 text-sm font-medium rounded-md transition-all ${qcStage === stage ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {stage} QC
                    </button>
                  ))}
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Job Order No. (Under Inspection)</label>
                    <input type="text" name="jobOrder" value={formData.jobOrder} onChange={handleInputChange} required placeholder="WO-12345" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                  </div>

                  <div className="space-y-3 pt-2">
                    {qcStage === 'Extrusion' && (
                      <>
                        <QCField label="Thickness Check (Microns)" name="qcExtThickness" statusName="qcExtThicknessStatus" formData={formData} onChange={handleInputChange} placeholder="e.g. 50" />
                        <QCField label="Width Check (mm)" name="qcExtWidth" statusName="qcExtWidthStatus" formData={formData} onChange={handleInputChange} placeholder="e.g. 1200" />
                      </>
                    )}

                    {qcStage === 'Cutting' && (
                      <>
                        <QCField label="Seal Integrity Assessment" name="qcCutSeal" statusName="qcCutSealStatus" formData={formData} onChange={handleInputChange} placeholder="Visual / Drop Test notes..." />
                        <QCField label="Length Check (mm)" name="qcCutLength" statusName="qcCutLengthStatus" formData={formData} onChange={handleInputChange} placeholder="e.g. 800" />
                      </>
                    )}

                    {qcStage === 'Packing' && (
                      <>
                        <QCField label="Packing Size (Bag Weight - kg)" name="qcPackBagWeight" statusName="qcPackBagWeightStatus" formData={formData} onChange={handleInputChange} placeholder="e.g. 25.0" />
                        <QCField label="Quantity Check (Bags per Pallet)" name="qcPackBagsPerPallet" statusName="qcPackBagsPerPalletStatus" formData={formData} onChange={handleInputChange} placeholder="e.g. 40" />
                        <QCField label="Total Bags Verified" name="qcPackTotalBags" statusName="qcPackTotalBagsStatus" formData={formData} onChange={handleInputChange} placeholder="e.g. 400" />
                        <QCField label="Total Pallets Counted" name="qcPackTotalPallets" statusName="qcPackTotalPalletsStatus" formData={formData} onChange={handleInputChange} placeholder="e.g. 10" />
                      </>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <label className="block text-sm font-medium text-slate-600 mb-1">Overall QC Remarks / Issues Noted</label>
                    <textarea 
                      name="qcNotes" 
                      value={formData.qcNotes} 
                      onChange={handleInputChange} 
                      rows="3" 
                      className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                      placeholder="Provide detailed remarks if any checks failed..."
                    ></textarea>
                  </div>
                </div>
              </section>
            )}

            {/* Mass Balance Integrity Checker (Only for Manufacturing) */}
            {(department === 'Extrusion' || department === 'Cutting') && massBalance.totalInput > 0 && formData.uom === 'kg' && (
              <section className={`p-5 rounded-xl border-2 transition-all ${massBalance.isFailed ? 'bg-red-50 border-red-300' : 'bg-emerald-50 border-emerald-200'}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full mt-1 ${massBalance.isFailed ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {massBalance.isFailed ? <AlertTriangle size={24} /> : <Scale size={24} />}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold ${massBalance.isFailed ? 'text-red-800' : 'text-emerald-800'}`}>
                      {massBalance.isFailed ? 'Mass Balance Failed (Discrepancy > 2%)' : 'Mass Balance Verified'}
                    </h3>
                    <div className="mt-2 text-sm grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-700">
                      <div><span className="block text-xs uppercase opacity-70">Total Input</span><span className="font-semibold">{massBalance.totalInput.toFixed(2)} kg</span></div>
                      <div><span className="block text-xs uppercase opacity-70">Total Output + Scrap</span><span className="font-semibold">{massBalance.totalAccounted.toFixed(2)} kg</span></div>
                      <div>
                        <span className="block text-xs uppercase opacity-70">Variance</span>
                        <span className={`font-semibold ${massBalance.isFailed ? 'text-red-600' : 'text-emerald-600'}`}>
                          {massBalance.discrepancyKg > 0 ? '-' : '+'}{Math.abs(massBalance.discrepancyKg).toFixed(2)} kg
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs uppercase opacity-70">Error Margin</span>
                        <span className={`font-semibold ${massBalance.isFailed ? 'text-red-600' : 'text-emerald-600'}`}>
                          {massBalance.discrepancyPercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    
                    {massBalance.isFailed && (
                      <div className="mt-4 pt-4 border-t border-red-200">
                        <label className="block text-sm font-medium text-red-800 mb-1">Reason for Discrepancy (Required for Override)</label>
                        <input 
                          type="text" 
                          name="discrepancyReason" 
                          value={formData.discrepancyReason} 
                          onChange={handleInputChange} 
                          placeholder="e.g. Scale calibration issue, unaccounted purge..." 
                          className="w-full p-2 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none bg-white" 
                        />
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Section 4: Downtime (Only for Manufacturing) */}
            {(department === 'Extrusion' || department === 'Cutting') && (
              <section className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-slate-700">
                  <Clock className="text-blue-600" />
                  <h2 className="text-lg font-semibold">Machine Downtime</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="grid grid-cols-2 gap-4 col-span-1">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Planned (mins)</label>
                      <input type="number" name="plannedDowntime" value={formData.plannedDowntime} onChange={handleInputChange} placeholder="0" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Unplanned (mins)</label>
                      <input type="number" name="unplannedDowntime" value={formData.unplannedDowntime} onChange={handleInputChange} placeholder="0" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-600 mb-1">Primary Downtime Reason</label>
                    <input 
                      type="text"
                      name="downtimeReason" 
                      value={formData.downtimeReason} 
                      onChange={handleInputChange} 
                      className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                      placeholder="e.g., Heater band replacement, blade change..."
                    />
                  </div>
                </div>
              </section>
            )}

            {/* Submit Button Area */}
            <div className="pt-6 flex justify-end">
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-lg font-bold shadow-lg transition-all w-full md:w-auto ${
                  isSubmitting 
                    ? 'bg-slate-400 cursor-not-allowed' 
                    : ((department === 'Extrusion' || department === 'Cutting') && massBalance.isFailed && !formData.discrepancyReason)
                      ? 'bg-red-400 hover:bg-red-500 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
                }`}
              >
                <Save size={24} /> 
                {isSubmitting 
                  ? 'Saving Data...' 
                  : ((department === 'Extrusion' || department === 'Cutting') && massBalance.isFailed && !formData.discrepancyReason) 
                    ? 'Discrepancy Must Be Resolved' 
                    : `Submit ${department === 'Quality Control' ? qcStage + ' QC' : department} Log`
                }
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default App;