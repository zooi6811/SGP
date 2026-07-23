import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ClipboardList, Settings, Box, AlertTriangle, Clock, Save, Printer, Scale, 
  Package, Truck, ArrowDownToLine, PlusCircle, Trash2, CheckCircle, BarChart3, 
  Activity, RefreshCw, Flag, TrendingUp, X, Search, PackageCheck, Layers, 
  Lock, LogOut, UserCircle, Globe, Menu, ChevronUp, ChevronDown, Edit2, Camera,
  Archive, ShoppingCart, CalendarDays, Zap, ClipboardCheck, QrCode
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import JobScheduleView from './components/views/JobScheduleView';
import ProductionFormView from './components/views/ProductionFormView';
import InventoryView from './components/views/InventoryView';
import { dict, SCHEDULING_CONFIG, STORAGE_KEY, GOOGLE_SCRIPT_URL, defaultStats, defaultAnalytics } from './config/constants';
import SortableTable from './components/ui/SortableTable';
import DashboardView from './components/views/DashboardView';

// --- REUSABLE COMPONENTS ---

// 4. Sleek QR Scanner Modal (Dynamically loads html5-qrcode)
const QRScannerModal = ({ onScan, onClose }) => {
  useEffect(() => {
    let html5QrCode;

    const init = () => {
      html5QrCode = new window.Html5Qrcode("reader");
      html5QrCode.start(
        { facingMode: "environment" }, // Forces rear camera on mobile
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1 },
        (decodedText) => {
          if (html5QrCode) {
            html5QrCode.stop().then(() => {
              html5QrCode.clear();
              onScan(decodedText);
            }).catch(err => console.log(err));
          }
        },
        (errorMessage) => { /* ignore minor read errors */ }
      ).catch((err) => {
        console.error("Camera start failed", err);
        toast.error("Could not access camera. Please check browser permissions.");
        onClose();
      });
    };

    if (!window.Html5Qrcode) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/html5-qrcode';
      script.onload = init;
      document.body.appendChild(script);
    } else {
      init();
    }

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().then(() => html5QrCode.clear()).catch(e => console.error(e));
      }
    };
  }, [onScan, onClose]);

  return (
    <div className="fixed inset-0 z-[80] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative flex flex-col animate-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-black text-slate-800 flex items-center gap-2"><QrCode size={20} className="text-indigo-600"/> Scan QR Code</h3>
          <button onClick={onClose} className="p-2 bg-slate-200 rounded-xl hover:bg-slate-300 text-slate-600 transition-colors"><X size={18}/></button>
        </div>
        <div className="p-4 bg-black relative flex-1 min-h-[350px] flex items-center justify-center">
          <div id="reader" className="w-full h-full"></div>
          {/* Target Overlay UI */}
          <div className="absolute inset-0 pointer-events-none border-[50px] border-black/50">
              <div className="w-full h-full border-2 border-indigo-500/50 rounded-xl relative">
                 <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-indigo-500 rounded-tl-xl -m-0.5"></div>
                 <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-indigo-500 rounded-tr-xl -m-0.5"></div>
                 <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-indigo-500 rounded-bl-xl -m-0.5"></div>
                 <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-indigo-500 rounded-br-xl -m-0.5"></div>
              </div>
          </div>
        </div>
        <div className="p-6 bg-slate-50 text-center">
           <p className="text-sm font-bold text-slate-700">Point your camera at the item's QR code.</p>
           <p className="text-xs font-semibold text-slate-500 mt-1">Details will auto-fill instantly upon detection.</p>
        </div>
      </div>
    </div>
  );
};

