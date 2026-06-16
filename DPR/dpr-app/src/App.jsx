import React, { useState, useEffect, useMemo } from 'react';
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
  X,
  Search,
  PackageCheck,
  Layers,
  Lock,
  LogOut,
  UserCircle,
  Globe
} from 'lucide-react';

// --- TRANSLATION DICTIONARY ---
const dict = {
  en: {
    "Production Hub": "Production Hub",
    "Secure Operator Access": "Secure Operator Access",
    "Enter Operator PIN": "Enter Operator PIN",
    "Secure Login": "Secure Login",
    "Verifying Credentials...": "Verifying Credentials...",
    "Session Parameters": "Session Parameters",
    "Date": "Date",
    "Shift": "Shift",
    "Morning (AM)": "Morning (AM)",
    "Night (PM)": "Night (PM)",
    "Operator / Supervisor": "Operator / Supervisor",
    "Receiver / Admin Name": "Receiver / Admin Name",
    "QC Inspector": "QC Inspector",
    "Machine No.": "Machine No.",
    "Material Inputs": "Material Inputs",
    "Job Order No.": "Job Order No.",
    "Shift Accumulator (Materials)": "Shift Accumulator (Materials)",
    "Batch No.": "Batch No.",
    "Quantity (kg)": "Quantity (kg)",
    "+ Add": "+ Add",
    "Total Input Material:": "Total Input Material:",
    "Add Another Material": "Add Another Material",
    "Input Roll Weight (kg)": "Input Roll Weight (kg)",
    "Production Output & Scrap": "Production Output & Scrap",
    "Shift Accumulator (Rolls)": "Shift Accumulator (Rolls)",
    "New Roll Weight (kg)": "New Roll Weight (kg)",
    "+ Add Roll": "+ Add Roll",
    "Accumulated Good Output": "Accumulated Good Output",
    "Actual Good Output": "Actual Good Output",
    "UoM": "UoM",
    "Shift Accumulator (Scrap)": "Shift Accumulator (Scrap)",
    "Type": "Type",
    "Weight (kg)": "Weight (kg)",
    "Setup Scrap": "Setup Scrap",
    "Process Scrap": "Process Scrap",
    "Setup Scrap (kg) - Purging/Colour Change": "Setup Scrap (kg) - Purging/Colour Change",
    "Process Scrap (kg) - Trims/Tears": "Process Scrap (kg) - Trims/Tears",
    "Machine Downtime": "Machine Downtime",
    "Planned (mins)": "Planned (mins)",
    "Unplanned (mins)": "Unplanned (mins)",
    "Primary Downtime Reason": "Primary Downtime Reason",
    "Finished Goods Packing": "Finished Goods Packing",
    "Packing Size": "Packing Size",
    "Quantity Packed": "Quantity Packed",
    "Standardised Total:": "Standardised Total:",
    "Palletisation Details": "Palletisation Details",
    "Pallet Weight (kg) [Tare/Gross]": "Pallet Weight (kg) [Tare/Gross]",
    "Individual Bag/Carton Accumulator": "Individual Bag/Carton Accumulator",
    "Bag": "Bag",
    "Add Another Bag": "Add Another Bag",
    "Actual Bag Weight submitted:": "Actual Bag Weight submitted:",
    "Dispatch / Shipping": "Dispatch / Shipping",
    "Shipped Quantity (kg)": "Shipped Quantity (kg)",
    "Delivery Order (DO) / Invoice No.": "Delivery Order (DO) / Invoice No.",
    "Raw Material Inwards": "Raw Material Inwards",
    "Material Name / ID": "Material Name / ID",
    "Incoming / Received Amount (kg)": "Incoming / Received Amount (kg)",
    "Supplier Name": "Supplier Name",
    "Purchase Order (PO) No.": "Purchase Order (PO) No.",
    "Storage Location / Zone": "Storage Location / Zone",
    "Quality / Condition Check": "Quality / Condition Check",
    "Quality Control Assessment": "Quality Control Assessment",
    "Job Order No. (Under Inspection)": "Job Order No. (Under Inspection)",
    "Thickness Check (Microns)": "Thickness Check (Microns)",
    "Width Check (mm)": "Width Check (mm)",
    "Seal Integrity Assessment": "Seal Integrity Assessment",
    "Length Check (mm)": "Length Check (mm)",
    "Packing Size (Bag Weight - kg)": "Packing Size (Bag Weight - kg)",
    "Quantity Check (Bags per Pallet)": "Quantity Check (Bags per Pallet)",
    "Total Bags Verified": "Total Bags Verified",
    "Total Pallets Counted": "Total Pallets Counted",
    "Overall QC Remarks / Issues Noted": "Overall QC Remarks / Issues Noted",
    "Status": "Status",
    "Pass": "Pass",
    "Fail": "Fail",
    "N/A": "N/A",
    "Submit Full Shift Log": "Submit Full Shift Log",
    "Saving Data...": "Saving Data...",
    "Discrepancy Must Be Resolved": "Discrepancy Must Be Resolved",
    "Mass Balance Verified": "Mass Balance Verified",
    "Mass Balance Failed (Discrepancy > 2%)": "Mass Balance Failed (Discrepancy > 2%)",
    "Total Input": "Total Input",
    "Total Output + Scrap": "Total Output + Scrap",
    "Variance": "Variance",
    "Error Margin": "Error Margin",
    "Reason for Discrepancy (Required for Override)": "Reason for Discrepancy (Required for Override)",
    "Dashboard": "Dashboard",
    "Extrusion": "Extrusion",
    "Cutting": "Cutting",
    "Packing": "Packing",
    "Dispatch": "Dispatch",
    "Quality Control": "Quality Control",
    "Incoming Goods": "Incoming Goods",
    "Print": "Print",
    "Exit": "Exit",
    "Daily Production Report": "Daily Production Report",
    "Operational Log & Analytics": "Operational Log & Analytics",
    "Draft Auto-Saved": "Draft Auto-Saved",
    "Log bags incrementally as they are packed onto the pallet.": "Log bags incrementally as they are packed onto the pallet.",
    "Load hoppers incrementally. Click '+ Add Another Material' when a new batch is added during the shift.": "Load hoppers incrementally. Click '+ Add Another Material' when a new batch is added during the shift.",
    "Optional": "Optional",
    "Material ID": "Material ID",
    "Material Name": "Material Name",
    "bag": "bag"
  },
  bn: {
    "Production Hub": "উৎপাদন হাব",
    "Secure Operator Access": "নিরাপদ অপারেটর অ্যাক্সেস",
    "Enter Operator PIN": "অপারেটর পিন লিখুন",
    "Secure Login": "লগইন করুন",
    "Verifying Credentials...": "যাচাই করা হচ্ছে...",
    "Session Parameters": "সেশন প্যারামিটার",
    "Date": "তারিখ",
    "Shift": "শিফট",
    "Morning (AM)": "সকাল (AM)",
    "Night (PM)": "রাত (PM)",
    "Operator / Supervisor": "অপারেটর / সুপারভাইজার",
    "Receiver / Admin Name": "রিসিভার / অ্যাডমিন নাম",
    "QC Inspector": "কিউসি ইন্সপেক্টর",
    "Machine No.": "মেশিন নম্বর",
    "Material Inputs": "কাঁচামাল ইনপুট",
    "Job Order No.": "জব অর্ডার নম্বর (JO)",
    "Shift Accumulator (Materials)": "শিফট অ্যাকুমুলেটর (কাঁচামাল)",
    "Batch No.": "ব্যাচ নম্বর",
    "Quantity (kg)": "পরিমাণ (কেজি)",
    "+ Add": "+ যোগ করুন",
    "Total Input Material:": "মোট ইনপুট কাঁচামাল:",
    "Add Another Material": "আরও কাঁচামাল যোগ করুন",
    "Input Roll Weight (kg)": "ইনপুট রোল ওজন (কেজি)",
    "Production Output & Scrap": "উৎপাদন আউটপুট এবং স্ক্র্যাপ",
    "Shift Accumulator (Rolls)": "শিফট অ্যাকুমুলেটর (রোল)",
    "New Roll Weight (kg)": "নতুন রোলের ওজন (কেজি)",
    "+ Add Roll": "+ রোল যোগ করুন",
    "Accumulated Good Output": "জমে থাকা ভালো আউটপুট",
    "Actual Good Output": "প্রকৃত ভালো আউটপুট",
    "UoM": "একক (UoM)",
    "Shift Accumulator (Scrap)": "শিফট অ্যাকুমুলেটর (স্ক্র্যাপ)",
    "Type": "ধরন",
    "Weight (kg)": "ওজন (কেজি)",
    "Setup Scrap": "সেটআপ স্ক্র্যাপ",
    "Process Scrap": "প্রসেস স্ক্র্যাপ",
    "Setup Scrap (kg) - Purging/Colour Change": "সেটআপ স্ক্র্যাপ (কেজি) - পার্জিং/রঙ পরিবর্তন",
    "Process Scrap (kg) - Trims/Tears": "প্রসেস স্ক্র্যাপ (কেজি) - ট্রিমস/টিয়ারস",
    "Machine Downtime": "মেশিন ডাউনটাইম",
    "Planned (mins)": "পরিকল্পিত (মিনিট)",
    "Unplanned (mins)": "অপরিকল্পিত (মিনিট)",
    "Primary Downtime Reason": "ডাউনটাইমের প্রধান কারণ",
    "Finished Goods Packing": "প্যাকিং (ফিনিশড গুডস)",
    "Packing Size": "প্যাকিং সাইজ",
    "Quantity Packed": "প্যাক করা পরিমাণ",
    "Standardised Total:": "মোট পরিমাণ:",
    "Palletisation Details": "প্যালেট বিবরণ",
    "Pallet Weight (kg) [Tare/Gross]": "প্যালেটের ওজন (কেজি)",
    "Individual Bag/Carton Accumulator": "ব্যাগ/কার্টন অ্যাকুমুলেটর",
    "Bag": "ব্যাগ",
    "Add Another Bag": "আরও ব্যাগ যোগ করুন",
    "Actual Bag Weight submitted:": "মোট ব্যাগের ওজন:",
    "Dispatch / Shipping": "ডিসপ্যাচ / শিপিং",
    "Shipped Quantity (kg)": "শিপ করা পরিমাণ (কেজি)",
    "Delivery Order (DO) / Invoice No.": "ডেলিভারি অর্ডার (DO) নম্বর",
    "Raw Material Inwards": "কাঁচামাল গ্রহণ",
    "Material Name / ID": "কাঁচামালের নাম / আইডি",
    "Incoming / Received Amount (kg)": "গৃহীত পরিমাণ (কেজি)",
    "Supplier Name": "সরবরাহকারীর নাম",
    "Purchase Order (PO) No.": "পারচেজ অর্ডার (PO) নম্বর",
    "Storage Location / Zone": "স্টোরেজ লোকেশন",
    "Quality / Condition Check": "কোয়ালিটি চেক",
    "Quality Control Assessment": "কোয়ালিটি কন্ট্রোল (QC)",
    "Job Order No. (Under Inspection)": "জব অর্ডার নম্বর (তদন্তাধীন)",
    "Thickness Check (Microns)": "পুরুত্ব চেক (মাইক্রন)",
    "Width Check (mm)": "প্রস্থ চেক (মিমি)",
    "Seal Integrity Assessment": "সিল ইন্টিগ্রিটি চেক",
    "Length Check (mm)": "দৈর্ঘ্য চেক (মিমি)",
    "Packing Size (Bag Weight - kg)": "প্যাকিং সাইজ (ব্যাগের ওজন - কেজি)",
    "Quantity Check (Bags per Pallet)": "পরিমাণ চেক (ব্যাগ প্রতি প্যালেট)",
    "Total Bags Verified": "মোট যাচাইকৃত ব্যাগ",
    "Total Pallets Counted": "মোট গোনা প্যালেট",
    "Overall QC Remarks / Issues Noted": "সার্বিক কিউসি মন্তব্য",
    "Status": "স্ট্যাটাস",
    "Pass": "পাস",
    "Fail": "ফেইল",
    "N/A": "প্রযোজ্য নয়",
    "Submit Full Shift Log": "সম্পূর্ণ শিফট লগ জমা দিন",
    "Saving Data...": "ডেটা সেভ হচ্ছে...",
    "Discrepancy Must Be Resolved": "অসঙ্গতি সমাধান করতে হবে",
    "Mass Balance Verified": "ম্যাস ব্যালেন্স যাচাই করা হয়েছে",
    "Mass Balance Failed (Discrepancy > 2%)": "ম্যাস ব্যালেন্স ফেইল (পার্থক্য > ২%)",
    "Total Input": "মোট ইনপুট",
    "Total Output + Scrap": "মোট আউটপুট + স্ক্র্যাপ",
    "Variance": "পার্থক্য",
    "Error Margin": "ভুলের মার্জিন",
    "Reason for Discrepancy (Required for Override)": "অসঙ্গতির কারণ (অপরিহার্য)",
    "Dashboard": "ড্যাশবোর্ড",
    "Extrusion": "এক্সট্রুশন",
    "Cutting": "কাটিং",
    "Packing": "প্যাকিং",
    "Dispatch": "ডিসপ্যাচ",
    "Quality Control": "কিউসি (QC)",
    "Incoming Goods": "ইনকামিং গুডস",
    "Print": "প্রিন্ট",
    "Exit": "প্রস্থান",
    "Daily Production Report": "দৈনিক উৎপাদন প্রতিবেদন",
    "Operational Log & Analytics": "অপারেশনাল লগ এবং অ্যানালিটিক্স",
    "Draft Auto-Saved": "খসড়া অটো-সেভ হয়েছে",
    "Log bags incrementally as they are packed onto the pallet.": "প্যালেটে প্যাক করার সাথে সাথে ব্যাগের ওজন ক্রমান্বয়ে লগ করুন।",
    "Load hoppers incrementally. Click '+ Add Another Material' when a new batch is added during the shift.": "হপারে মাল যোগ করার সাথে সাথে লগ করুন। শিফটে নতুন ব্যাচ যোগ হলে '+ আরও কাঁচামাল যোগ করুন'-এ ক্লিক করুন।",
    "Optional": "ঐচ্ছিক",
    "Material ID": "কাঁচামালের আইডি",
    "Material Name": "কাঁচামালের নাম",
    "bag": "ব্যাগ"
  },
  ms: {
    "Production Hub": "Pusat Pengeluaran",
    "Secure Operator Access": "Akses Operator Selamat",
    "Enter Operator PIN": "Masukkan PIN Operator",
    "Secure Login": "Log Masuk Selamat",
    "Verifying Credentials...": "Mengesahkan Kelayakan...",
    "Session Parameters": "Parameter Sesi",
    "Date": "Tarikh",
    "Shift": "Syif",
    "Morning (AM)": "Pagi (AM)",
    "Night (PM)": "Malam (PM)",
    "Operator / Supervisor": "Operator / Penyelia",
    "Receiver / Admin Name": "Penerima / Nama Admin",
    "QC Inspector": "Pemeriksa QC",
    "Machine No.": "No. Mesin",
    "Material Inputs": "Input Bahan",
    "Job Order No.": "No. Pesanan Kerja (JO)",
    "Shift Accumulator (Materials)": "Pengumpul Syif (Bahan)",
    "Batch No.": "No. Kumpulan",
    "Quantity (kg)": "Kuantiti (kg)",
    "+ Add": "+ Tambah",
    "Total Input Material:": "Jumlah Bahan Input:",
    "Add Another Material": "Tambah Bahan Lain",
    "Input Roll Weight (kg)": "Berat Gulungan Input (kg)",
    "Production Output & Scrap": "Keluaran Pengeluaran & Sisa",
    "Shift Accumulator (Rolls)": "Pengumpul Syif (Gulungan)",
    "New Roll Weight (kg)": "Berat Gulungan Baru (kg)",
    "+ Add Roll": "+ Tambah Gulungan",
    "Accumulated Good Output": "Terkumpul Keluaran Baik",
    "Actual Good Output": "Keluaran Baik Sebenar",
    "UoM": "Unit",
    "Shift Accumulator (Scrap)": "Pengumpul Syif (Sisa)",
    "Type": "Jenis",
    "Weight (kg)": "Berat (kg)",
    "Setup Scrap": "Sisa Persediaan",
    "Process Scrap": "Sisa Proses",
    "Setup Scrap (kg) - Purging/Colour Change": "Sisa Persediaan (kg) - Purging/Tukar Warna",
    "Process Scrap (kg) - Trims/Tears": "Sisa Proses (kg) - Potongan/Koyak",
    "Machine Downtime": "Masa Henti Mesin",
    "Planned (mins)": "Dirancang (minit)",
    "Unplanned (mins)": "Tidak Dirancang (minit)",
    "Primary Downtime Reason": "Sebab Utama Masa Henti",
    "Finished Goods Packing": "Pembungkusan Barang Siap",
    "Packing Size": "Saiz Pembungkusan",
    "Quantity Packed": "Kuantiti Dibungkus",
    "Standardised Total:": "Jumlah Standard:",
    "Palletisation Details": "Butiran Pempaletan",
    "Pallet Weight (kg) [Tare/Gross]": "Berat Pallet (kg) [Bersih/Kasar]",
    "Individual Bag/Carton Accumulator": "Pengumpul Beg/Kadbod Individu",
    "Bag": "Beg",
    "Add Another Bag": "Tambah Beg Lain",
    "Actual Bag Weight submitted:": "Berat Beg Sebenar dihantar:",
    "Dispatch / Shipping": "Penghantaran",
    "Shipped Quantity (kg)": "Kuantiti Dihantar (kg)",
    "Delivery Order (DO) / Invoice No.": "No. Pesanan Penghantaran (DO) / Invois",
    "Raw Material Inwards": "Bahan Mentah Masuk",
    "Material Name / ID": "Nama/ID Bahan",
    "Incoming / Received Amount (kg)": "Jumlah Masuk / Diterima (kg)",
    "Supplier Name": "Nama Pembekal",
    "Purchase Order (PO) No.": "No. Pesanan Belian (PO)",
    "Storage Location / Zone": "Lokasi/Zon Simpanan",
    "Quality / Condition Check": "Pemeriksaan Kualiti / Keadaan",
    "Quality Control Assessment": "Penilaian Kawalan Kualiti",
    "Job Order No. (Under Inspection)": "No. Pesanan Kerja (Di Bawah Pemeriksaan)",
    "Thickness Check (Microns)": "Pemeriksaan Ketebalan (Mikron)",
    "Width Check (mm)": "Pemeriksaan Lebar (mm)",
    "Seal Integrity Assessment": "Penilaian Integriti Kedap",
    "Length Check (mm)": "Pemeriksaan Panjang (mm)",
    "Packing Size (Bag Weight - kg)": "Saiz Pembungkusan (Berat Beg - kg)",
    "Quantity Check (Bags per Pallet)": "Pemeriksaan Kuantiti (Beg setiap Pallet)",
    "Total Bags Verified": "Jumlah Beg Disahkan",
    "Total Pallets Counted": "Jumlah Pallet Dikira",
    "Overall QC Remarks / Issues Noted": "Ulasan QC Keseluruhan / Isu Dicatat",
    "Status": "Status",
    "Pass": "Lulus",
    "Fail": "Gagal",
    "N/A": "N/A",
    "Submit Full Shift Log": "Hantar Log Syif Penuh",
    "Saving Data...": "Menyimpan Data...",
    "Discrepancy Must Be Resolved": "Percanggahan Mesti Diselesaikan",
    "Mass Balance Verified": "Imbangan Jisim Disahkan",
    "Mass Balance Failed (Discrepancy > 2%)": "Imbangan Jisim Gagal (Percanggahan > 2%)",
    "Total Input": "Jumlah Input",
    "Total Output + Scrap": "Jumlah Keluaran + Sisa",
    "Variance": "Varians",
    "Error Margin": "Margin Ralat",
    "Reason for Discrepancy (Required for Override)": "Sebab Percanggahan (Wajib untuk Override)",
    "Dashboard": "Papan Pemuka",
    "Extrusion": "Penyemperitan (Extrusion)",
    "Cutting": "Pemotongan",
    "Packing": "Pembungkusan",
    "Dispatch": "Penghantaran",
    "Quality Control": "Kawalan Kualiti (QC)",
    "Incoming Goods": "Barang Masuk",
    "Print": "Cetak",
    "Exit": "Keluar",
    "Daily Production Report": "Laporan Pengeluaran Harian",
    "Operational Log & Analytics": "Log Operasi & Analitis",
    "Draft Auto-Saved": "Draf Disimpan Secara Auto",
    "Log beg secara berperingkat semasa ia dibungkus ke atas pallet.": "Log beg secara berperingkat semasa ia dibungkus ke atas pallet.",
    "Load hoppers incrementally. Click '+ Add Another Material' when a new batch is added semasa syif.": "Muatkan corong secara berperingkat. Klik '+ Tambah Bahan Lain' apabila kumpulan baru ditambah semasa syif.",
    "Optional": "Pilihan",
    "Material ID": "ID Bahan",
    "Material Name": "Nama Bahan",
    "bag": "beg"
  }
};