// Log Details Banner Component
const LogDetailsBanner = ({ log, onClose, masterOrders = [] }) => {
  if (!log) return null;
  const d = log.data;
  const fmtDate = (val) => new Date(val).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' });
  
  const LabelValue = ({label, value, className = ""}) => (
    <div className={`flex flex-col border-b border-slate-100 pb-2 mb-2 ${className}`}>
      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{label}</span>
      <span className="font-semibold text-slate-800 text-sm mt-0.5">{value || '-'}</span>
    </div>
  );

  let orderInfo = null;
  if (['Extrusion', 'Cutting', 'Packing', 'Quality Control'].includes(log.type)) {
    const jobOrderTarget = log.type === 'Quality Control' ? d[3] : d[3];
    const order = masterOrders.find(o => o.jo === jobOrderTarget);
    if (order) {
       let formattedDate = '-';
       if (order.date && order.date !== '-') {
         const dt = new Date(order.date);
         if (!isNaN(dt.getTime())) formattedDate = dt.toLocaleDateString('en-GB');
       }
       orderInfo = (
         <div className="mb-4 bg-blue-50/40 p-4 rounded-xl border border-blue-100/60 shadow-sm">
            <h4 className="text-[10px] font-black text-blue-600 mb-3 uppercase tracking-wider flex items-center gap-1.5"><ClipboardList size={14} /> Job Order Reference</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <LabelValue label="Customer" value={order.customer} className="border-b-blue-100/50" />
              <LabelValue label="Issue Date" value={formattedDate} className="border-b-blue-100/50" />
              <div className="col-span-2"><LabelValue label="Description" value={order.description} className="border-b-blue-100/50" /></div>
              <div className="col-span-2"><LabelValue label="Size / Dimension" value={order.dimension} className="border-0 pb-0 mb-0" /></div>
            </div>
         </div>
       );
    }
  }

  let content = null;
  if (log.type === 'Job Overview') {
    const o = log.data;
    content = (
      <>
        <div className="mb-4 bg-blue-50/40 p-4 rounded-xl border border-blue-100/60 shadow-sm">
          <h4 className="text-[10px] font-black text-blue-600 mb-3 uppercase tracking-wider flex items-center gap-1.5"><ClipboardList size={14} /> Job Order Overview</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <LabelValue label="Job Order No." value={o.jo} className="border-b-blue-100/50" />
            <LabelValue label="Customer" value={o.customer} className="border-b-blue-100/50" />
            <LabelValue label="Issue Date" value={o.issueDateDisplay} className="border-b-blue-100/50" />
            <LabelValue label="Target" value={o.target} className="border-b-blue-100/50" />
            <div className="col-span-2"><LabelValue label="Description" value={o.description} className="border-b-blue-100/50" /></div>
            <div className="col-span-2"><LabelValue label="Size / Dimension" value={o.dimension} className="border-0 pb-0 mb-0" /></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <LabelValue label="Scheduled Run Date" value={o.runDateDisplay} />
          <LabelValue label="Assigned Machine" value={o.schedMachine} />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-2">
          <LabelValue label="Extrusion Pending" value={`${(o.extPending || 0).toFixed(1)} kg`} className={(o.extPending || 0) > 0 ? "text-blue-600" : "text-emerald-600"} />
          {o.requiresCutting ? <LabelValue label="Cutting Pending" value={`${(o.cutPending || 0).toFixed(1)} kg`} className={(o.cutPending || 0) > 0 ? "text-amber-600" : "text-emerald-600"} /> : <LabelValue label="Cutting" value="N/A" />}
          <LabelValue label="Packing Pending" value={`${(o.packPending || 0).toFixed(1)} kg`} className={(o.packPending || 0) > 0 ? "text-purple-600" : "text-emerald-600"} />
        </div>
      </>
    );
  } else if (log.type === 'Extrusion') {
    content = (
      <>
        {orderInfo}
        <LabelValue label="Timestamp" value={fmtDate(d[0])} />
        <div className="grid grid-cols-2 gap-4">
          <LabelValue label="Job Order" value={d[3]} />
          <LabelValue label="Machine" value={d[4]} />
          <LabelValue label="Output" value={`${d[6]} ${d[7]}`} />
          <LabelValue label="Discrepancy" value={`${d[10]}%`} />
        </div>
        <LabelValue label="Materials" value={<pre className="whitespace-pre-wrap font-sans text-xs mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200">{d[5]}</pre>} />
        <div className="grid grid-cols-2 gap-4">
          <LabelValue label="Setup Wastage" value={`${d[8] || 0} kg`} />
          <LabelValue label="Process Wastage" value={`${d[9] || 0} kg`} />
        </div>
        <LabelValue label="Supervisor" value={d[11]} className="border-0 pb-0 mb-0" />
      </>
    );
  } else if (log.type === 'Cutting') {
    content = (
      <>
        {orderInfo}
        <LabelValue label="Timestamp" value={fmtDate(d[0])} />
        <div className="grid grid-cols-2 gap-4">
          <LabelValue label="Job Order" value={d[3]} />
          <LabelValue label="Machine" value={d[4]} />
          <LabelValue label="Input Weight" value={`${parseFloat(d[5]) || 0} kg`} />
          <LabelValue label="Output" value={`${d[6]} ${d[7]}`} />
          <LabelValue label="Setup Wastage" value={`${d[8] || 0} kg`} />
          <LabelValue label="Process Wastage" value={`${d[9] || 0} kg`} />
          <LabelValue label="Discrepancy" value={`${d[10]}%`} />
        </div>
        <LabelValue label="Supervisor" value={d[11]} className="border-0 pb-0 mb-0" />
      </>
    );
  } else if (log.type === 'Packing') {
    content = (
      <>
        {orderInfo}
        <LabelValue label="Timestamp" value={fmtDate(d[0])} />
        <div className="grid grid-cols-2 gap-4">
          <LabelValue label="Job Order" value={d[3]} />
          <LabelValue label="Quantity" value={`${d[6]} (${d[4]} ${d[5]})`} />
          <LabelValue label="Pallet Weight" value={`${d[7] || 0} kg`} />
        </div>
        <LabelValue label="Bag Weights" value={<span className="text-xs bg-slate-50 p-2 rounded block mt-1 leading-relaxed border border-slate-200">{d[8] || 'N/A'}</span>} />
        <LabelValue label="Supervisor" value={d[9]} className="border-0 pb-0 mb-0" />
      </>
    );
  } else if (log.type === 'Incoming Goods') {
    content = (
      <>
        <LabelValue label="Timestamp" value={fmtDate(d[0])} />
        <LabelValue label="Material" value={d[2]} />
        <div className="grid grid-cols-2 gap-4">
          <LabelValue label="Amount" value={`${d[3]} kg`} />
        <LabelValue label="Supplier" value={d[4]} />
        <LabelValue label="Batch No" value={d[5]} />
        <LabelValue label="PO Number" value={d[6]} />
        <LabelValue label="Location" value={d[7]} />
        <LabelValue label="Condition" value={d[8]} />
      </div>
      <LabelValue label="Receiver" value={d[9]} />
      {d[10] && d[10].toString().startsWith('http') && (
        <LabelValue label="Attached Evidence" value={
          <a href={d[10]} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200">
            <Camera size={14} /> View Evidence Photo
          </a>
        } className="border-0 pb-0 mb-0 mt-2" />
      )}
    </>
  );
} else if (log.type === 'Quality Control') {
    // Dynamic Evidence Link Extraction from Column 8
    const detailsLines = d[7] ? d[7].toString().split('\n') : [];
    const evidenceLine = detailsLines.find(l => l.startsWith('Evidence Photo:'));
    const evidenceUrl = evidenceLine ? evidenceLine.replace('Evidence Photo:', '').trim() : null;

    content = (
      <>
        {orderInfo}
        <LabelValue label="Timestamp" value={fmtDate(d[0])} />
        <div className="grid grid-cols-2 gap-4">
          <LabelValue label="Machine" value={d[2] || 'N/A'} />
          <LabelValue label="Job Order" value={d[3] || 'N/A'} />
        </div>
        <LabelValue label="Assessment Details" value={<pre className="whitespace-pre-wrap font-sans text-xs mt-1 bg-slate-50 p-3 rounded-lg border border-slate-200">{d[7]}</pre>} />
        {evidenceUrl && (
          <LabelValue label="Attached Evidence" value={
            <a href={evidenceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200">
              <Camera size={14} /> View Evidence Photo
            </a>
          } />
        )}
        <LabelValue label="Remarks" value={d[6] || '-'} />
        <LabelValue label="Inspector" value={d[8]} className="border-0 pb-0 mb-0" />
      </>
    );
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-0 sm:p-5 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-8 duration-300" onClick={e => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-black text-slate-800">{log.type} Record Details</h3>
          <button onClick={onClose} className="p-1.5 bg-slate-200 rounded-full hover:bg-slate-300 text-slate-600 transition-colors"><X size={16}/></button>
        </div>
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          {content}
        </div>
      </div>
    </div>
  );
};

const getInitialFormData = (userProfile = null) => ({
  date: new Date().toISOString().split('T')[0],
  shift: userProfile ? userProfile.shift : 'AM', 
  supervisor: userProfile ? userProfile.name : '',
  machineId: '', jobOrder: '', inputRollWeight: '', extrusionMaterials: [], extrusionRolls: [], scrapEntries: [], 
  actualOutput: '', uom: 'kg', setupScrap: '', processScrap: '', rejections: '', plannedDowntime: '', unplannedDowntime: '', downtimeReason: '', discrepancyReason: '',
  packingSize: '', packingUom: 'kg/bag', quantityPacked: '', palletWeight: '', bagWeights: [{ id: Date.now(), weight: '' }], jobComplete: false, dispatchQty: '', deliveryOrderNo: '',
  restockMaterial: '', restockAmount: '', supplier: '', poNumber: '', batchNumber: '', location: '', incomingQualityCheck: 'Pass', qcNotes: '', incomingBatches: [],
  qcMachineType: 'Extrusion', qcExtFilter: 'Good', qcExtPurged: 'Yes', qcCutTemp: '', qcCutTempStatus: 'Pass', qcCutMachineThickness: '', qcCutMachineThicknessStatus: 'Pass', qcMachineCleanliness: 'Pass', qcMachineSafety: 'Pass',
  qcExtThickness: '', qcExtThicknessStatus: 'Pass', qcExtWidth: '', qcExtWidthStatus: 'Pass', qcCutSeal: '', qcCutSealStatus: 'Pass', qcCutLength: '', qcCutLengthStatus: 'Pass',
  qcPackBagWeight: '', qcPackBagWeightStatus: 'Pass', qcPackBagsPerPallet: '', qcPackBagsPerPalletStatus: 'Pass', qcPackTotalBags: '', qcPackTotalBagsStatus: 'Pass', qcPackTotalPallets: '', qcPackTotalPalletsStatus: 'Pass',
  reqItemName: '', reqQuantity: '', reqUom: 'pcs', reqCurrentStock: '', reqRemarks: ''
});

const App = () => {
  const [language, setLanguage] = useState('en');
  const t = (text) => (dict[language] && dict[language][text]) || text;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [pinInput, setPinInput] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [department, setDepartment] = useState('Dashboard'); 
  const [qcStage, setQcStage] = useState('Extrusion'); 
  const [qcActiveForm, setQcActiveForm] = useState('product'); // Tracks which container is active
  const [scheduleTab, setScheduleTab] = useState('Extrusion'); // Tracks active job schedule tab
  
  // Reference for triggering native HTML5 validation from floating footer
  const formRef = useRef(null);

  // --- INVENTORY / STOCKTAKE STATES ---
  const [inventoryTab, setInventoryTab] = useState('Overview'); // 'Overview' | 'Stocktake'
  const [stocktakeCategory, setStocktakeCategory] = useState('Finished Goods'); // 'Finished Goods' | 'Unpacked FG' | 'Raw Materials' | 'WIP'
  const initialStocktakeForm = { itemCode: '', customer: '', description: '', dimension: '', quantity: '', uom: 'kg', materialName: '', location: '', remarks: '' };
  const [stocktakeForm, setStocktakeForm] = useState(initialStocktakeForm);
  const [isScanningQR, setIsScanningQR] = useState(false);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null); 

  const [searchTerm, setSearchTerm] = useState('');
  const [showCompleted, setShowCompleted] = useState(false); // New state for toggling visibility

  // --- Image Upload States ---
  const [evidenceImageFile, setEvidenceImageFile] = useState(null);
  const [evidenceImagePreview, setEvidenceImagePreview] = useState(null);
  
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) { try { return JSON.parse(saved); } catch(e) { console.error('Corrupted draft'); } }
    return getInitialFormData();
  });

  // Dynamic Auto-Save Timer
  const [lastSavedTime, setLastSavedTime] = useState(Date.now());
  const [saveIndicator, setSaveIndicator] = useState('Draft saved just now');

  const [quickRollWeight, setQuickRollWeight] = useState('');
  const [quickMaterialBatch, setQuickMaterialBatch] = useState('');
  const [quickMaterialId, setQuickMaterialId] = useState('');
  const [quickMaterialName, setQuickMaterialName] = useState('');
  const [quickMaterialUom, setQuickMaterialUom] = useState('kg');
  const [quickMaterialWeight, setQuickMaterialWeight] = useState('');
  const [quickScrapType, setQuickScrapType] = useState('setupScrap');
  const [quickScrapWeight, setQuickScrapWeight] = useState('');
  const [quickPalletCount, setQuickPalletCount] = useState('1'); 

  const [localHistory, setLocalHistory] = useState({ machineIds: [], batchNos: [], suppliers: [], downtimeReasons: [] });

  useEffect(() => {
    setLocalHistory({
      machineIds: JSON.parse(localStorage.getItem('hist_machines') || '[]'),
      batchNos: JSON.parse(localStorage.getItem('hist_batches') || '[]'),
      suppliers: JSON.parse(localStorage.getItem('hist_suppliers') || '[]'),
      downtimeReasons: JSON.parse(localStorage.getItem('hist_downtime') || '[]')
    });
  }, []);

  // Auto-save effect
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      setLastSavedTime(Date.now());
    }
  }, [formData, isLoggedIn]);

  // Update auto-save text every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const diffMins = Math.floor((Date.now() - lastSavedTime) / 60000);
      if (diffMins === 0) setSaveIndicator('Draft saved just now');
      else if (diffMins === 1) setSaveIndicator('Draft saved 1 min ago');
      else setSaveIndicator(`Draft saved ${diffMins} mins ago`);
    }, 30000);
    return () => clearInterval(interval);
  }, [lastSavedTime]);

  const [analyticsPeriod, setAnalyticsPeriod] = useState('daily');
  const [analyticsDept, setAnalyticsDept] = useState('Extrusion');
  const [dashboardData, setDashboardData] = useState({ 
    extrusion: [], cutting: [], packing: [], dispatch: [], incoming: [], qc: [], containers: [], requisitions: [], schedule: [],
    masterOrders: [], joTotals: {},
    analytics: { Extrusion: defaultAnalytics, Cutting: defaultAnalytics, Packing: defaultAnalytics }
  });
  const [isFetchingDashboard, setIsFetchingDashboard] = useState(false);

  // 1. Process Master Schedule into 12-Hour Shifts
  const processedSchedule = useMemo(() => {
    if (!dashboardData?.schedule) return [];
    
    let expanded = [];
    let machineAvailability = {};

    const sortedOriginal = [...dashboardData.schedule].sort((a, b) => {
      // Safe DD/MM/YYYY Parsing
      const parseDate = (dStr) => {
         const parts = String(dStr).split('/');
         if (parts.length === 3) return new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`).getTime();
         return new Date(dStr).getTime();
      };
      return parseDate(a[0]) - parseDate(b[0]);
    });

    sortedOriginal.forEach(row => {
      const runDateStr = row[0];
      const jo = String(row[1] || '').trim();
      const machine = String(row[2] || '').trim().toUpperCase();
      const details = String(row[3] || '').trim();
      const targetStr = String(row[4] || '').trim().toUpperCase();
      
      if (!runDateStr || runDateStr === '-') return; 
      
      let targetQty = parseFloat(targetStr) || 0;
      let isPcs = targetStr.includes('PCS');
      let unit = isPcs ? 'PCS' : 'KG';

      // Advanced Machine Constraints (12-hour shifts) parsed from Configuration Engine
      let capacity = 3000; 
      if (machine.startsWith('B')) {
        capacity = SCHEDULING_CONFIG.capacities.extrusion[machine] || SCHEDULING_CONFIG.capacities.extrusion.default;
      } else if (machine.startsWith('C')) {
        capacity = (machine === 'C5' && isPcs) ? SCHEDULING_CONFIG.capacities.cutting['C5_pcs'] : (isPcs ? SCHEDULING_CONFIG.capacities.cutting.defaultPcs : SCHEDULING_CONFIG.capacities.cutting.defaultKg);
      } else if (machine.startsWith('P')) {
        capacity = isPcs ? SCHEDULING_CONFIG.capacities.packing.pcs : SCHEDULING_CONFIG.capacities.packing.kg; 
      }

      // Safe Date Parsing for Initial Assignment
      let reqDateMs = 0;
      const parts = String(runDateStr).split('/');
      if (parts.length === 3) reqDateMs = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`).getTime();
      else reqDateMs = new Date(runDateStr).getTime();
      if (isNaN(reqDateMs)) reqDateMs = Date.now();

      // Ensure machine timeline starts at requested date, or later if already busy
      if (!machineAvailability[machine] || machineAvailability[machine].dateMs < reqDateMs) {
        machineAvailability[machine] = { dateMs: reqDateMs, shift: 'AM' };
      }

      let remaining = targetQty;
      
      // Fallback for orders without numeric targets
      if (remaining <= 0) {
        expanded.push({
            jo, machine, details, originalTarget: targetStr,
            runDateMs: machineAvailability[machine].dateMs,
            runDateDisplay: new Date(machineAvailability[machine].dateMs).toLocaleDateString('en-GB'),
            shift: machineAvailability[machine].shift,
            allocatedTarget: targetStr || 'N/A'
        });
        machineAvailability[machine].shift = machineAvailability[machine].shift === 'AM' ? 'PM' : 'AM';
        if (machineAvailability[machine].shift === 'AM') machineAvailability[machine].dateMs += 86400000;
        return;
      }

      // Split large targets iteratively across shifts
      while (remaining > 0.5) { // 0.5 threshold to drop float ghosting
        let allocate = Math.min(remaining, capacity);
        
        expanded.push({
            jo, machine, details, originalTarget: targetStr,
            runDateMs: machineAvailability[machine].dateMs,
            runDateDisplay: new Date(machineAvailability[machine].dateMs).toLocaleDateString('en-GB'),
            shift: machineAvailability[machine].shift,
            allocatedTarget: `${allocate.toFixed(0)} ${unit}`
        });

        remaining -= allocate;

        // Advance 12-hour block
        if (machineAvailability[machine].shift === 'AM') {
            machineAvailability[machine].shift = 'PM';
        } else {
            machineAvailability[machine].shift = 'AM';
            machineAvailability[machine].dateMs += 86400000; // Move to next day AM
        }
      }
    });

    // Final sorting: Machine -> Date -> Shift
    return expanded.sort((a, b) => {
      if (a.machine !== b.machine) return a.machine.localeCompare(b.machine);
      if (a.runDateMs !== b.runDateMs) return a.runDateMs - b.runDateMs;
      return a.shift === 'AM' ? -1 : 1;
    });
  }, [dashboardData.schedule]);

  // 2. Build Start-Date Dictionary from expanded schedule
  const scheduleMap = useMemo(() => {
    const map = {};
    processedSchedule.forEach(row => {
      const jo = row.jo;
      if (!map[jo]) map[jo] = { extrusion: null, cutting: null, packing: null, general: null };
      
      const schedObj = { runDateMs: row.runDateMs, runDateDisplay: row.runDateDisplay, machine: row.machine };
      
      if (row.machine.startsWith('B') && !map[jo].extrusion) map[jo].extrusion = schedObj;
      else if (row.machine.startsWith('C') && !map[jo].cutting) map[jo].cutting = schedObj;
      else if (row.machine.startsWith('P') && !map[jo].packing) map[jo].packing = schedObj;
      else if (!map[jo].general) map[jo].general = schedObj;
    });
    return map;
  }, [processedSchedule]);

  // Single function to cycle the status sequentially
  const handleCycleStatus = async (order) => {
    const loadToast = toast.loading("Updating status...");
    try {
      const isSystemReady = (order.packedQty - order.dispatchedQty) > 0.5;
      const isCurrentlyCompleted = order.isCompleted;
      const isCurrentlyReady = !isCurrentlyCompleted && (isSystemReady || order.isReadyToShip);

      if (isCurrentlyCompleted) {
        // Completed -> Pending (Reset both flags)
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'toggleCompleted', jo: order.jo, isCompleted: false })
        });
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'toggleReadyToShip', jo: order.jo, isReady: false })
        });
      } else if (isCurrentlyReady) {
        // Ready -> Completed
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'toggleCompleted', jo: order.jo, isCompleted: true })
        });
      } else {
        // Pending -> Ready
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'toggleReadyToShip', jo: order.jo, isReady: true })
        });
      }
      toast.success("Order status updated!", { id: loadToast });
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to update status.", { id: loadToast });
    }
  };

  const handleUrgencyChange = async (jo, newUrgency) => {
    const loadToast = toast.loading(`Updating urgency...`);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'updateUrgency', jo, urgency: newUrgency })
      });
      toast.success("Urgency level updated!", { id: loadToast });
      fetchDashboardData();
    } catch (e) {
      toast.error("Failed to update urgency.", { id: loadToast });
    }
  };

  const joSuggestions = useMemo(() => {
    if (!dashboardData?.masterOrders) return [];
    const currentInput = (formData.jobOrder || '').toLowerCase();
    const sorted = [...dashboardData.masterOrders].sort((a, b) => (dashboardData.joTotals[b.jo]?.lastUpdated || 0) - (dashboardData.joTotals[a.jo]?.lastUpdated || 0));
    return Array.from(new Set(sorted.map(item => item.jo))).filter(jo => jo.toLowerCase().includes(currentInput)).slice(0, 5);
  }, [dashboardData, formData.jobOrder]);

  const activeOrdersData = useMemo(() => {
    if (!dashboardData?.masterOrders || !dashboardData?.joTotals) return [];
    return dashboardData.masterOrders.map(order => {
      const totals = dashboardData.joTotals[order.jo] || { extrusion: 0, cutting: 0, packing: 0, dispatched: 0, lastUpdated: 0 };
      const target = parseFloat(order.targetQty) || 1; 
      
      let parsedDate = 0;
      let displayDate = '-';
      if (order.date && order.date !== '-') {
           const d = new Date(order.date);
           if (!isNaN(d.getTime())) {
               parsedDate = d.getTime();
               displayDate = d.toLocaleDateString('en-GB');
           } else { displayDate = String(order.date); }
      }

      return {
        jo: order.jo,
        customer: order.customer,
        description: order.description,
        dimension: order.dimension,
        target: `${order.targetQty} ${order.targetUom}`,
        issueDateMs: parsedDate,
        issueDateDisplay: displayDate,
        extProgress: ((totals.extrusion || 0) / target) * 100,
        cutProgress: ((totals.cutting || 0) / target) * 100,
        packProgress: ((totals.packing || 0) / target) * 100,
        extPending: Math.max(0, target - (totals.extrusion || 0)),
        cutPending: Math.max(0, target - (totals.cutting || 0)),
        packPending: Math.max(0, target - (totals.packing || 0)),
        // Expose completed totals for downstream orchestration
        extCompleted: totals.extrusion || 0,
        cutCompleted: totals.cutting || 0,
        packCompleted: totals.packing || 0,
        requiresCutting: order.requiresCutting,
        urgency: order.urgency || 5, // Fallback to 5
        lastUpdated: totals.lastUpdated || 0,
        isReadyToShip: order.isReadyToShip || false,
        isCompleted: order.isCompleted || false,
        packedQty: totals.packing || 0,
        dispatchedQty: totals.dispatched || 0
      };
    }).sort((a, b) => b.lastUpdated - a.lastUpdated || b.issueDateMs - a.issueDateMs);
  }, [dashboardData]);

  const readyToShipData = useMemo(() => {
    if (!dashboardData?.masterOrders || !dashboardData?.joTotals) return [];
    return dashboardData.masterOrders.filter(order => {
        if (order.isCompleted) return false; 
        
        const totals = dashboardData.joTotals[order.jo] || {};
        const packed = totals.packing || 0;
        const dispatched = totals.dispatched || 0;
        
        // Automated: If we have physically packed items waiting, it's Ready.
        const isSystemReady = (packed - dispatched) > 0.5;
        const isManuallyReady = order.isReadyToShip;

        // Will show up if EITHER system detects it OR supervisor manually toggled it
        return isSystemReady || isManuallyReady; 
    }).map(order => {
        const totals = dashboardData.joTotals[order.jo] || {};
        const packed = totals.packing || 0;
        const dispatched = totals.dispatched || 0;
        const target = parseFloat(order.targetQty) || 1; 

        // Calculate pending physically
        let pending = packed - dispatched;
        
        // Fallback for manual overrides: if nothing is physically packed yet, fallback to target quantity
        if (pending <= 0 && order.isReadyToShip) {
            pending = target - dispatched;
        }
        
        pending = Math.max(0, pending);

        return {
            jo: order.jo,
            customer: order.customer,
            description: order.description,
            dimension: order.dimension,
            packingSize: totals.packingSize || '-',
            packingUom: totals.packingUom || '-',
            totalPackedWeight: packed,
            totalPalletWeight: totals.palletWeight || 0,
            pendingDispatch: pending,
            lastUpdated: totals.lastUpdated || 0
        };
    }).sort((a, b) => b.lastUpdated - a.lastUpdated);
  }, [dashboardData]);

  // Aggregator 1: Finished Goods currently sitting in Warehouse
  const warehouseGoodsData = useMemo(() => {
    if (!dashboardData?.masterOrders || !dashboardData?.joTotals) return [];
    return dashboardData.masterOrders.filter(order => {
        const totals = dashboardData.joTotals[order.jo];
        if (!totals) return false;
        const pending = totals.packing - totals.dispatched;
        return pending > 0.5; // Only show items with meaningful weight packed but not dispatched
    }).map(order => {
        const totals = dashboardData.joTotals[order.jo];
        return {
            jo: order.jo,
            customer: order.customer,
            dimension: order.dimension,
            pendingDispatch: totals.packing - totals.dispatched,
            isReady: totals.isReadyToShip,
            lastUpdated: totals.lastUpdated || 0
        };
    }).sort((a, b) => b.lastUpdated - a.lastUpdated);
  }, [dashboardData]);

  // Aggregator 2: Raw Material Groups (Incoming - Consumed)
  const rawMaterialsSummary = useMemo(() => {
    const summary = {};
    
    // 1. Sum up all incoming materials
    (dashboardData?.incoming || []).forEach(row => {
        const mat = row[2];
        const amount = parseFloat(row[3]) || 0;
        if (mat) {
            if (!summary[mat]) summary[mat] = { incoming: 0, consumed: 0 };
            summary[mat].incoming += amount;
        }
    });

    // 2. Dynamically extract and subtract consumed materials from Extrusion logs
    (dashboardData?.extrusion || []).forEach(row => {
        const materialsList = String(row[5] || '');
        const lines = materialsList.split('\n');
        
        lines.forEach(line => {
            const nameMatch = line.match(/Name:\s*(.*?)\s*\|/);
            const qtyMatch = line.match(/\(([\d.]+)\s*kg\)/);
            
            if (nameMatch && qtyMatch) {
                const matName = nameMatch[1].trim();
                const qty = parseFloat(qtyMatch[1]) || 0;
                
                if (!summary[matName]) summary[matName] = { incoming: 0, consumed: 0 };
                summary[matName].consumed += qty;
            }
        });
    });

    // 3. Map to final array and calculate Current Stock
    return Object.keys(summary).map(mat => {
        const inc = summary[mat].incoming;
        const con = summary[mat].consumed;
        return { 
            material: mat, 
            incoming: inc, 
            consumed: con, 
            current: inc - con 
        };
    }).sort((a, b) => b.current - a.current);
  }, [dashboardData]);

  // --- UNIQUE CATALOGUES FOR STOCKTAKE ---
  const uniqueFinishedGoods = useMemo(() => {
    if (!dashboardData?.masterOrders) return [];
    const map = new Map();
    // Prioritize grouping by Item Code if available, otherwise fallback to details
    dashboardData.masterOrders.forEach(o => {
      const key = o.itemCode || `${o.customer}|${o.description}|${o.dimension}`;
      if (!map.has(key)) {
        map.set(key, {
           id: key,
           itemCode: o.itemCode || '',
           customer: o.customer || '-',
           description: o.description || '-',
           dimension: o.dimension || '-',
           targetUom: o.targetUom ? o.targetUom.toLowerCase() : 'pcs'
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.customer.localeCompare(b.customer));
  }, [dashboardData]);

  const uniqueRawMaterials = useMemo(() => {
    // Draws from the rawMaterialsSummary to ensure all historically received items are available
    return rawMaterialsSummary.map(rm => ({
      material: rm.material,
      currentStockEstimate: rm.current
    })).sort((a, b) => a.material.localeCompare(b.material));
  }, [rawMaterialsSummary]);

  const handleStocktakeSubmit = async (e) => {
    e.preventDefault();
    if ((stocktakeCategory === 'Finished Goods' || stocktakeCategory === 'Unpacked FG') && (!stocktakeForm.customer || !stocktakeForm.description)) {
       toast.error("Please select a product from the catalogue first."); return;
    }
    if ((stocktakeCategory === 'Raw Materials' || stocktakeCategory === 'WIP') && !stocktakeForm.materialName) {
       toast.error("Please select a material from the catalogue first."); return;
    }
    if (!stocktakeForm.quantity) {
       toast.error("Please enter the counted quantity."); return;
    }

    const loadToast = toast.loading("Saving stocktake data...");
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
         method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
         body: JSON.stringify({
            action: 'submitStocktake', // Sends to Google Apps Script
            date: new Date().toISOString().split('T')[0],
            category: stocktakeCategory,
            operator: currentUser?.name || 'Admin',
            ...stocktakeForm
         })
      });
      toast.success(`${stocktakeCategory} stocktake recorded!`, { id: loadToast });
      setStocktakeForm(initialStocktakeForm);
    } catch(err) {
      toast.error("Network error: Failed to save stocktake.", { id: loadToast });
    }
  };

  // --- QR CODE SCAN HANDLER ---
  const handleQRScan = (decodedText) => {
    setIsScanningQR(false);
    const scannedCode = decodedText.trim().toUpperCase();
    
    // Play a tiny success blip if supported by browser
    try { const ctx = new (window.AudioContext || window.webkitAudioContext)(); const osc = ctx.createOscillator(); osc.connect(ctx.destination); osc.frequency.setValueAtTime(800, ctx.currentTime); osc.start(); osc.stop(ctx.currentTime + 0.1); } catch(e) {}
    
    if (stocktakeCategory === 'Finished Goods' || stocktakeCategory === 'Unpacked FG') {
      const match = uniqueFinishedGoods.find(item => item.itemCode && item.itemCode.toUpperCase() === scannedCode);
      if (match) {
        setStocktakeForm(prev => ({
          ...prev,
          itemCode: scannedCode,
          customer: match.customer,
          description: match.description,
          dimension: match.dimension,
          uom: match.targetUom
        }));
        toast.success(`Matched: ${match.description}`, { icon: '🎯' });
      } else {
        setStocktakeForm(prev => ({ ...prev, itemCode: scannedCode }));
        toast.success(`Scanned: ${scannedCode}. No exact catalogue match found.`, { icon: '📷' });
      }
    } else {
      setStocktakeForm(prev => ({ ...prev, materialName: scannedCode }));
      toast.success(`Scanned: ${scannedCode}`, { icon: '📷' });
    }
  };

  // Aggregator 3: Active Purchase Requisitions
  const activeRequisitions = useMemo(() => {
    if (!dashboardData?.requisitions) return [];
    return dashboardData.requisitions.map(r => ({
        timestamp: new Date(r[0]).getTime(),
        date: r[1],
        item: r[2],
        qty: r[3],
        uom: r[4],
        stock: r[5],
        remarks: r[6],
        requester: r[7]
    })).sort((a, b) => b.timestamp - a.timestamp);
  }, [dashboardData]);

  const handleResolveRequisition = async (timestamp) => {
    const loadToast = toast.loading("Marking as resolved...");
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'resolveRequisition', timestamp })
      });
      toast.success("Requisition resolved!", { id: loadToast });
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to update status.", { id: loadToast });
    }
  };

  // Job Schedule specific filters
  const extSchedule = useMemo(() => processedSchedule.filter(r => r.machine.startsWith('B')), [processedSchedule]);
  const cutSchedule = useMemo(() => processedSchedule.filter(r => r.machine.startsWith('C')), [processedSchedule]);
  const packSchedule = useMemo(() => processedSchedule.filter(r => r.machine.startsWith('P')), [processedSchedule]);

  // Job Schedule & Overview Extractors (Enriched with Scheduling Data)
  const pendingExtrusion = useMemo(() => {
    return activeOrdersData.filter(o => o.extPending > 0.5).map(o => {
        const sched = scheduleMap[o.jo]?.extrusion || scheduleMap[o.jo]?.general || {};
        
        // --- SMART MATERIAL ORCHESTRATION ---
        const cust = String(o.customer || '').toUpperCase();
        const desc = String(o.description || '').toUpperCase();
        let materials = [];
        
        if (cust.includes('YAMAICHI')) {
            materials.push({ id: 'LD N1', name: 'LDPE N1', ratio: 1 });
        } else if (cust.includes('MAB')) {
            materials.push({ id: 'LD N3', name: 'LDPE N3', ratio: 1 });
        } else if (desc.includes('HDPE') || desc.includes('HD ')) {
            materials.push({ id: 'HD F6095', name: 'HD F6095', ratio: 5 });
            materials.push({ id: 'LL 4211', name: 'LL 4211', ratio: 1 });
        } else {
            materials.push({ id: 'RESIN', name: 'Generic Resin', ratio: 1 });
        }

        // Search the warehouse inventory for the most recent matching batch
        const suggestedMaterials = materials.map(mat => {
            const matches = (dashboardData.incoming || []).filter(r => String(r[2]).toUpperCase().includes(mat.id.toUpperCase()));
            // Grab the most recently logged incoming batch
            const bestBatch = matches.length > 0 ? matches[matches.length - 1][5] : '';
            const bestName = matches.length > 0 ? matches[matches.length - 1][2] : mat.name;
            return { ...mat, matchName: bestName, matchBatch: bestBatch };
        });

        const materialsDisplay = suggestedMaterials.map(m => `${m.ratio > 1 ? m.ratio + 'x ' : ''}${m.id}`).join(' + ');

        return { 
          ...o, 
          suggestedMaterials, 
          materialsDisplay, 
          runDateMs: sched.runDateMs || 9999999999999, 
          runDateDisplay: sched.runDateDisplay || t("Unscheduled"), 
          schedMachine: sched.machine || '-' 
        };
    }).sort((a, b) => a.runDateMs - b.runDateMs || b.extPending - a.extPending);
  }, [activeOrdersData, scheduleMap, dashboardData.incoming]);

  const pendingCutting = useMemo(() => {
    return activeOrdersData.filter(o => o.requiresCutting && o.cutPending > 0.5).map(o => {
        const sched = scheduleMap[o.jo]?.cutting || scheduleMap[o.jo]?.general || {};
        
        // Calculate physical goods sitting on the floor waiting to be cut
        const availableToCut = Math.max(0, o.extCompleted - o.cutCompleted);
        
        return { 
          ...o, 
          availableToCut, 
          runDateMs: sched.runDateMs || 9999999999999, 
          runDateDisplay: sched.runDateDisplay || t("Unscheduled"), 
          schedMachine: sched.machine || '-' 
        };
    }).sort((a, b) => {
        // Priority 1: Physically ready to cut right now
        const aReady = a.availableToCut > 0.5;
        const bReady = b.availableToCut > 0.5;
        
        if (aReady && !bReady) return -1;
        if (!aReady && bReady) return 1;
        
        // Priority 2: According to the Schedule
        if (a.runDateMs !== b.runDateMs) return a.runDateMs - b.runDateMs;
        
        // Priority 3: Quantity available
        return b.availableToCut - a.availableToCut;
    });
  }, [activeOrdersData, scheduleMap]);

  const pendingPacking = useMemo(() => {
    return activeOrdersData.filter(o => o.packPending > 0.5).map(o => {
        const sched = scheduleMap[o.jo]?.packing || scheduleMap[o.jo]?.general || {};
        
        // Calculate physical goods waiting to be packed from upstream
        const upstreamCompleted = o.requiresCutting ? o.cutCompleted : o.extCompleted;
        const availableToPack = Math.max(0, upstreamCompleted - o.packCompleted);

        return { 
          ...o, 
          availableToPack, 
          runDateMs: sched.runDateMs || 9999999999999, 
          runDateDisplay: sched.runDateDisplay || t("Unscheduled"), 
          schedMachine: sched.machine || '-' 
        };
    }).sort((a, b) => {
        // Priority 1: Physically ready to pack right now
        const aReady = a.availableToPack > 0.5;
        const bReady = b.availableToPack > 0.5;
        
        if (aReady && !bReady) return -1;
        if (!aReady && bReady) return 1;
        
        // Priority 2: According to the Schedule
        if (a.runDateMs !== b.runDateMs) return a.runDateMs - b.runDateMs;
        
        return b.availableToPack - a.availableToPack;
    });
  }, [activeOrdersData, scheduleMap]);

  // --- AUTO SCHEDULE ENGINE ---
  const handleAutoSchedule = async () => {
    const loadToast = toast.loading("Syncing latest data & generating schedule...");
    try {
        // 1. Fetch fresh data first to prevent the algorithm from "learning" from stale React cache
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?t=${new Date().getTime()}`);
        const result = await response.json();
        if (result.status !== 'success') throw new Error("Sync failed");
        
        const freshDashboardData = result.data;
        
        // 2. Re-build the schedule map from the fresh data so overrides are respected but deletions are caught
        const freshScheduleMap = {};
        (freshDashboardData.schedule || []).forEach(row => {
            const jo = String(row[1] || '').trim();
            const machine = String(row[2] || '').trim().toUpperCase();
            if (!freshScheduleMap[jo]) freshScheduleMap[jo] = { extrusion: null, cutting: null, packing: null, general: null };
            const schedObj = { machine };
            if (machine.startsWith('B')) freshScheduleMap[jo].extrusion = schedObj;
            else if (machine.startsWith('C')) freshScheduleMap[jo].cutting = schedObj;
            else if (machine.startsWith('P')) freshScheduleMap[jo].packing = schedObj;
            else freshScheduleMap[jo].general = schedObj;
        });

        const jobs = activeOrdersData.filter(o => o.urgency !== 6); 
        const sortedJobs = [...jobs].sort((a, b) => (a.urgency || 5) - (b.urgency || 5) || a.issueDateMs - b.issueDateMs);

        const now = new Date();
        now.setHours(8, 0, 0, 0); 
        if (new Date().getHours() >= 20) now.setDate(now.getDate() + 1); 
        const startTime = now.getTime();

        const machines = {
            ext: ['B1','B2','B3','B4','B5','B6','B7','B8','B9'].map(id => ({ id, freeAt: startTime })),
            cut: ['C1','C2','C3','C4','C5','C6','C7'].map(id => ({ id, freeAt: startTime })),
            pack: ['P'].map(id => ({ id, freeAt: startTime })) // Single packing team instead of P1/P2/P3
        };

        const newSchedule = [];
        const pipelineReadyTimes = {}; // Replaces jobFinishTimes to track concurrent roll availability

        // EXTRUSION (Smart-Assignment & Rule-Based Routing)
        sortedJobs.filter(o => o.extPending > 0.5).forEach(job => {
            
            // 1. Intelligently Extract Width & Material for Machine Routing
            let widthMm = 0;
            if (job.dimension && job.dimension !== '-') {
                // Bulletproof regex: grabs the first number regardless of leading quotes or spaces
                const match = String(job.dimension).match(/(\d+(?:\.\d+)?)/);
                if (match) {
                    let val = parseFloat(match[1]);
                    // Auto-convert inches to mm if quotes or "inch" are detected
                    if (String(job.dimension).includes('"') || String(job.dimension).toLowerCase().includes('inch')) {
                        val = val * 25.4; 
                    }
                    widthMm = val;
                }
            }

            const isHDPE = job.description && (job.description.toUpperCase().includes('HDPE') || job.description.toUpperCase().includes('HD '));
            let allowedMachines = SCHEDULING_CONFIG.defaultExtrusionMachines;

            // Apply routing rules dynamically from the Configuration Engine
            if (widthMm > 0) {
                const matchedRule = SCHEDULING_CONFIG.extrusionRoutingRules.find(r => 
                    (isHDPE ? r.material === 'HDPE' : r.material === 'LDPE') &&
                    widthMm >= r.minWidth && widthMm <= r.maxWidth
                );
                
                if (matchedRule) {
                    allowedMachines = matchedRule.machines;
                }
            }

            // Check if supervisor already assigned a specific machine in the fresh Google Sheet data
            const existingMachine = freshScheduleMap[job.jo]?.extrusion?.machine || freshScheduleMap[job.jo]?.general?.machine;
            let m;
            
            if (existingMachine && machines.ext.find(mx => mx.id === existingMachine)) {
                // Force it to use the manually assigned machine
                m = machines.ext.find(mx => mx.id === existingMachine);
            } else {
                // Filter down to ONLY the allowed machines, and find the earliest free one
                let eligibleMachines = machines.ext.filter(mx => allowedMachines.includes(mx.id));
                if (eligibleMachines.length === 0) eligibleMachines = machines.ext; // Absolute fallback
                
                eligibleMachines.sort((a, b) => a.freeAt - b.freeAt);
                m = eligibleMachines[0];
            }
            
            const startMs = m.freeAt;
            
            newSchedule.push([
                new Date(startMs).toLocaleDateString('en-GB'),
                job.jo,
                m.id,
                `${job.description || '-'} (${job.dimension || '-'})`,
                job.target
            ]);
            
            // Draw capacities from Configuration Engine
            const capacity = SCHEDULING_CONFIG.capacities.extrusion[m.id] || SCHEDULING_CONFIG.capacities.extrusion.default;
            const shifts = Math.ceil(job.extPending / capacity);
            
            // CONCURRENCY CALCULATION: How long does it take to push out ONE roll?
            const shiftDurationMs = 12 * 60 * 60 * 1000;
            const timeToFirstRollMs = (SCHEDULING_CONFIG.concurrency.rollWeightKg / capacity) * shiftDurationMs;
            const transitMs = SCHEDULING_CONFIG.concurrency.transitTimeMins * 60 * 1000;
            
            if (!pipelineReadyTimes[job.jo]) pipelineReadyTimes[job.jo] = {};
            // The material is available for Cutting the moment the first roll is done + transit time
            pipelineReadyTimes[job.jo].extToCut = startMs + timeToFirstRollMs + transitMs;
            
            // Block the Extrusion machine for the total order duration
            m.freeAt += shifts * shiftDurationMs;
        });

        // CUTTING (Smart-Assignment)
        sortedJobs.filter(o => o.requiresCutting && o.cutPending > 0.5).forEach(job => {
            const existingMachine = freshScheduleMap[job.jo]?.cutting?.machine || freshScheduleMap[job.jo]?.general?.machine;
            let m;

            if (existingMachine && machines.cut.find(mx => mx.id === existingMachine)) {
                m = machines.cut.find(mx => mx.id === existingMachine);
            } else {
                machines.cut.sort((a, b) => a.freeAt - b.freeAt);
                m = machines.cut[0];
            }

            // Start when the Machine is free OR when the first Extrusion roll arrives (whichever is later)
            const extFirstRollArrives = pipelineReadyTimes[job.jo]?.extToCut || startTime;
            const startMs = Math.max(m.freeAt, extFirstRollArrives);
            
            newSchedule.push([
                new Date(startMs).toLocaleDateString('en-GB'),
                job.jo,
                m.id,
                `${job.description || '-'} (${job.dimension || '-'})`,
                job.target
            ]);
            
            // Draw capacities from Configuration Engine
            const isPcs = job.target.toUpperCase().includes('PCS');
            const capacity = (m.id === 'C5' && isPcs) 
                  ? SCHEDULING_CONFIG.capacities.cutting['C5_pcs'] 
                  : (isPcs ? SCHEDULING_CONFIG.capacities.cutting.defaultPcs : SCHEDULING_CONFIG.capacities.cutting.defaultKg);
                  
            const shiftDurationMs = 12 * 60 * 60 * 1000;
            const shifts = Math.ceil(job.cutPending / capacity);
            
            // CONCURRENCY CALCULATION: How long does it take to cut the first batch?
            const packTriggerQty = isPcs ? SCHEDULING_CONFIG.concurrency.packBatchPcs : SCHEDULING_CONFIG.concurrency.packBatchKg;
            const timeToFirstBatchMs = (packTriggerQty / capacity) * shiftDurationMs;
            const transitMs = SCHEDULING_CONFIG.concurrency.transitTimeMins * 60 * 1000;
            
            if (!pipelineReadyTimes[job.jo]) pipelineReadyTimes[job.jo] = {};
            // Material is available for Packing the moment the first cut batch is done + transit time
            pipelineReadyTimes[job.jo].cutToPack = startMs + timeToFirstBatchMs + transitMs;
            
            // Block the Cutting machine for the total order duration
            m.freeAt = startMs + (shifts * shiftDurationMs);
        });

        // PACKING (Smart-Assignment)
        sortedJobs.filter(o => o.packPending > 0.5).forEach(job => {
            const existingMachine = freshScheduleMap[job.jo]?.packing?.machine || freshScheduleMap[job.jo]?.general?.machine;
            let m;

            if (existingMachine && machines.pack.find(mx => mx.id === existingMachine)) {
                m = machines.pack.find(mx => mx.id === existingMachine);
            } else {
                machines.pack.sort((a, b) => a.freeAt - b.freeAt);
                m = machines.pack[0];
            }

            // Start Packing when the team is free OR when the first Cut/Extruded batch arrives
            const firstBatchArrives = job.requiresCutting ? (pipelineReadyTimes[job.jo]?.cutToPack || startTime) : (pipelineReadyTimes[job.jo]?.extToCut || startTime);
            const startMs = Math.max(m.freeAt, firstBatchArrives);
            
            newSchedule.push([
                new Date(startMs).toLocaleDateString('en-GB'),
                job.jo,
                m.id,
                `${job.description || '-'} (${job.dimension || '-'})`,
                job.target
            ]);
            
            // Draw capacities from Configuration Engine
            const capacity = job.target.toUpperCase().includes('PCS') ? SCHEDULING_CONFIG.capacities.packing.pcs : SCHEDULING_CONFIG.capacities.packing.kg;
            const shifts = Math.ceil(job.packPending / capacity);
            m.freeAt = startMs + (shifts * 12 * 60 * 60 * 1000);
        });

        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: 'updateSchedule', schedule: newSchedule })
        });

        toast.success("Schedule optimized & saved!", { id: loadToast });
        fetchDashboardData();
    } catch (error) {
        toast.error("Auto-scheduling failed.", { id: loadToast });
    }
  };

  const materialSuggestions = useMemo(() => Array.from(new Set((dashboardData?.incoming || []).map(row => row[2]))), [dashboardData]);

  useEffect(() => {
    if (quickMaterialBatch && dashboardData?.incoming) {
      const match = dashboardData.incoming.find(row => row[5] === quickMaterialBatch);
      if (match) { setQuickMaterialName(match[2] || ''); setQuickMaterialId(match[6] || 'N/A'); } 
      else { setQuickMaterialName(''); setQuickMaterialId(''); }
    } else { setQuickMaterialName(''); setQuickMaterialId(''); }
  }, [quickMaterialBatch, dashboardData]);

  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [flagData, setFlagData] = useState({ department: '', date: '', jobOrder: '', reason: '' });

  const [massBalance, setMassBalance] = useState({ totalInput: 0, totalAccounted: 0, discrepancyKg: 0, discrepancyPercent: 0, isFailed: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Live Mass Balance Integrity Evaluation (Now allows up to 40% variance)
  useEffect(() => {
    if (!['Extrusion', 'Cutting'].includes(department)) return;
    let totalInput = department === 'Extrusion' ? (formData.extrusionMaterials || []).reduce((sum, mat) => sum + Number(mat.quantity || 0), 0) : Number(formData.inputRollWeight || 0);
    
    // Fetch itemWeight to convert pcs to kg
    let itemWeight = 0;
    if (formData.jobOrder && dashboardData?.masterOrders) {
      const order = dashboardData.masterOrders.find(o => o.jo === formData.jobOrder);
      if (order) itemWeight = order.itemWeight || 0;
    }

    let outputWeight = 0;
    if (formData.uom === 'kg') {
      outputWeight = Number(formData.actualOutput || 0);
    } else if (formData.uom === 'pcs') {
      outputWeight = Number(formData.actualOutput || 0) * itemWeight;
    }

    const totalWastage = Number(formData.setupScrap || 0) + Number(formData.processScrap || 0) + Number(formData.rejections || 0);
    const totalAccounted = outputWeight + totalWastage;
    const discrepancyKg = totalInput - totalAccounted;
    const discrepancyPercent = totalInput > 0 ? (Math.abs(discrepancyKg) / totalInput) * 100 : 0;
    
    // Updated threshold: 40%
    const isFailed = (formData.uom === 'pcs' && itemWeight === 0) ? false : discrepancyPercent > 40.0;

    setMassBalance({ totalInput, totalAccounted, discrepancyKg, discrepancyPercent, isFailed });
  }, [formData.extrusionMaterials, formData.inputRollWeight, formData.actualOutput, formData.setupScrap, formData.processScrap, formData.rejections, formData.uom, formData.jobOrder, department, dashboardData.masterOrders]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!pinInput || pinInput.length < 4) { toast.error("Please enter a valid PIN (minimum 4 digits)."); return; }
    setIsLoggingIn(true);
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', body: JSON.stringify({ action: 'login', pin: pinInput }) });
      const result = await response.json();
      if (result.status === 'success') {
        setCurrentUser(result.user); setIsLoggedIn(true); setPinInput(''); setDepartment(result.user.department);
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) setFormData(getInitialFormData(result.user)); 
        if (result.user.department === 'Quality Control') {
           setQcStage('Extrusion');
           setQcActiveForm('machine');
        }
        toast.success(`Welcome back, ${result.user.name}`, { icon: '👋' });
      } else toast.error(result.message || "Invalid PIN. Please try again.");
    } catch (error) { toast.error("Network error. Please check your connection."); } 
    finally { setIsLoggingIn(false); }
  };

  const handleLogout = () => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-bold text-slate-800">Exit Application?</p>
        <p className="text-sm text-slate-600">Any un-submitted draft data will be wiped entirely. Ensure you have submitted your report.</p>
        <div className="flex gap-3 justify-end mt-2">
          <button onClick={() => toast.dismiss(t.id)} className="px-4 py-2 text-sm font-bold bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">Cancel</button>
          <button onClick={() => {
            setIsLoggedIn(false); setCurrentUser(null); setDepartment('Dashboard'); localStorage.removeItem(STORAGE_KEY); setFormData(getInitialFormData()); setEvidenceImageFile(null); setEvidenceImagePreview(null);
            toast.dismiss(t.id);
          }} className="px-4 py-2 text-sm font-bold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm">Confirm Exit</button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Intercept specific fields and forcefully convert them to uppercase in the data payload
    const autoCapitaliseFields = ['jobOrder', 'machineId', 'batchNumber', 'restockMaterial', 'poNumber', 'deliveryOrderNo', 'location', 'reqItemName'];
    const finalValue = autoCapitaliseFields.includes(name) ? value.toUpperCase() : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  // Image Upload Handlers
  const handleEvidenceImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { 
        toast.error("Image file is too large. Max size is 5MB.");
        return;
      }
      setEvidenceImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEvidenceImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearEvidenceImage = () => {
    setEvidenceImageFile(null);
    setEvidenceImagePreview(null);
  };

  // Resets image specifically when changing the active QC form tab
  const handleQcFormSwitch = (formType) => {
    setQcActiveForm(formType);
    clearEvidenceImage();
  };

  // --- Auto Batch Generator & Incoming Goods Handlers ---
  const handleAutoBatch = () => {
    if (!formData.restockMaterial) return toast.error("Select a material first to generate a batch.");
    const palletCount = parseInt(quickPalletCount, 10) || 1;
    const amountPerPallet = parseFloat(formData.restockAmount);

    if (!amountPerPallet) return toast.error("Enter the Amount (kg) per pallet first.");

    const matStr = formData.restockMaterial.toUpperCase();
    const supStr = (formData.supplier || '').toUpperCase();

    let prefix = 'LD'; // Default
    if (matStr.includes('HD')) prefix = 'HD';
    else if (matStr.includes('LL')) prefix = 'LL';

    let grade = '';
    const gradeMatch = matStr.match(/(N[1-3]|F\d{3,}[A-Z]*|\d{4,}[A-Z]*)/);
    if (gradeMatch) grade = gradeMatch[1];

    let supplierCode = '';
    if (supStr.includes('ECO REPRO') || supStr === 'ER') supplierCode = 'ER';
    else if (supStr.includes('CY') || matStr.includes('CY')) supplierCode = 'CY';
    else if (supStr.includes('NP') || matStr.includes('NP')) supplierCode = 'NP';
    else if (supStr) supplierCode = supStr.replace(/[^A-Z]/g, '').substring(0, 2);

    const baseCode = `${prefix}${grade}${supplierCode}`;

    const history = dashboardData.incoming || [];
    let maxIncrement = 0;

    history.forEach(row => {
      const batch = String(row[5] || '').trim().toUpperCase();
      if (batch.startsWith(baseCode)) {
         const match = batch.match(/-(\d+)$/);
         if (match) {
           const num = parseInt(match[1], 10);
           if (num > maxIncrement) maxIncrement = num;
         }
      }
    });

    const newBatches = [];
    for (let i = 1; i <= palletCount; i++) {
      newBatches.push({
        id: Date.now() + i,
        batchNo: `${baseCode}-${maxIncrement + i}`,
        amount: amountPerPallet
      });
    }

    setFormData(prev => ({ ...prev, incomingBatches: [...(prev.incomingBatches || []), ...newBatches] }));
    setQuickPalletCount('1'); 
    toast.success(`Generated ${palletCount} batch(es) successfully!`, { icon: '✨' });
  };

  const updateIncomingBatchNo = (id, newNo) => {
    setFormData(prev => ({ ...prev, incomingBatches: (prev.incomingBatches || []).map(b => b.id === id ? { ...b, batchNo: newNo.toUpperCase() } : b) }));
  };

  const updateIncomingBatchAmount = (id, newAmt) => {
    setFormData(prev => ({ ...prev, incomingBatches: (prev.incomingBatches || []).map(b => b.id === id ? { ...b, amount: newAmt } : b) }));
  };

  const removeIncomingBatch = (id) => {
    setFormData(prev => ({ ...prev, incomingBatches: (prev.incomingBatches || []).filter(b => b.id !== id) }));
  };

  // --- Accumulator & Inline Edit Handlers ---
  const updateRollWeight = (id, newWeight) => {
    const newRolls = (formData.extrusionRolls || []).map(r => r.id === id ? { ...r, weight: newWeight } : r);
    setFormData(prev => ({ ...prev, extrusionRolls: newRolls, actualOutput: newRolls.reduce((sum, r) => sum + r.weight, 0).toFixed(2) }));
  };

  const updateMaterialQuantity = (id, newWeightKg) => {
    const newMats = (formData.extrusionMaterials || []).map(m => m.id === id ? { ...m, quantity: newWeightKg, originalQuantity: m.uom === 'bag' ? newWeightKg/25 : newWeightKg } : m);
    setFormData(prev => ({ ...prev, extrusionMaterials: newMats }));
  };

  const updateScrapWeight = (id, newWeight) => {
    const newScrap = (formData.scrapEntries || []).map(s => s.id === id ? { ...s, weight: newWeight } : s);
    const newSetup = newScrap.filter(s => s.type === 'setupScrap').reduce((sum, s) => sum + s.weight, 0);
    const newProcess = newScrap.filter(s => s.type === 'processScrap').reduce((sum, s) => sum + s.weight, 0);
    setFormData(prev => ({ ...prev, scrapEntries: newScrap, setupScrap: newSetup > 0 ? newSetup.toFixed(2) : '', processScrap: newProcess > 0 ? newProcess.toFixed(2) : '' }));
  };

  const updateBagWeight = (id, newWeight) => {
    setFormData(prev => ({ ...prev, bagWeights: prev.bagWeights.map(bag => bag.id === id ? { ...bag, weight: newWeight } : bag) }));
  };
  
  const addBagWeightRow = () => setFormData(prev => ({ ...prev, bagWeights: [...prev.bagWeights, { id: Date.now(), weight: '' }] }));
  const removeBagWeightRow = (id) => setFormData(prev => ({ ...prev, bagWeights: prev.bagWeights.filter(bag => bag.id !== id) }));

  const handleAddRoll = () => {
    if (!quickRollWeight || isNaN(quickRollWeight)) return;
    const newRolls = [...(formData.extrusionRolls || []), { id: Date.now(), weight: Number(quickRollWeight), time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }];
    setFormData(prev => ({ ...prev, extrusionRolls: newRolls, actualOutput: newRolls.reduce((sum, r) => sum + r.weight, 0).toFixed(2) }));
    setQuickRollWeight('');
  };
  const handleRemoveRoll = (id) => {
    const newRolls = (formData.extrusionRolls || []).filter(r => r.id !== id);
    setFormData(prev => ({ ...prev, extrusionRolls: newRolls, actualOutput: newRolls.reduce((sum, r) => sum + r.weight, 0).toFixed(2) }));
  };

  const handleAddMaterial = () => {
    if (!quickMaterialWeight || isNaN(quickMaterialWeight)) return;
    const weightInKg = quickMaterialUom === 'bag' ? Number(quickMaterialWeight) * 25 : Number(quickMaterialWeight);
    const newMats = [...(formData.extrusionMaterials || []), { 
      id: Date.now(), batchNo: quickMaterialBatch || 'N/A', materialId: quickMaterialId || 'N/A', materialName: quickMaterialName || 'N/A',
      uom: quickMaterialUom, originalQuantity: Number(quickMaterialWeight), quantity: weightInKg, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
    }];
    setFormData(prev => ({ ...prev, extrusionMaterials: newMats }));
    setQuickMaterialBatch(''); setQuickMaterialId(''); setQuickMaterialName(''); setQuickMaterialWeight(''); setQuickMaterialUom('kg');
  };
  const handleRemoveMaterial = (id) => setFormData(prev => ({ ...prev, extrusionMaterials: (prev.extrusionMaterials || []).filter(m => m.id !== id) }));

  const handleAddScrap = () => {
    if (!quickScrapWeight || isNaN(quickScrapWeight)) return;
    const newScrap = [...(formData.scrapEntries || []), { id: Date.now(), type: quickScrapType, weight: Number(quickScrapWeight), time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }];
    const newSetup = newScrap.filter(s => s.type === 'setupScrap').reduce((sum, s) => sum + s.weight, 0);
    const newProcess = newScrap.filter(s => s.type === 'processScrap').reduce((sum, s) => sum + s.weight, 0);
    setFormData(prev => ({ ...prev, scrapEntries: newScrap, setupScrap: newSetup > 0 ? newSetup.toFixed(2) : '', processScrap: newProcess > 0 ? newProcess.toFixed(2) : '' }));
    setQuickScrapWeight('');
  };
  const handleRemoveScrap = (id) => {
    const newScrap = (formData.scrapEntries || []).filter(s => s.id !== id);
    const newSetup = newScrap.filter(s => s.type === 'setupScrap').reduce((sum, s) => sum + s.weight, 0);
    const newProcess = newScrap.filter(s => s.type === 'processScrap').reduce((sum, s) => sum + s.weight, 0);
    setFormData(prev => ({ ...prev, scrapEntries: newScrap, setupScrap: newSetup > 0 ? newSetup.toFixed(2) : '', processScrap: newProcess > 0 ? newProcess.toFixed(2) : '' }));
  };

  const fetchDashboardData = async () => {
    setIsFetchingDashboard(true);
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?t=${new Date().getTime()}`);
      const result = await response.json();
      if (result.status === 'success') {
        setDashboardData(result.data);
        toast.success("Dashboard refreshed");
      }
      else toast.error("Dashboard Sync Failed: " + result.message);
    } catch (error) { toast.error("Failed to connect to server."); } 
    finally { setIsFetchingDashboard(false); }
  };

  useEffect(() => { if (isLoggedIn && (department === 'Dashboard' || department === 'Inventory' || department === 'Job Schedule')) fetchDashboardData(); }, [department, isLoggedIn]);

  const handleFlagSubmit = async () => {
    if (!flagData.reason) return toast.error("Please provide a reason.");
    const loadToast = toast.loading("Submitting flag...");
    try {
      await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, 
        body: JSON.stringify({ action: 'flag', flagDepartment: flagData.department, flagDate: flagData.date, flagJobOrder: flagData.jobOrder, flagReason: flagData.reason, supervisor: currentUser.name }) 
      });
      toast.success("Error flag successfully raised.", { id: loadToast });
      setIsFlagModalOpen(false);
    } catch (error) { toast.error("Network error: Could not submit flag.", { id: loadToast }); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    // Leverage native HTML5 form validation to guide operators to missed fields
    if (formRef.current && !formRef.current.reportValidity()) {
      toast.error("Please complete all required fields highlighted on the form.", { position: 'top-center', duration: 4000 });
      return;
    }
    
    // JO Master List Validation Interceptor
    const isJoEntered = formData.jobOrder && formData.jobOrder.trim().length > 0;
    const isValidJo = isJoEntered ? dashboardData?.masterOrders?.some(o => o.jo === formData.jobOrder) : true;
    
    if (['Extrusion', 'Cutting', 'Packing', 'Dispatch'].includes(department) && isJoEntered && !isValidJo) {
       toast.error("Invalid Job Order! Please enter a JO that exists in the Master List.", { position: 'top-center' }); return;
    }

    if ((department === 'Extrusion' || department === 'Cutting') && massBalance.isFailed && !formData.discrepancyReason) {
      toast.error(t("Discrepancy Must Be Resolved"), { position: 'top-center', style: { border: '1px solid #ef4444', color: '#ef4444' } }); return;
    }
    
    if (department === 'Incoming Goods' && (!formData.incomingBatches || formData.incomingBatches.length === 0)) {
      toast.error("Please generate at least one pallet batch before saving.", { position: 'top-center' }); return;
    }

    setIsSubmitting(true);
    const loadToast = toast.loading("Saving Shift Log to Database...");
    try {
      // Handle Base64 Image Conversion for Payload
      let base64Data = null;
      let mimeType = null;
      let fileName = null;

      if (evidenceImageFile && evidenceImagePreview) {
        base64Data = evidenceImagePreview.split(',')[1];
        mimeType = evidenceImageFile.type;
        const ext = mimeType.split('/')[1] || 'png';
        fileName = `Evidence_${department.replace(/\s+/g, '_')}_${Date.now()}.${ext}`;
      }

      const resolvedQcStage = department === 'Quality Control' ? (qcActiveForm === 'machine' ? 'Machine Inspection' : qcStage) : qcStage;
      const payload = { 
        ...formData, 
        department, 
        qcStage: resolvedQcStage, 
        massDiscrepancyKg: massBalance.discrepancyKg, 
        massDiscrepancyPercent: massBalance.discrepancyPercent,
        evidenceImageData: base64Data,
        evidenceImageMimeType: mimeType,
        evidenceImageName: fileName
      };
      
      await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) });
      toast.success(`Shift log saved successfully! [${t(department)}]`, { id: loadToast });
      
      const updateHist = (key, value) => {
        if (!value) return JSON.parse(localStorage.getItem(key) || '[]');
        const updated = Array.from(new Set([value, ...JSON.parse(localStorage.getItem(key) || '[]')])).slice(0, 10);
        localStorage.setItem(key, JSON.stringify(updated)); return updated;
      };
      
      let batchesToSave = formData.batchNumber ? [formData.batchNumber] : [];
      (formData.extrusionMaterials || []).forEach(m => { if (m.batchNo) batchesToSave.push(m.batchNo); });
      let currentBatches = Array.from(new Set([...batchesToSave, ...JSON.parse(localStorage.getItem('hist_batches') || '[]')])).slice(0, 15);
      localStorage.setItem('hist_batches', JSON.stringify(currentBatches));

      setLocalHistory({ machineIds: updateHist('hist_machines', formData.machineId), batchNos: currentBatches, suppliers: updateHist('hist_suppliers', formData.supplier), downtimeReasons: updateHist('hist_downtime', formData.downtimeReason) });

      localStorage.removeItem(STORAGE_KEY);
      setFormData(getInitialFormData(currentUser)); 
      clearEvidenceImage();
      
      // Instantly sync with the backend so the Ready to Ship Tracker (and Dashboard) updates live!
      fetchDashboardData();
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) { toast.error("Network error: Could not connect to database.", { id: loadToast }); } 
    finally { setIsSubmitting(false); }
  };

  const calculateTrend = (current, previous) => {
    if (!previous || previous === 0) return { val: 0, dir: 'none' };
    const pct = ((current - previous) / previous) * 100;
    return { val: Math.abs(pct).toFixed(1), dir: pct > 0 ? 'up' : pct < 0 ? 'down' : 'none' };
  };

  const currentAnalytics = dashboardData.analytics?.[analyticsDept]?.[analyticsPeriod] || defaultAnalytics.daily;
  const trendOutput = calculateTrend(currentAnalytics.output, currentAnalytics.prevOutput);
  const trendConsumption = calculateTrend(currentAnalytics.consumption, currentAnalytics.prevConsumption);
  const trendWastage = calculateTrend(currentAnalytics.wastage, currentAnalytics.prevWastage);

  const handleScroll = (e) => {
    const currentScrollY = e.target.scrollTop;
    
    // Prevent iOS Safari "rubber band" bounce from erratically hiding/showing the button
    if (currentScrollY <= 0) {
      setIsFooterVisible(true);
      lastScrollY.current = currentScrollY;
      return;
    }

    // Check if user has scrolled to the absolute bottom of the container
    const isAtBottom = Math.ceil(currentScrollY + e.target.clientHeight) >= e.target.scrollHeight - 20;

    if (isAtBottom) {
      setIsFooterVisible(true);  // Always show footer when at the bottom
    } else if (currentScrollY > lastScrollY.current + 5 && currentScrollY > 50) {
      setIsFooterVisible(false); // Scrolling down (with a 5px threshold to ignore micro-scrolls)
    } else if (currentScrollY < lastScrollY.current - 5) {
      setIsFooterVisible(true);  // Scrolling up
    }
    
    lastScrollY.current = currentScrollY;
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[100dvh] bg-slate-900 flex items-center justify-center p-4 relative">
        <Toaster />
        <div className="absolute top-4 right-4"><button onClick={() => setLanguage(l => l === 'en' ? 'bn' : l === 'bn' ? 'ms' : 'en')} className="flex items-center gap-2 text-slate-300 hover:text-white bg-slate-800 px-4 py-2 rounded-full text-sm font-medium transition-colors border border-slate-700 shadow-sm"><Globe size={16} /> {language === 'en' ? 'বাংলা' : language === 'bn' ? 'Bahasa Melayu' : 'English'}</button></div>
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="bg-slate-800 p-10 text-center border-b border-slate-700">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-[0_0_20px_rgba(37,99,235,0.4)]"><Lock size={40} className="text-white" /></div>
            <h1 className="text-3xl font-black text-white mb-2">{t("Production Hub")}</h1>
            <p className="text-slate-400 text-sm font-bold tracking-wide">{t("Secure Operator Access")}</p>
          </div>
          <form onSubmit={handleLogin} className="p-8 space-y-8">
            <div>
              <label className="block text-base font-bold text-slate-700 mb-3">{t("Enter Operator PIN")}</label>
              <input type="password" pattern="[0-9]*" inputMode="numeric" value={pinInput} onChange={(e) => setPinInput(e.target.value)} placeholder="••••" className="w-full text-center text-4xl tracking-widest p-5 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all" autoFocus />
            </div>
            <button type="submit" disabled={isLoggingIn} className={`w-full py-4 rounded-2xl text-lg font-bold text-white transition-all shadow-md active:scale-95 ${isLoggingIn ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5'}`}>{isLoggingIn ? t("Verifying Credentials...") : t("Secure Login")}</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-slate-100 flex flex-col md:flex-row font-sans text-slate-800">
      <Toaster />

      {/* --- LOG DETAILS MODAL (BANNER) --- */}
      <LogDetailsBanner log={selectedLog} onClose={() => setSelectedLog(null)} masterOrders={dashboardData?.masterOrders || []} />

      {/* --- FLAG MODAL --- */}
      {isFlagModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2 text-amber-600"><Flag size={24} className="fill-amber-600" /><h3 className="font-black text-lg">Flag Record Error</h3></div>
              <button onClick={() => setIsFlagModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-white border border-slate-200 p-2 rounded-xl transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-5">
              <p className="text-base text-slate-600 leading-relaxed">You are flagging a potential error in a recorded log. Management will review this record securely.</p>
              <div className="bg-slate-100 p-4 rounded-xl text-base text-slate-700 grid grid-cols-2 gap-4 border border-slate-200">
                <div><span className="font-black block text-[11px] uppercase text-slate-500 tracking-wider">Department</span> {t(flagData.department)}</div>
                <div><span className="font-black block text-[11px] uppercase text-slate-500 tracking-wider">Date</span> {flagData.date}</div>
                <div className="col-span-2"><span className="font-black block text-[11px] uppercase text-slate-500 tracking-wider">Job Order</span> <span className="font-bold text-slate-900">{flagData.jobOrder}</span></div>
              </div>
              <div>
                <label className="block text-base font-bold text-slate-700 mb-2">Reason for Flagging</label>
                <textarea className="w-full p-4 text-base border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-shadow" rows="3" placeholder="E.g., Incorrect weight entered..." value={flagData.reason} onChange={(e) => setFlagData({...flagData, reason: e.target.value})}></textarea>
              </div>
              <button onClick={handleFlagSubmit} className="w-full bg-amber-600 hover:bg-amber-700 text-white text-lg font-bold py-4 rounded-xl transition-all shadow-sm hover:shadow active:scale-95">Submit Error Flag</button>
            </div>
          </div>
        </div>
      )}

      {/* --- QR SCANNER MODAL --- */}
      {isScanningQR && <QRScannerModal onScan={handleQRScan} onClose={() => setIsScanningQR(false)} />}

      {/* --- COLLAPSIBLE SIDEBAR --- */}
      <div className={`fixed inset-0 bg-slate-900/60 z-40 transition-opacity backdrop-blur-sm md:hidden ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)} />
      
      <aside className={`fixed md:sticky top-0 left-0 z-50 h-screen bg-slate-900 text-white w-72 flex flex-col transition-transform duration-300 shrink-0 shadow-2xl md:shadow-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 print:hidden`}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div><h1 className="text-2xl font-black tracking-tight text-white">DPR Hub</h1><p className="text-[11px] font-bold text-blue-400 tracking-wider uppercase mt-1">Operational Logbook</p></div>
          <button className="md:hidden text-slate-400 hover:text-white bg-slate-800 p-2 rounded-xl" onClick={() => setIsSidebarOpen(false)}><X size={20}/></button>
        </div>
        
        <div className="p-5 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-4">
            <UserCircle className="text-blue-500" size={36} />
            <div className="text-base min-w-0">
              <p className="font-black leading-tight truncate">{currentUser.name}</p>
              <p className="text-xs font-bold text-slate-400 mt-1 truncate">{t(currentUser.role)} • {currentUser.shift}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {['Dashboard', 'Job Schedule', 'Inventory', 'Purchase Requisition', 'Extrusion', 'Cutting', 'Packing', 'Dispatch', 'Quality Control', 'Incoming Goods'].map((dept) => (
            <button key={dept} onClick={() => { setDepartment(dept); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-bold transition-all ${department === dept ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              {dept === 'Dashboard' && <BarChart3 size={20} />}
              {dept === 'Job Schedule' && <CalendarDays size={20} />}
              {dept === 'Inventory' && <Archive size={20} />}
              {dept === 'Purchase Requisition' && <ShoppingCart size={20} />}
              {dept === 'Extrusion' && <Activity size={20} />}
              {dept === 'Packing' && <Package size={20} />}
              {dept === 'Quality Control' && <CheckCircle size={20} />}
              {!['Dashboard', 'Job Schedule', 'Inventory', 'Purchase Requisition', 'Extrusion', 'Packing', 'Quality Control'].includes(dept) && <ClipboardList size={20} />}
              <span className="truncate">{t(dept)}</span>
            </button>
          ))}
        </nav>

        <div className="p-5 border-t border-slate-800 space-y-3">
          <button onClick={() => setLanguage(l => l === 'en' ? 'bn' : l === 'bn' ? 'ms' : 'en')} className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 py-3 rounded-xl text-sm font-black transition-colors"><Globe size={18} /> {language.toUpperCase()}</button>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white py-3 rounded-xl text-sm font-black transition-colors border border-red-500/20"><LogOut size={18} /> {t("Exit")}</button>
        </div>
      </aside>

      {/* --- PERSISTENT MASS BALANCE HUD --- */}
      {(department === 'Extrusion' || department === 'Cutting') && massBalance.totalInput > 0 && (
        <div className={`fixed bottom-24 right-5 z-[35] bg-white/95 backdrop-blur shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl p-5 border-l-4 w-72 transition-all duration-300 animate-in slide-in-from-right hidden md:block ${massBalance.isFailed ? 'border-red-500' : 'border-emerald-500'}`}>
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-black text-[11px] uppercase tracking-wider text-slate-500">Live Balance Check</h4>
            {massBalance.isFailed ? <AlertTriangle size={20} className="text-red-500 animate-pulse" /> : <Scale size={20} className="text-emerald-500" />}
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500 font-bold">Total Input:</span><span className="font-black text-slate-700">{massBalance.totalInput.toFixed(1)} kg</span></div>
            <div className="flex justify-between"><span className="text-slate-500 font-bold">Output+Wastage:</span><span className="font-black text-slate-700">{massBalance.totalAccounted.toFixed(1)} kg</span></div>
            <div className="pt-2 mt-2 border-t border-slate-100 flex justify-between items-center">
              <span className="font-black text-slate-800">Variance:</span>
              <span className={`font-black text-base ${massBalance.isFailed ? 'text-red-600' : 'text-emerald-600'}`}>{massBalance.discrepancyPercent.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col min-w-0 h-[100dvh] md:h-screen overflow-y-auto bg-slate-100/50 relative pb-32 md:pb-24" onScroll={handleScroll}>
        
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 sticky top-0 z-30 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600 p-2 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"><Menu size={20}/></button>
            <h2 className="font-black text-slate-800 text-lg tracking-tight truncate">{t(department)}</h2>
          </div>
        </header>

        <div className="p-4 sm:p-6 md:p-8 max-w-[1400px] mx-auto w-full flex-1">
          <datalist id="jo-suggestions">{joSuggestions.map(jo => <option key={jo} value={jo} />)}</datalist>
          <datalist id="material-suggestions">{materialSuggestions.map(mat => <option key={mat} value={mat} />)}</datalist>
          <datalist id="machine-suggestions">{localHistory.machineIds.map(m => <option key={m} value={m} />)}</datalist>
          <datalist id="batch-suggestions">{localHistory.batchNos.map(b => <option key={b} value={b} />)}</datalist>
          <datalist id="supplier-suggestions">{localHistory.suppliers.map(s => <option key={s} value={s} />)}</datalist>
          <datalist id="downtime-suggestions">{localHistory.downtimeReasons.map(d => <option key={d} value={d} />)}</datalist>

      {department === 'Dashboard' ? (
        <DashboardView 
         t={t} dashboardData={dashboardData} fetchDashboardData={fetchDashboardData} isFetchingDashboard={isFetchingDashboard}
         analyticsDept={analyticsDept} setAnalyticsDept={setAnalyticsDept} analyticsPeriod={analyticsPeriod} setAnalyticsPeriod={setAnalyticsPeriod}
         currentAnalytics={currentAnalytics} trendOutput={trendOutput} trendConsumption={trendConsumption} trendWastage={trendWastage}
         activeOrdersData={activeOrdersData} showCompleted={showCompleted} setShowCompleted={setShowCompleted} handleCycleStatus={handleCycleStatus}
         setFlagData={setFlagData} setIsFlagModalOpen={setIsFlagModalOpen} setSelectedLog={setSelectedLog}
        />
      ) : department === 'Job Schedule' ? (
          <JobScheduleView 
            t={t}
            handleAutoSchedule={handleAutoSchedule}
            fetchDashboardData={fetchDashboardData}
            isFetchingDashboard={isFetchingDashboard}
            scheduleTab={scheduleTab}
            setScheduleTab={setScheduleTab}
            extSchedule={extSchedule}
            pendingExtrusion={pendingExtrusion}
            cutSchedule={cutSchedule}
            pendingCutting={pendingCutting}
            packSchedule={packSchedule}
            pendingPacking={pendingPacking}
            activeOrdersData={activeOrdersData}
            setSelectedLog={setSelectedLog}
            handleUrgencyChange={handleUrgencyChange}
    />) : department === 'Inventory' ? (
              <InventoryView 
                t={t}
                inventoryTab={inventoryTab} setInventoryTab={setInventoryTab}
                stocktakeCategory={stocktakeCategory} setStocktakeCategory={setStocktakeCategory}
                stocktakeForm={stocktakeForm} setStocktakeForm={setStocktakeForm} initialStocktakeForm={initialStocktakeForm}
                setIsScanningQR={setIsScanningQR}
                fetchDashboardData={fetchDashboardData} isFetchingDashboard={isFetchingDashboard}
                rawMaterialsSummary={rawMaterialsSummary} warehouseGoodsData={warehouseGoodsData} dashboardData={dashboardData}
                activeRequisitions={activeRequisitions} handleResolveRequisition={handleResolveRequisition}
                uniqueFinishedGoods={uniqueFinishedGoods} uniqueRawMaterials={uniqueRawMaterials}
                handleStocktakeSubmit={handleStocktakeSubmit}
              />
            ) : ( <ProductionFormView 
                formRef={formRef}
                department={department} t={t} formData={formData} setFormData={setFormData} handleInputChange={handleInputChange} massBalance={massBalance}
                pendingExtrusion={pendingExtrusion} pendingCutting={pendingCutting} pendingPacking={pendingPacking} readyToShipData={readyToShipData} dashboardData={dashboardData}
                showCompleted={showCompleted} setShowCompleted={setShowCompleted}
                joSuggestions={joSuggestions} materialSuggestions={materialSuggestions} localHistory={localHistory}
                quickMaterialBatch={quickMaterialBatch} setQuickMaterialBatch={setQuickMaterialBatch} quickMaterialWeight={quickMaterialWeight} setQuickMaterialWeight={setQuickMaterialWeight} quickMaterialUom={quickMaterialUom} setQuickMaterialUom={setQuickMaterialUom} quickMaterialName={quickMaterialName} quickMaterialId={quickMaterialId}
                quickRollWeight={quickRollWeight} setQuickRollWeight={setQuickRollWeight} quickScrapType={quickScrapType} setQuickScrapType={setQuickScrapType} quickScrapWeight={quickScrapWeight} setQuickScrapWeight={setQuickScrapWeight} quickPalletCount={quickPalletCount} setQuickPalletCount={setQuickPalletCount}
                handleAddMaterial={handleAddMaterial} handleRemoveMaterial={handleRemoveMaterial} handleAddRoll={handleAddRoll} handleRemoveRoll={handleRemoveRoll} handleAddScrap={handleAddScrap} handleRemoveScrap={handleRemoveScrap}
                updateMaterialQuantity={updateMaterialQuantity} updateRollWeight={updateRollWeight} updateScrapWeight={updateScrapWeight} updateBagWeight={updateBagWeight} addBagWeightRow={addBagWeightRow} removeBagWeightRow={removeBagWeightRow}
                handleAutoBatch={handleAutoBatch} updateIncomingBatchNo={updateIncomingBatchNo} updateIncomingBatchAmount={updateIncomingBatchAmount} removeIncomingBatch={removeIncomingBatch}
                qcStage={qcStage} setQcStage={setQcStage} qcActiveForm={qcActiveForm} handleQcFormSwitch={handleQcFormSwitch}
                setIsScanningQR={setIsScanningQR} evidenceImagePreview={evidenceImagePreview} handleEvidenceImageChange={handleEvidenceImageChange} clearEvidenceImage={clearEvidenceImage}
              />
            )}
        </div>
      </main>

      {/* --- PERSISTENT FLOATING SUBMIT BUTTON --- */}
      {isLoggedIn && !['Dashboard', 'Inventory', 'Job Schedule'].includes(department) && (
        <div className={`fixed bottom-0 left-0 md:left-72 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 md:p-5 flex flex-col md:flex-row justify-between items-center z-40 transition-transform duration-300 ease-in-out ${isFooterVisible ? 'translate-y-0' : 'translate-y-[120%]'} shadow-[0_-10px_30px_rgba(0,0,0,0.05)]`}>
          <div className="flex items-center gap-4 mb-3 md:mb-0 w-full md:w-auto overflow-x-auto custom-scrollbar pb-1 md:pb-0">
             <div className="flex items-center gap-2 text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg shrink-0">
                <Clock size={16} /> <span className="text-sm font-semibold">{saveIndicator}</span>
             </div>
             {(department === 'Extrusion' || department === 'Cutting') && massBalance.isFailed && (
                <div className="min-w-[200px] shrink-0">
                  <input type="text" name="discrepancyReason" value={formData.discrepancyReason} onChange={handleInputChange} placeholder={t("Reason for Discrepancy (Required for Override)")} className="w-full px-3 py-2 text-sm border-2 border-red-300 bg-red-50 rounded-lg outline-none focus:border-red-500 text-red-900 placeholder:text-red-300" required />
                </div>
             )}
          </div>
          <div className="flex gap-3 w-full md:w-auto shrink-0">
            <button onClick={() => window.print()} className="hidden md:flex flex-1 md:flex-none items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors shadow-sm active:scale-95"><Printer size={18} /> {t("Print")}</button>
            <button onClick={handleSave} disabled={isSubmitting} className={`flex-[2] md:flex-none flex items-center justify-center gap-2 px-8 py-3.5 text-white rounded-xl font-black text-lg transition-all shadow-md active:scale-95 ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'}`}>
              <Save size={20} /> {isSubmitting ? t("Saving...") : t("Submit Shift Log")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;