// Reusable component for the new QC Data + Status rows
const QCField = ({ label, name, statusName, formData, onChange, placeholder, t }) => (
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
      <label className="block text-sm font-medium text-slate-700 mb-1 sm:hidden">{t("Status")}</label>
      <select
        name={statusName}
        value={formData[statusName]}
        onChange={onChange}
        className="w-full p-2 border border-slate-300 rounded text-sm focus:outline-none font-medium"
      >
        <option className="text-green-600" value="Pass">{t("Pass")}</option>
        <option className="text-red-600" value="Fail">{t("Fail")}</option>
        <option className="text-slate-400" value="N/A">{t("N/A")}</option>
      </select>
    </div>
  </div>
);

const STORAGE_KEY = 'dpr_draft_session';

const getInitialFormData = (userProfile = null) => ({
  date: new Date().toISOString().split('T')[0],
  shift: userProfile ? userProfile.shift : 'AM', 
  supervisor: userProfile ? userProfile.name : '',
  machineId: '',
  jobOrder: '',
  inputRollWeight: '',
  extrusionMaterials: [], 
  extrusionRolls: [], 
  scrapEntries: [], 
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

const defaultStats = { daily: { output: 0, consumption: 0, wastage: 0, units: 0, pallets: 0 }, weekly: { output: 0, consumption: 0, wastage: 0, units: 0, pallets: 0 }, monthly: { output: 0, consumption: 0, wastage: 0, units: 0, pallets: 0 }, yearly: { output: 0, consumption: 0, wastage: 0, units: 0, pallets: 0 } };

// YOUR GOOGLE SCRIPT URL HERE
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxgjPLdlnTmAbNu0jtoNTh5l8_FUkdhAppdvMok1c6ZoSAzwtwEseI3MVWv7ZmlNkEyqw/exec';

const App = () => {
  // --- LANGUAGE STATE ---
  const [language, setLanguage] = useState('en');
  const t = (text) => dict[language][text] || text;

  // --- AUTHENTICATION STATE ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [pinInput, setPinInput] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // --- APP STATE ---
  const [department, setDepartment] = useState('Dashboard'); 
  const [qcStage, setQcStage] = useState('Extrusion'); 
  
  // Load draft from local storage
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch(e) { console.error('Corrupted draft'); }
    }
    return getInitialFormData();
  });

  // Accumulator Quick Add States
  const [quickRollWeight, setQuickRollWeight] = useState('');
  const [quickMaterialBatch, setQuickMaterialBatch] = useState('');
  const [quickMaterialId, setQuickMaterialId] = useState('');
  const [quickMaterialName, setQuickMaterialName] = useState('');
  const [quickMaterialUom, setQuickMaterialUom] = useState('kg');
  const [quickMaterialWeight, setQuickMaterialWeight] = useState('');
  const [quickScrapType, setQuickScrapType] = useState('setupScrap');
  const [quickScrapWeight, setQuickScrapWeight] = useState('');

  // --- SUGGESTION LISTS (QoL Improvement) ---
  const [localHistory, setLocalHistory] = useState({
    machineIds: [],
    batchNos: [],
    suppliers: [],
    downtimeReasons: []
  });

  // Load local history on mount
  useEffect(() => {
    setLocalHistory({
      machineIds: JSON.parse(localStorage.getItem('hist_machines') || '[]'),
      batchNos: JSON.parse(localStorage.getItem('hist_batches') || '[]'),
      suppliers: JSON.parse(localStorage.getItem('hist_suppliers') || '[]'),
      downtimeReasons: JSON.parse(localStorage.getItem('hist_downtime') || '[]')
    });
  }, []);

  // Auto-save form data
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData, isLoggedIn]);

  // Dashboard & Analytics State
  const [analyticsPeriod, setAnalyticsPeriod] = useState('daily');
  const [analyticsDept, setAnalyticsDept] = useState('Extrusion');
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  
  const [dashboardData, setDashboardData] = useState({ 
    extrusion: [], cutting: [], packing: [], dispatch: [], incoming: [], qc: [],
    masterOrders: [], joTotals: {},
    analytics: { Extrusion: defaultStats, Cutting: defaultStats, Packing: defaultStats }
  });
  const [isFetchingDashboard, setIsFetchingDashboard] = useState(false);
  const [dashboardError, setDashboardError] = useState(null);

  // Derive active Job Orders from dashboard data, sorted by most recent activity
  const joSuggestions = useMemo(() => {
    if (!dashboardData?.masterOrders) return [];
    const currentInput = (formData.jobOrder || '').toLowerCase();
    
    // Map orders to include their most recent timestamp (creation or last update)
    const joWithTimestamps = dashboardData.masterOrders.map(order => {
      const createdTime = new Date(order.date).getTime() || 0;
      const updatedTime = dashboardData.joTotals[order.jo]?.lastUpdated || 0;
      return {
        jo: order.jo,
        latestTime: Math.max(createdTime, updatedTime)
      };
    });

    // Sort descending by most recent activity
    joWithTimestamps.sort((a, b) => b.latestTime - a.latestTime);

    // Extract unique JO strings in sorted order
    const sortedUniqueJOs = Array.from(new Set(joWithTimestamps.map(item => item.jo)));

    // Filter by current input and limit to 5 results
    return sortedUniqueJOs
      .filter(jo => jo.toLowerCase().includes(currentInput))
      .slice(0, 5);
  }, [dashboardData, formData.jobOrder]);

  // Derive Material Names from recent incoming logs
  const materialSuggestions = useMemo(() => {
    if (!dashboardData?.incoming) return [];
    return Array.from(new Set(dashboardData.incoming.map(row => row[2])));
  }, [dashboardData]);

  // Auto-fill material name and ID based on batch number
  useEffect(() => {
    if (quickMaterialBatch && dashboardData?.incoming) {
      // Search for the batch number (assuming index 5 in Incoming Goods array)
      const match = dashboardData.incoming.find(row => row[5] === quickMaterialBatch);
      if (match) {
        setQuickMaterialName(match[2] || '');
        // If your Google Script later includes the ID in the incoming array (e.g. index 6), it will pick it up here.
        setQuickMaterialId(match[6] || 'N/A'); 
      } else {
        setQuickMaterialName('');
        setQuickMaterialId('');
      }
    } else {
      setQuickMaterialName('');
      setQuickMaterialId('');
    }
  }, [quickMaterialBatch, dashboardData]);

  // Flag Modal State
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [isSubmittingFlag, setIsSubmittingFlag] = useState(false);
  const [flagData, setFlagData] = useState({ department: '', date: '', jobOrder: '', reason: '' });

  const [massBalance, setMassBalance] = useState({ totalInput: 0, totalAccounted: 0, discrepancyKg: 0, discrepancyPercent: 0, isFailed: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- LOGIN LOGIC ---
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!pinInput || pinInput.length < 4) {
      setLoginError("Please enter a valid PIN (minimum 4 digits).");
      return;
    }
    
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'login', pin: pinInput }),
      });
      const result = await response.json();
      if (result.status === 'success') {
        const user = result.user;
        setCurrentUser(user);
        setIsLoggedIn(true);
        setPinInput(''); 
        setDepartment(user.department);
        
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) setFormData(getInitialFormData(user)); 
        if (user.department === 'Quality Control') setQcStage('Extrusion');
      } else {
        setLoginError(result.message || "Invalid PIN. Please try again.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setLoginError("Network error. Please check your connection.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    if (formData.actualOutput || formData.jobOrder || formData.extrusionRolls?.length > 0 || formData.extrusionMaterials?.length > 0) {
      if (!window.confirm("WARNING: You have unsaved data in your shift draft. Logging out will delete it permanently. Are you sure you want to exit?")) {
        return;
      }
    }
    setIsLoggedIn(false);
    setCurrentUser(null);
    setDepartment('Dashboard');
    localStorage.removeItem(STORAGE_KEY);
    setFormData(getInitialFormData()); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- Bag Handlers ---
  const handleBagWeightChange = (id, value) => setFormData(prev => ({ ...prev, bagWeights: prev.bagWeights.map(bag => bag.id === id ? { ...bag, weight: value } : bag) }));
  const addBagWeightRow = () => setFormData(prev => ({ ...prev, bagWeights: [...prev.bagWeights, { id: Date.now(), weight: '' }] }));
  const removeBagWeightRow = (id) => setFormData(prev => ({ ...prev, bagWeights: prev.bagWeights.filter(bag => bag.id !== id) }));

  // --- Extrusion Accumulator Handlers ---
  const handleAddRoll = () => {
    if (!quickRollWeight || isNaN(quickRollWeight)) return;
    const newRolls = [...(formData.extrusionRolls || []), { id: Date.now(), weight: Number(quickRollWeight), time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }];
    const newTotal = newRolls.reduce((sum, r) => sum + r.weight, 0);
    setFormData(prev => ({ ...prev, extrusionRolls: newRolls, actualOutput: newTotal.toFixed(2) }));
    setQuickRollWeight('');
  };

  const handleRemoveRoll = (id) => {
    const newRolls = (formData.extrusionRolls || []).filter(r => r.id !== id);
    const newTotal = newRolls.reduce((sum, r) => sum + r.weight, 0);
    setFormData(prev => ({ ...prev, extrusionRolls: newRolls, actualOutput: newTotal > 0 ? newTotal.toFixed(2) : '' }));
  };

  const handleAddMaterial = () => {
    if (!quickMaterialWeight || isNaN(quickMaterialWeight)) return;
    
    const isBag = quickMaterialUom === 'bag';
    const weightInKg = isBag ? Number(quickMaterialWeight) * 25 : Number(quickMaterialWeight);

    const newMats = [...(formData.extrusionMaterials || []), { 
      id: Date.now(), 
      batchNo: quickMaterialBatch || 'N/A', 
      materialId: quickMaterialId || 'N/A',
      materialName: quickMaterialName || 'N/A',
      uom: quickMaterialUom,
      originalQuantity: Number(quickMaterialWeight),
      quantity: weightInKg, 
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
    }];
    
    setFormData(prev => ({ ...prev, extrusionMaterials: newMats }));
    
    // Reset fields
    setQuickMaterialBatch('');
    setQuickMaterialId('');
    setQuickMaterialName('');
    setQuickMaterialWeight('');
    setQuickMaterialUom('kg');
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

  // --- Mass Balance ---
  useEffect(() => {
    if (!['Extrusion', 'Cutting'].includes(department)) {
      setMassBalance({ totalInput: 0, totalAccounted: 0, discrepancyKg: 0, discrepancyPercent: 0, isFailed: false });
      return;
    }
    let totalInput = department === 'Extrusion' 
      ? (formData.extrusionMaterials || []).reduce((sum, mat) => sum + Number(mat.quantity || 0), 0)
      : Number(formData.inputRollWeight || 0);

    const outputWeight = formData.uom === 'kg' ? Number(formData.actualOutput || 0) : 0;
    const totalScrap = Number(formData.setupScrap || 0) + Number(formData.processScrap || 0) + Number(formData.rejections || 0);
    const totalAccounted = outputWeight + totalScrap;
    const discrepancyKg = totalInput - totalAccounted;
    const discrepancyPercent = totalInput > 0 ? (Math.abs(discrepancyKg) / totalInput) * 100 : 0;

    const isFailed = discrepancyPercent > 2.0;

    setMassBalance({ totalInput, totalAccounted, discrepancyKg, discrepancyPercent, isFailed });
  }, [formData.extrusionMaterials, formData.inputRollWeight, formData.actualOutput, formData.setupScrap, formData.processScrap, formData.rejections, formData.uom, department]);

  // --- Dashboard Fetch Logic ---
  const fetchDashboardData = async () => {
    setIsFetchingDashboard(true);
    setDashboardError(null);
    try {
      const urlWithCacheBuster = `${GOOGLE_SCRIPT_URL}?t=${new Date().getTime()}`;
      const response = await fetch(urlWithCacheBuster);
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
    if (isLoggedIn && department === 'Dashboard') fetchDashboardData();
  }, [department, isLoggedIn]);

  // --- Flag Logic ---
  const openFlagModal = (dept, date, jobOrder) => {
    setFlagData({ department: dept, date: new Date(date).toLocaleDateString('en-GB'), jobOrder: jobOrder || 'N/A', reason: '' });
    setIsFlagModalOpen(true);
  };

  const handleFlagSubmit = async () => {
    if (!flagData.reason) return alert("Please provide a reason for flagging this record.");
    setIsSubmittingFlag(true);
    try {
      const payload = { action: 'flag', flagDepartment: flagData.department, flagDate: flagData.date, flagJobOrder: flagData.jobOrder, flagReason: flagData.reason };
      await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) });
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
      alert(t("Discrepancy Must Be Resolved"));
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = { ...formData, department, massDiscrepancyKg: massBalance.discrepancyKg, massDiscrepancyPercent: massBalance.discrepancyPercent };
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload),
      });
      alert(`Report saved successfully! [Department: ${t(department)}]`);
      
      // --- UPDATE LOCAL HISTORY FOR SUGGESTIONS ---
      const updateHist = (key, value) => {
        if (!value) return JSON.parse(localStorage.getItem(key) || '[]');
        const current = JSON.parse(localStorage.getItem(key) || '[]');
        const updated = Array.from(new Set([value, ...current])).slice(0, 10); // Keep last 10 unique entries
        localStorage.setItem(key, JSON.stringify(updated));
        return updated;
      };

      // Extract batch numbers from main form and extrusion quick-add array
      let batchesToSave = formData.batchNumber ? [formData.batchNumber] : [];
      (formData.extrusionMaterials || []).forEach(m => { if (m.batchNo) batchesToSave.push(m.batchNo); });
      let currentBatches = JSON.parse(localStorage.getItem('hist_batches') || '[]');
      batchesToSave.forEach(b => { currentBatches = Array.from(new Set([b, ...currentBatches])); });
      currentBatches = currentBatches.slice(0, 15);
      localStorage.setItem('hist_batches', JSON.stringify(currentBatches));

      setLocalHistory({
        machineIds: updateHist('hist_machines', formData.machineId),
        batchNos: currentBatches,
        suppliers: updateHist('hist_suppliers', formData.supplier),
        downtimeReasons: updateHist('hist_downtime', formData.downtimeReason)
      });
      // --------------------------------------------

      // Wipe the local draft and reset the form, keeping the user's base info
      localStorage.removeItem(STORAGE_KEY);
      setFormData(getInitialFormData(currentUser)); 
    } catch (error) {
      alert("Network error: Could not connect to the database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentAnalytics = dashboardData.analytics?.[analyticsDept]?.[analyticsPeriod] || { output: 0, consumption: 0, wastage: 0, units: 0, pallets: 0 };
  
  // Calculate a "lastUpdated" timestamp for every order, and sort newest first
  const activeOrders = (dashboardData.masterOrders || [])
    .map(order => ({
      ...order,
      lastUpdated: dashboardData.joTotals[order.jo]?.lastUpdated || 0
    }))
    .sort((a, b) => b.lastUpdated - a.lastUpdated);

  // If searching, filter all orders. If not searching, just show the top 3 most recent active.
  const filteredOrders = customerSearchTerm 
    ? activeOrders.filter(o => 
        (o.customer && o.customer.toLowerCase().includes(customerSearchTerm.toLowerCase())) ||
        (o.jo && o.jo.toLowerCase().includes(customerSearchTerm.toLowerCase()))
      )
    : activeOrders.filter(o => o.lastUpdated > 0).slice(0, 3); 

  // ================= RENDER LOGIN SCREEN =================
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative">
        <div className="absolute top-4 right-4">
          <button 
            onClick={() => setLanguage(l => l === 'en' ? 'bn' : l === 'bn' ? 'ms' : 'en')} 
            className="flex items-center gap-2 text-slate-300 hover:text-white bg-slate-800 px-4 py-2 rounded-full text-sm font-medium transition-colors border border-slate-700"
          >
            <Globe size={16} /> {language === 'en' ? 'বাংলা' : language === 'bn' ? 'Bahasa Melayu' : 'English'}
          </button>
        </div>

        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="bg-slate-800 p-8 text-center border-b border-slate-700">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
              <Lock size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">{t("Production Hub")}</h1>
            <p className="text-slate-400 text-sm">{t("Secure Operator Access")}</p>
          </div>
          
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">{t("Enter Operator PIN")}</label>
              <input 
                type="password" 
                pattern="[0-9]*" 
                inputMode="numeric"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••"
                className="w-full text-center text-3xl tracking-widest p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all"
                autoFocus
              />
              {loginError && <p className="text-red-500 text-sm mt-3 font-medium text-center flex items-center justify-center gap-1"><AlertTriangle size={14}/>{loginError}</p>}
            </div>
            
            <button 
              type="submit" 
              disabled={isLoggingIn}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-md ${isLoggingIn ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5'}`}
            >
              {isLoggingIn ? t("Verifying Credentials...") : t("Secure Login")}
            </button>
          </form>
          <div className="bg-slate-50 p-4 text-center text-xs text-slate-500 border-t border-slate-100">
            Version 2.4 (Beta) | Authorised Personnel Only
          </div>
        </div>
      </div>
    );
  }

  // ================= RENDER MAIN APP =================
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
                <div><span className="font-semibold block text-xs uppercase opacity-70">Department</span> {t(flagData.department)}</div>
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
        
        {/* --- DATALISTS FOR AUTO-SUGGESTIONS --- */}
        <datalist id="jo-suggestions">
          {joSuggestions.map(jo => <option key={jo} value={jo} />)}
        </datalist>
        <datalist id="material-suggestions">
          {materialSuggestions.map(mat => <option key={mat} value={mat} />)}
        </datalist>
        <datalist id="machine-suggestions">
          {localHistory.machineIds.map(m => <option key={m} value={m} />)}
        </datalist>
        <datalist id="batch-suggestions">
          {localHistory.batchNos.map(b => <option key={b} value={b} />)}
        </datalist>
        <datalist id="supplier-suggestions">
          {localHistory.suppliers.map(s => <option key={s} value={s} />)}
        </datalist>
        <datalist id="downtime-suggestions">
          {localHistory.downtimeReasons.map(d => <option key={d} value={d} />)}
        </datalist>

        {/* Header & Department Toggle */}
        <div className="bg-slate-800 text-white p-6 print:bg-white print:text-slate-800 print:border-b">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{t("Daily Production Report")}</h1>
              <p className="text-slate-300 print:text-slate-500 mt-1">{t("Operational Log & Analytics")}</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 print:hidden w-full md:w-auto">
              <button 
                onClick={() => setLanguage(l => l === 'en' ? 'bn' : l === 'bn' ? 'ms' : 'en')} 
                className="flex items-center gap-2 text-slate-300 hover:text-white bg-slate-700 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors border border-slate-600"
              >
                <Globe size={16} /> {language === 'en' ? 'BN' : language === 'bn' ? 'BM' : 'EN'}
              </button>
              
              <div className="flex items-center gap-3 bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-700 flex-grow md:flex-grow-0">
                <UserCircle className="text-blue-400" size={24} />
                <div className="text-sm">
                  <p className="font-bold leading-tight">{currentUser.name}</p>
                  <p className="text-xs text-slate-400 leading-tight">{t(currentUser.role)} • {currentUser.shift === 'AM' ? t('Morning (AM)') : t('Night (PM)')}</p>
                </div>
              </div>
              <button type="button" onClick={handlePrint} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-3 md:py-2.5 rounded-lg text-sm font-medium transition-colors">
                <Printer size={16} /> {t("Print")}
              </button>
              <button type="button" onClick={handleLogout} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500 hover:text-white text-red-400 px-4 py-3 md:py-2.5 rounded-lg text-sm font-medium transition-colors border border-red-500/30">
                <LogOut size={16} /> {t("Exit")}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 bg-slate-900 rounded-lg p-1 print:hidden w-full overflow-x-auto">
            {['Dashboard', 'Extrusion', 'Cutting', 'Packing', 'Dispatch', 'Quality Control', 'Incoming Goods'].map((dept) => (
              <button 
                key={dept}
                type="button"
                onClick={() => setDepartment(dept)}
                className={`py-2 px-1 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-1 min-w-[100px] ${department === dept ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              >
                {dept === 'Dashboard' && <BarChart3 size={14} />}
                {t(dept)}
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
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4 border-b border-slate-100 pb-4">
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full xl:w-auto">
                  <h3 className="font-semibold text-slate-700 flex items-center gap-2 whitespace-nowrap">
                    <TrendingUp size={18} className="text-blue-600"/> Analytics
                  </h3>
                  {/* Department Toggle */}
                  <div className="flex bg-slate-100 p-1 rounded-lg w-full sm:w-auto overflow-x-auto">
                    {['Extrusion', 'Cutting', 'Packing'].map(dept => (
                      <button 
                        key={dept} 
                        onClick={() => setAnalyticsDept(dept)}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${analyticsDept === dept ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        {t(dept)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Period Toggle */}
                <div className="flex bg-slate-100 p-1 rounded-lg w-full xl:w-auto overflow-x-auto">
                  {['daily', 'weekly', 'monthly', 'yearly'].map(period => (
                    <button 
                      key={period} 
                      onClick={() => setAnalyticsPeriod(period)}
                      className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-all ${analyticsPeriod === period ? 'bg-blue-600 shadow-sm text-white' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Universal Output Card */}
                <div className="bg-blue-50/50 p-5 rounded-lg border border-blue-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Total Output ({analyticsPeriod})</p>
                    <p className="text-3xl font-bold text-slate-800">{currentAnalytics.output.toFixed(2)} <span className="text-base font-normal text-slate-500">kg</span></p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full text-blue-600"><Package size={24} /></div>
                </div>

                {/* 2. Dynamic Card: Consumption OR Units Packed */}
                {analyticsDept === 'Packing' ? (
                  <div className="bg-purple-50/50 p-5 rounded-lg border border-purple-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Total Units Packed</p>
                      <p className="text-3xl font-bold text-slate-800">{currentAnalytics.units || 0} <span className="text-base font-normal text-slate-500">units</span></p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full text-purple-600"><PackageCheck size={24} /></div>
                  </div>
                ) : (
                  <div className="bg-emerald-50/50 p-5 rounded-lg border border-emerald-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Input / Consumption</p>
                      <p className="text-3xl font-bold text-slate-800">{currentAnalytics.consumption.toFixed(2)} <span className="text-base font-normal text-slate-500">kg</span></p>
                    </div>
                    <div className="p-3 bg-emerald-100 rounded-full text-emerald-600"><Box size={24} /></div>
                  </div>
                )}

                {/* 3. Dynamic Card: Scrap OR Pallets */}
                {analyticsDept === 'Packing' ? (
                  <div className="bg-indigo-50/50 p-5 rounded-lg border border-indigo-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Pallets Processed</p>
                      <p className="text-3xl font-bold text-slate-800">{currentAnalytics.pallets || 0} <span className="text-base font-normal text-slate-500">pallets</span></p>
                    </div>
                    <div className="p-3 bg-indigo-100 rounded-full text-indigo-600"><Layers size={24} /></div>
                  </div>
                ) : (
                  <div className="bg-rose-50/50 p-5 rounded-lg border border-rose-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Scrap / Wastage</p>
                      <p className="text-3xl font-bold text-slate-800">{currentAnalytics.wastage.toFixed(2)} <span className="text-base font-normal text-slate-500">kg</span></p>
                    </div>
                    <div className="p-3 bg-rose-100 rounded-full text-rose-600"><Trash2 size={24} /></div>
                  </div>
                )}
              </div>
            </div>

            {/* --- CUSTOMER ORDER TRACKER --- */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-100 pb-4">
                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                  <Search size={18} className="text-blue-600"/> Customer Order Tracking
                </h3>
                <div className="w-full md:w-72 relative">
                  <input 
                    type="text" 
                    placeholder="Search Customer or JO..." 
                    value={customerSearchTerm}
                    onChange={(e) => setCustomerSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                </div>
              </div>
              
              {/* Max-height and overflow enable scrolling if there are >3 items */}
              <div className="max-h-[480px] overflow-y-auto pr-2 space-y-4">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order, index) => {
                    const totals = dashboardData.joTotals[order.jo] || { extrusion: 0, cutting: 0, packing: 0 };
                    const target = order.targetQty || 1; 
                    
                    const extPct = Math.min(100, (totals.extrusion / target) * 100);
                    const cutPct = Math.min(100, (totals.cutting / target) * 100);
                    const packPct = Math.min(100, (totals.packing / target) * 100);

                    return (
                      // Including index in the key forcefully eliminates the "stuck tile" bug
                      <div key={`${order.jo}-${index}`} className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-2">
                          <div>
                            <h4 className="font-bold text-slate-800 text-lg">{order.customer} <span className="text-slate-400 text-sm font-normal">| JO: {order.jo}</span></h4>
                            <p className="text-sm text-slate-600">{order.description}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-md block mb-1">
                              Issued: {new Date(order.date).toLocaleDateString('en-GB')}
                            </span>
                            <span className="text-sm font-bold text-slate-700">Target: {order.targetQty} kg</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Extrusion Bar */}
                          <div>
                            <div className="flex justify-between text-sm mb-1.5">
                              <span className="font-semibold text-slate-700">Extrusion</span>
                              <span className="text-slate-600 font-medium">{totals.extrusion.toFixed(0)} kg <span className="text-slate-400 text-xs font-normal">({extPct.toFixed(1)}%)</span></span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2.5">
                              <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${extPct}%` }}></div>
                            </div>
                          </div>

                          {/* Cutting Bar */}
                          <div>
                            <div className="flex justify-between text-sm mb-1.5">
                              <span className="font-semibold text-slate-700">Cutting</span>
                              <span className="text-slate-600 font-medium">{totals.cutting.toFixed(0)} kg <span className="text-slate-400 text-xs font-normal">({cutPct.toFixed(1)}%)</span></span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2.5">
                              <div className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${cutPct}%` }}></div>
                            </div>
                          </div>

                          {/* Packing Bar */}
                          <div>
                            <div className="flex justify-between text-sm mb-1.5">
                              <span className="font-semibold text-slate-700">Packing (FG)</span>
                              <span className="text-slate-600 font-medium">{totals.packing.toFixed(0)} kg <span className="text-slate-400 text-xs font-normal">({packPct.toFixed(1)}%)</span></span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2.5">
                              <div className="bg-amber-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${packPct}%` }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : customerSearchTerm ? (
                  <p className="text-sm text-slate-500 text-center py-8 bg-slate-50 rounded-lg border border-slate-200 border-dashed">No matching active orders found for "{customerSearchTerm}".</p>
                ) : (
                  <p className="text-sm text-slate-500 text-center py-8 bg-slate-50 rounded-lg border border-slate-200 border-dashed">No recently active orders found. Use search to find historical orders.</p>
                )}
              </div>
            </div>

            {/* --- RECENT LOGS TABLES --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              
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
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-slate-700">
                  <ClipboardList className="text-blue-600" />
                  <h2 className="text-lg font-semibold">{t("Session Parameters")}</h2>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 text-xs font-medium bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  <CheckCircle size={14} /> {t("Draft Auto-Saved")}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">{t("Date")}</label>
                  <input type="date" name="date" value={formData.date} onChange={handleInputChange} required className="w-full h-[42px] px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                </div>
                
                {department !== 'Incoming Goods' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">{t("Shift")}</label>
                    <select name="shift" value={formData.shift} onChange={handleInputChange} className="w-full h-[42px] px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                      <option value="AM">{t("Morning (AM)")}</option>
                      <option value="PM">{t("Night (PM)")}</option>
                    </select>
                  </div>
                )}

                <div className={department === 'Incoming Goods' ? 'md:col-span-3' : ''}>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    {department === 'Incoming Goods' ? t('Receiver / Admin Name') : 
                     department === 'Quality Control' ? t('QC Inspector') : 
                     t('Operator / Supervisor')}
                  </label>
                  <input type="text" name="supervisor" value={formData.supervisor} onChange={handleInputChange} required placeholder="e.g. John Doe" className="w-full h-[42px] px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                </div>

                {(department === 'Extrusion' || department === 'Cutting' || department === 'Quality Control') && (
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">{t("Machine No.")}</label>
                    <input type="text" name="machineId" value={formData.machineId} onChange={handleInputChange} required={department !== 'Quality Control'} placeholder={department === 'Extrusion' ? "EXT-01" : department === 'Cutting' ? "CUT-01" : "e.g. EXT-01"} className="w-full h-[42px] px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" list="machine-suggestions" />
                  </div>
                )}
              </div>
            </section>

            {/* MANUFACTURING DEPARTMENTS (Extrusion & Cutting) */}
            {(department === 'Extrusion' || department === 'Cutting') && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Material Inputs */}
                <section className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="flex items-center gap-2 mb-4 text-slate-700">
                    <Box className="text-blue-600" />
                    <h2 className="text-lg font-semibold">{t("Material Inputs")}</h2>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-600 mb-1">{t("Job Order No.")}</label>
                    <input type="text" name="jobOrder" value={formData.jobOrder} onChange={handleInputChange} required placeholder="WO-12345" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" list="jo-suggestions" />
                  </div>

                  {department === 'Extrusion' ? (
                    <div className="space-y-4 flex-1">
                      {/* --- MATERIAL ACCUMULATOR --- */}
                      <div className="mb-2 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-blue-800 flex items-center gap-1.5"><Clock size={16}/> {t("Shift Accumulator (Materials)")}</h3>
                        </div>
                        <p className="text-xs text-slate-500 mb-4">{t("Load hoppers incrementally. Click '+ Add Another Material' when a new batch is added during the shift.")}</p>
                        
                        <div className="flex flex-col gap-3 mb-3">
                          {/* Simplified Input Row */}
                          <div className="flex gap-2 items-end">
                            <div className="flex-[1.5]">
                              <label className="block text-xs font-medium text-blue-700 mb-1">{t("Batch No.")}</label>
                              <input 
                                type="text" 
                                value={quickMaterialBatch} 
                                onChange={e => setQuickMaterialBatch(e.target.value)} 
                                className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 bg-white shadow-sm font-semibold text-blue-900" 
                                placeholder="Scan or type..." 
                                list="batch-suggestions"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="block text-xs font-medium text-blue-700 mb-1">{t("Quantity")}</label>
                              <input 
                                type="number" 
                                step="0.01" 
                                value={quickMaterialWeight} 
                                onChange={e => setQuickMaterialWeight(e.target.value)} 
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddMaterial())}
                                className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 bg-white shadow-sm" 
                                placeholder="0.00" 
                              />
                            </div>
                            <div className="w-24">
                              <label className="block text-xs font-medium text-blue-700 mb-1">{t("Unit")}</label>
                              <select 
                                value={quickMaterialUom} 
                                onChange={e => setQuickMaterialUom(e.target.value)} 
                                className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                              >
                                <option value="kg">kg</option>
                                <option value="bag">{t("bag")}</option>
                              </select>
                            </div>
                            <button 
                              type="button" 
                              onClick={handleAddMaterial}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm whitespace-nowrap h-[42px]"
                            >
                              {t("+ Add")}
                            </button>
                          </div>

                          {/* Dynamic Feedback UI based on matched batch */}
                          {quickMaterialBatch && (
                            <div className={`px-3 py-2 rounded-md border text-xs flex items-center gap-2 transition-colors ${quickMaterialName ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-100 border-slate-300 text-slate-500'}`}>
                              {quickMaterialName ? (
                                <><CheckCircle size={14} className="text-emerald-500"/> Matched: <strong className="ml-1">{quickMaterialName}</strong></>
                              ) : (
                                <><Search size={14} className="text-slate-400"/> Searching records... Proceeding as unverified material.</>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {formData.extrusionMaterials?.length > 0 && (
                          <div className="space-y-2 mt-4 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                            {formData.extrusionMaterials.map((mat) => (
                              <div key={mat.id} className="flex justify-between items-center bg-white p-2.5 rounded border border-blue-100 text-sm shadow-sm flex-wrap gap-2">
                                <div className="flex flex-col">
                                  <span className="text-slate-800 font-bold">{mat.materialId !== 'N/A' && mat.materialId ? mat.materialId : (mat.materialName !== 'N/A' ? mat.materialName : 'Unknown Material')}</span>
                                  <span className="text-slate-500 font-medium text-xs mt-0.5">
                                    {mat.materialName !== 'N/A' && mat.materialId !== 'N/A' ? `${mat.materialName} | ` : ''}{t("Batch No.")}: <span className="font-semibold">{mat.batchNo}</span> <span className="text-xs font-normal ml-1">({mat.time})</span>
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="text-right">
                                    <span className="font-bold text-slate-700 block text-base">{mat.quantity} kg</span>
                                    {mat.uom === 'bag' && <span className="text-xs font-medium text-slate-400 block">{mat.originalQuantity} {t("bag")}(s)</span>}
                                  </div>
                                  <button type="button" onClick={() => handleRemoveMaterial(mat.id)} className="text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 p-2 rounded transition-colors"><Trash2 size={16}/></button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="mt-3 pt-3 border-t border-blue-200 flex justify-between items-center text-sm">
                          <span className="font-semibold text-blue-800">{t("Total Input Material:")}</span>
                          <span className="font-bold text-blue-900">{formData.extrusionMaterials?.reduce((sum, m) => sum + Number(m.quantity || 0), 0).toFixed(2)} kg</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">{t("Input Roll Weight (kg)")}</label>
                        <input type="number" step="0.01" name="inputRollWeight" value={formData.inputRollWeight} onChange={handleInputChange} placeholder="0.00" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                      </div>
                    </div>
                  )}
                </section>

                {/* Output & Scrap */}
                <section className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="flex items-center gap-2 mb-4 text-slate-700">
                    <Settings className="text-blue-600" />
                    <h2 className="text-lg font-semibold">{t("Production Output & Scrap")}</h2>
                  </div>

                  {/* --- EXTRUSION ROLL TRACKER --- */}
                  {department === 'Extrusion' && (
                    <div className="mb-6 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-blue-800 flex items-center gap-1.5"><Clock size={16}/> {t("Shift Accumulator (Rolls)")}</h3>
                      </div>
                      
                      <div className="flex gap-2 items-end mb-3">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-blue-700 mb-1">{t("New Roll Weight (kg)")}</label>
                          <input 
                            type="number" 
                            step="0.01" 
                            value={quickRollWeight} 
                            onChange={e => setQuickRollWeight(e.target.value)} 
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddRoll())}
                            className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 bg-white shadow-sm" 
                            placeholder="e.g. 45.5" 
                          />
                        </div>
                        <button 
                          type="button" 
                          onClick={handleAddRoll}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
                        >
                          {t("+ Add Roll")}
                        </button>
                      </div>
                      
                      {formData.extrusionRolls?.length > 0 && (
                        <div className="space-y-2 mt-4 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                          {formData.extrusionRolls.map((roll, i) => (
                            <div key={roll.id} className="flex justify-between items-center bg-white p-2.5 rounded border border-blue-100 text-sm shadow-sm">
                              <span className="text-slate-500 font-medium">Roll {i + 1} <span className="text-xs font-normal ml-1">({roll.time})</span></span>
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-slate-700">{roll.weight} kg</span>
                                <button type="button" onClick={() => handleRemoveRoll(roll.id)} className="text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 p-1.5 rounded transition-colors"><Trash2 size={14}/></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-600 mb-1">
                        {department === 'Extrusion' ? t('Accumulated Good Output') : t('Actual Good Output')}
                      </label>
                      <input 
                        type="number" 
                        step="0.01" 
                        name="actualOutput" 
                        value={formData.actualOutput} 
                        onChange={handleInputChange} 
                        required
                        placeholder="0.00" 
                        readOnly={department === 'Extrusion' && formData.extrusionRolls?.length > 0}
                        className={`w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg font-bold text-green-700 ${department === 'Extrusion' && formData.extrusionRolls?.length > 0 ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-white'}`} 
                      />
                    </div>
                    <div className="w-24">
                      <label className="block text-sm font-medium text-slate-600 mb-1">{t("UoM")}</label>
                      <select name="uom" value={formData.uom} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                        <option value="kg">kg</option>
                        <option value="pcs">pcs</option>
                      </select>
                    </div>
                  </div>

                  {/* --- SCRAP ACCUMULATOR --- */}
                  <div className={`mb-6 bg-rose-50/50 p-4 rounded-lg border border-rose-100 mt-4`}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-rose-800 flex items-center gap-1.5"><Clock size={16}/> {t("Shift Accumulator (Scrap)")}</h3>
                    </div>
                    <div className="flex gap-2 items-end mb-3">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-rose-700 mb-1">{t("Type")}</label>
                        <select 
                          value={quickScrapType} 
                          onChange={e => setQuickScrapType(e.target.value)} 
                          className="w-full p-2 border border-rose-200 rounded-md focus:ring-2 focus:ring-rose-500 bg-white shadow-sm"
                        >
                          <option value="setupScrap">{t("Setup Scrap")}</option>
                          <option value="processScrap">{t("Process Scrap")}</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-rose-700 mb-1">{t("Weight (kg)")}</label>
                        <input 
                          type="number" 
                          step="0.01" 
                          value={quickScrapWeight} 
                          onChange={e => setQuickScrapWeight(e.target.value)} 
                          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddScrap())}
                          className="w-full p-2 border border-rose-200 rounded-md focus:ring-2 focus:ring-rose-500 bg-white shadow-sm" 
                          placeholder="0.00" 
                        />
                      </div>
                      <button 
                        type="button" 
                        onClick={handleAddScrap}
                        className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
                      >
                        {t("+ Add")}
                      </button>
                    </div>
                    
                    {formData.scrapEntries?.length > 0 && (
                      <div className="space-y-2 mt-4 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                        {formData.scrapEntries.map((scrap) => (
                          <div key={scrap.id} className="flex justify-between items-center bg-white p-2.5 rounded border border-rose-100 text-sm shadow-sm">
                            <span className="text-slate-500 font-medium">{scrap.type === 'setupScrap' ? t('Setup Scrap') : t('Process Scrap')} <span className="text-xs font-normal ml-1">({scrap.time})</span></span>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-slate-700">{scrap.weight} kg</span>
                              <button type="button" onClick={() => handleRemoveScrap(scrap.id)} className="text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 p-1.5 rounded transition-colors"><Trash2 size={14}/></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">{t("Setup Scrap (kg) - Purging/Colour Change")}</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        name="setupScrap" 
                        value={formData.setupScrap} 
                        onChange={handleInputChange} 
                        readOnly={formData.scrapEntries?.some(s => s.type === 'setupScrap')}
                        className={`w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${formData.scrapEntries?.some(s => s.type === 'setupScrap') ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-white'}`} 
                        placeholder="0.00" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">{t("Process Scrap (kg) - Trims/Tears")}</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        name="processScrap" 
                        value={formData.processScrap} 
                        onChange={handleInputChange} 
                        readOnly={formData.scrapEntries?.some(s => s.type === 'processScrap')}
                        className={`w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${formData.scrapEntries?.some(s => s.type === 'processScrap') ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-white'}`} 
                        placeholder="0.00" 
                      />
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
                    <h2 className="text-lg font-semibold">{t("Finished Goods Packing")}</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-600 mb-1">{t("Job Order No.")}</label>
                      <input type="text" name="jobOrder" value={formData.jobOrder} onChange={handleInputChange} required placeholder="WO-12345" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" list="jo-suggestions" />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-600 mb-1">{t("Packing Size")}</label>
                        <input type="number" step="0.01" name="packingSize" value={formData.packingSize} onChange={handleInputChange} placeholder="e.g. 25.00" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                      </div>
                      <div className="w-28">
                        <label className="block text-sm font-medium text-slate-600 mb-1">{t("UoM")}</label>
                        <select name="packingUom" value={formData.packingUom} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                          <option value="kg/bag">kg/bag</option>
                          <option value="pcs/bag">pcs/bag</option>
                          <option value="kg/roll">kg/roll</option>
                          <option value="kg/carton">kg/carton</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">{t("Quantity Packed")}</label>
                      <input type="number" name="quantityPacked" value={formData.quantityPacked} onChange={handleInputChange} placeholder="e.g. 10" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                    </div>
                  </div>
                  
                  {(formData.packingSize && formData.quantityPacked) ? (
                    <div className="pt-3 border-t border-slate-200 mt-4">
                      <p className="text-sm text-slate-500">{t("Standardised Total:")} <strong className="text-slate-800">{(Number(formData.packingSize) * Number(formData.quantityPacked)).toFixed(2)} {formData.packingUom.split('/')[0]}</strong></p>
                    </div>
                  ) : null}
                </section>

                <section className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="flex items-center gap-2 mb-4 text-slate-700">
                    <Scale className="text-blue-600" />
                    <h2 className="text-lg font-semibold">{t("Palletisation Details")}</h2>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-600 mb-1">{t("Pallet Weight (kg) [Tare/Gross]")}</label>
                    <input type="number" step="0.01" name="palletWeight" value={formData.palletWeight} onChange={handleInputChange} placeholder="e.g. 15.00" className="w-full md:w-1/2 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5"><Clock size={16} className="text-slate-500"/> {t("Individual Bag/Carton Accumulator")}</h3>
                    </div>
                    
                    <p className="text-xs text-slate-500 mb-3">{t("Log bags incrementally as they are packed onto the pallet.")}</p>
                    
                    {formData.bagWeights.map((bag, index) => (
                      <div key={bag.id} className="flex gap-4 items-end mb-2">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-slate-500 mb-1">{t("Bag")} {index + 1}</label>
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
                      className="mt-2 flex items-center gap-2 text-sm text-blue-600 font-medium hover:text-blue-800 transition-colors"
                    >
                      <PlusCircle size={18} /> {t("Add Another Bag")}
                    </button>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-200">
                    <p className="text-sm text-slate-500">{t("Actual Bag Weight submitted:")} <strong className="text-slate-800">
                      {formData.bagWeights.reduce((sum, bag) => sum + Number(bag.weight || 0), 0).toFixed(2)} kg
                    </strong></p>
                  </div>
                </section>
              </div>
            )}

            {/* DISPATCH DEPARTMENT */}
            {department === 'Dispatch' && (
              <section className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
                <div className="flex items-center gap-2 mb-4 text-slate-700">
                  <Truck className="text-blue-600" />
                  <h2 className="text-lg font-semibold">{t("Dispatch / Shipping")}</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">{t("Job Order No.")}</label>
                    <input type="text" name="jobOrder" value={formData.jobOrder} onChange={handleInputChange} required placeholder="WO-12345" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" list="jo-suggestions" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">{t("Shipped Quantity (kg)")}</label>
                      <input type="number" step="0.01" name="dispatchQty" value={formData.dispatchQty} onChange={handleInputChange} placeholder="0.00" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">{t("Delivery Order (DO) / Invoice No.")}</label>
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
                  <h2 className="text-lg font-semibold">{t("Raw Material Inwards")}</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">{t("Material Name / ID")}</label>
                      <input type="text" name="restockMaterial" value={formData.restockMaterial} onChange={handleInputChange} required placeholder="e.g. LLDPE-1002" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" list="material-suggestions" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">{t("Incoming / Received Amount (kg)")}</label>
                      <input type="number" step="0.01" name="restockAmount" value={formData.restockAmount} onChange={handleInputChange} required placeholder="0.00" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-lg font-bold text-blue-700" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">{t("Supplier Name")}</label>
                      <input type="text" name="supplier" value={formData.supplier} onChange={handleInputChange} placeholder={t("Optional")} className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" list="supplier-suggestions" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">{t("Purchase Order (PO) No.")}</label>
                      <input type="text" name="poNumber" value={formData.poNumber} onChange={handleInputChange} placeholder={t("Optional")} className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">{t("Batch No.")}</label>
                      <input type="text" name="batchNumber" value={formData.batchNumber} onChange={handleInputChange} placeholder="e.g. B-202311" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" list="batch-suggestions" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">{t("Storage Location / Zone")}</label>
                      <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="e.g. Aisle 4, Rack B" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">{t("Quality / Condition Check")}</label>
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
                  <h2 className="text-lg font-semibold">{t("Quality Control Assessment")}</h2>
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
                      {t(stage)} QC
                    </button>
                  ))}
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">{t("Job Order No. (Under Inspection)")}</label>
                    <input type="text" name="jobOrder" value={formData.jobOrder} onChange={handleInputChange} required placeholder="WO-12345" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" list="jo-suggestions" />
                  </div>

                  <div className="space-y-3 pt-2">
                    {qcStage === 'Extrusion' && (
                      <>
                        <QCField label={t("Thickness Check (Microns)")} name="qcExtThickness" statusName="qcExtThicknessStatus" formData={formData} onChange={handleInputChange} placeholder="e.g. 50" t={t} />
                        <QCField label={t("Width Check (mm)")} name="qcExtWidth" statusName="qcExtWidthStatus" formData={formData} onChange={handleInputChange} placeholder="e.g. 1200" t={t} />
                      </>
                    )}

                    {qcStage === 'Cutting' && (
                      <>
                        <QCField label={t("Seal Integrity Assessment")} name="qcCutSeal" statusName="qcCutSealStatus" formData={formData} onChange={handleInputChange} placeholder="Visual / Drop Test notes..." t={t} />
                        <QCField label={t("Length Check (mm)")} name="qcCutLength" statusName="qcCutLengthStatus" formData={formData} onChange={handleInputChange} placeholder="e.g. 800" t={t} />
                      </>
                    )}

                    {qcStage === 'Packing' && (
                      <>
                        <QCField label={t("Packing Size (Bag Weight - kg)")} name="qcPackBagWeight" statusName="qcPackBagWeightStatus" formData={formData} onChange={handleInputChange} placeholder="e.g. 25.0" t={t} />
                        <QCField label={t("Quantity Check (Bags per Pallet)")} name="qcPackBagsPerPallet" statusName="qcPackBagsPerPalletStatus" formData={formData} onChange={handleInputChange} placeholder="e.g. 40" t={t} />
                        <QCField label={t("Total Bags Verified")} name="qcPackTotalBags" statusName="qcPackTotalBagsStatus" formData={formData} onChange={handleInputChange} placeholder="e.g. 400" t={t} />
                        <QCField label={t("Total Pallets Counted")} name="qcPackTotalPallets" statusName="qcPackTotalPalletsStatus" formData={formData} onChange={handleInputChange} placeholder="e.g. 10" t={t} />
                      </>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <label className="block text-sm font-medium text-slate-600 mb-1">{t("Overall QC Remarks / Issues Noted")}</label>
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
                      {massBalance.isFailed ? t('Mass Balance Failed (Discrepancy > 2%)') : t('Mass Balance Verified')}
                    </h3>
                    <div className="mt-2 text-sm grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-700">
                      <div><span className="block text-xs uppercase opacity-70">{t("Total Input")}</span><span className="font-semibold">{massBalance.totalInput.toFixed(2)} kg</span></div>
                      <div><span className="block text-xs uppercase opacity-70">{t("Total Output + Scrap")}</span><span className="font-semibold">{massBalance.totalAccounted.toFixed(2)} kg</span></div>
                      <div>
                        <span className="block text-xs uppercase opacity-70">{t("Variance")}</span>
                        <span className={`font-semibold ${massBalance.isFailed ? 'text-red-600' : 'text-emerald-600'}`}>
                          {massBalance.discrepancyKg > 0 ? '-' : '+'}{Math.abs(massBalance.discrepancyKg).toFixed(2)} kg
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs uppercase opacity-70">{t("Error Margin")}</span>
                        <span className={`font-semibold ${massBalance.isFailed ? 'text-red-600' : 'text-emerald-600'}`}>
                          {massBalance.discrepancyPercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    
                    {massBalance.isFailed && (
                      <div className="mt-4 pt-4 border-t border-red-200">
                        <label className="block text-sm font-medium text-red-800 mb-1">{t("Reason for Discrepancy (Required for Override)")}</label>
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
            {(department === 'Cutting' || department === 'Extrusion') && (
              <section className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-slate-700">
                  <Clock className="text-blue-600" />
                  <h2 className="text-lg font-semibold">{t("Machine Downtime")}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="grid grid-cols-2 gap-4 col-span-1">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">{t("Planned (mins)")}</label>
                      <input type="number" name="plannedDowntime" value={formData.plannedDowntime} onChange={handleInputChange} placeholder="0" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">{t("Unplanned (mins)")}</label>
                      <input type="number" name="unplannedDowntime" value={formData.unplannedDowntime} onChange={handleInputChange} placeholder="0" className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-600 mb-1">{t("Primary Downtime Reason")}</label>
                    <input 
                      type="text"
                      name="downtimeReason" 
                      value={formData.downtimeReason} 
                      onChange={handleInputChange} 
                      className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                      placeholder="e.g., Heater band replacement, blade change..."
                      list="downtime-suggestions"
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
                  ? t('Saving Data...') 
                  : ((department === 'Extrusion' || department === 'Cutting') && massBalance.isFailed && !formData.discrepancyReason) 
                    ? t('Discrepancy Must Be Resolved') 
                    : t('Submit Full Shift Log')
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