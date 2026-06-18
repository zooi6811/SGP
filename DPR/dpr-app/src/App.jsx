import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ClipboardList, Settings, Box, AlertTriangle, Clock, Save, Printer, Scale, 
  Package, Truck, ArrowDownToLine, PlusCircle, Trash2, CheckCircle, BarChart3, 
  Activity, RefreshCw, Flag, TrendingUp, X, Search, PackageCheck, Layers, 
  Lock, LogOut, UserCircle, Globe, Menu, ChevronUp, ChevronDown, Edit2
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

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
    "Quantity": "Quantity",
    "Unit": "Unit",
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
    "Quantity": "পরিমাণ",
    "Unit": "একক",
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
    "Quantity": "Kuantiti",
    "Unit": "Unit",
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

// --- REUSABLE COMPONENTS ---

// 1. Inline Edit Component for Accumulators
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
          className={`w-16 p-1 text-base border-2 border-blue-500 rounded outline-none font-bold text-slate-800 ${className}`}
        />
        <span className="text-xs font-medium text-slate-500">{suffix}</span>
      </div>
    );
  }

  return (
    <div 
      onClick={() => setIsEditing(true)} 
      className={`flex items-center gap-1 cursor-pointer group hover:bg-slate-100 p-1 -ml-1 rounded transition-colors ${className}`}
      title="Tap to edit"
    >
      <span className="font-bold text-slate-700">{value} {suffix}</span>
      <Edit2 size={12} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

// 2. Sortable, Filterable & Paginated Table Component
const SortableTable = ({ title, columns, data, onFlag }) => {
  const [filter, setFilter] = useState('');
  const [sortCol, setSortCol] = useState(0); 
  const [sortDesc, setSortDesc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const filteredData = useMemo(() => {
    return data.filter(row => row.some(cell => String(cell).toLowerCase().includes(filter.toLowerCase())));
  }, [data, filter]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let valA = a[columns[sortCol].dataIndex];
      let valB = b[columns[sortCol].dataIndex];
      if (columns[sortCol].type === 'date') { valA = new Date(valA).getTime(); valB = new Date(valB).getTime(); }
      else if (columns[sortCol].type === 'number') { valA = parseFloat(valA) || 0; valB = parseFloat(valB) || 0; }
      
      // Secondary sort fallback
      if (valA === valB) return 0;
      
      if (valA < valB) return sortDesc ? 1 : -1;
      if (valA > valB) return sortDesc ? -1 : 1;
      return 0;
    });
  }, [filteredData, sortCol, sortDesc, columns]);

  // Reset to first page when filtering or sorting changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, sortCol, sortDesc]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage) || 1;
  const paginatedData = sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleSort = (index) => {
    if (sortCol === index) setSortDesc(!sortDesc);
    else { setSortCol(index); setSortDesc(true); }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header and Search */}
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h3 className="font-semibold text-slate-700 text-base">{title}</h3>
        <div className="relative w-full sm:w-auto">
          <input 
            type="text" placeholder="Search records..." value={filter} onChange={e => setFilter(e.target.value)}
            className="pl-8 pr-3 py-2 text-base md:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-48"
          />
          <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
        </div>
      </div>
      
      {/* Table Content */}
      <div className="overflow-x-auto p-0 flex-1">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-xs text-slate-500 bg-slate-100/80 uppercase border-b border-slate-200">
            <tr>
              {columns.map((col, i) => (
                <th key={i} onClick={() => col.sortable !== false && handleSort(i)} className={`px-4 py-2 cursor-pointer hover:bg-slate-200 transition-colors ${col.sortable !== false ? 'select-none' : ''}`}>
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortCol === i ? (sortDesc ? <ChevronDown size={14} className="text-blue-600"/> : <ChevronUp size={14} className="text-blue-600"/>) : <span className="w-3.5" />}
                  </div>
                </th>
              ))}
              <th className="px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? paginatedData.map((row, i) => (
              <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-blue-50/30 transition-colors">
                {columns.map((col, j) => (
                  <td key={j} className="px-4 py-2.5 text-slate-700">
                    {col.render ? col.render(row[col.dataIndex]) : row[col.dataIndex]}
                  </td>
                ))}
                <td className="px-4 py-2.5 text-center">
                  <button onClick={() => onFlag(row)} className="text-slate-400 hover:text-amber-600 transition-colors bg-white border border-slate-200 p-1.5 rounded-md shadow-sm active:scale-95" title="Flag Error"><Flag size={14}/></button>
                </td>
              </tr>
            )) : <tr><td colSpan={columns.length + 1} className="text-center py-6 text-slate-400 italic">No records found.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium hidden sm:block">Page {currentPage} of {totalPages}</span>
        <span className="text-xs text-slate-500 font-medium sm:hidden">{currentPage} / {totalPages}</span>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:scale-95"
          >
            Prev
          </button>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:scale-95"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

// QC Field Component
const QCField = ({ label, name, statusName, formData, onChange, placeholder, t }) => (
  <div className="flex flex-col sm:flex-row sm:items-end gap-3 p-3 bg-white rounded-md border border-slate-200 shadow-sm">
    <div className="flex-1 min-w-0">
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input type="text" name={name} value={formData[name]} onChange={onChange} placeholder={placeholder} className="w-full p-2 border border-slate-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 outline-none" />
    </div>
    <div className="w-full sm:w-28 shrink-0">
      <label className="block text-sm font-medium text-slate-700 mb-1 sm:hidden">{t("Status")}</label>
      <select name={statusName} value={formData[statusName]} onChange={onChange} className="w-full p-2 border border-slate-300 rounded-lg text-base focus:outline-none font-medium">
        <option className="text-emerald-600 font-semibold" value="Pass">{t("Pass")}</option>
        <option className="text-red-600 font-semibold" value="Fail">{t("Fail")}</option>
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
  machineId: '', jobOrder: '', inputRollWeight: '', extrusionMaterials: [], extrusionRolls: [], scrapEntries: [], 
  actualOutput: '', uom: 'kg', setupScrap: '', processScrap: '', rejections: '', plannedDowntime: '', unplannedDowntime: '', downtimeReason: '', discrepancyReason: '',
  packingSize: '', packingUom: 'kg/bag', quantityPacked: '', palletWeight: '', bagWeights: [{ id: Date.now(), weight: '' }], dispatchQty: '', deliveryOrderNo: '',
  restockMaterial: '', restockAmount: '', supplier: '', poNumber: '', batchNumber: '', location: '', incomingQualityCheck: 'Pass', qcNotes: '',
  qcExtThickness: '', qcExtThicknessStatus: 'Pass', qcExtWidth: '', qcExtWidthStatus: 'Pass', qcCutSeal: '', qcCutSealStatus: 'Pass', qcCutLength: '', qcCutLengthStatus: 'Pass',
  qcPackBagWeight: '', qcPackBagWeightStatus: 'Pass', qcPackBagsPerPallet: '', qcPackBagsPerPalletStatus: 'Pass', qcPackTotalBags: '', qcPackTotalBagsStatus: 'Pass', qcPackTotalPallets: '', qcPackTotalPalletsStatus: 'Pass'
});

const defaultStats = { output: 0, prevOutput: 0, consumption: 0, prevConsumption: 0, wastage: 0, prevWastage: 0, units: 0, pallets: 0 };
const defaultAnalytics = { daily: defaultStats, weekly: defaultStats, monthly: defaultStats, yearly: defaultStats };

// YOUR GOOGLE SCRIPT URL HERE
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxRH0FyaRfo3R8iPpAty6_DTRBvmh1FS3ZC45ShXPCtQ9NxvJAZ0h0OOZbfezsr1HzMSQ/exec';

const App = () => {
  const [language, setLanguage] = useState('en');
  const t = (text) => (dict[language] && dict[language][text]) || text;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [pinInput, setPinInput] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [department, setDepartment] = useState('Dashboard'); 
  const [qcStage, setQcStage] = useState('Extrusion'); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
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
    extrusion: [], cutting: [], packing: [], dispatch: [], incoming: [], qc: [],
    masterOrders: [], joTotals: {},
    analytics: { Extrusion: defaultAnalytics, Cutting: defaultAnalytics, Packing: defaultAnalytics }
  });
  const [isFetchingDashboard, setIsFetchingDashboard] = useState(false);

  const joSuggestions = useMemo(() => {
    if (!dashboardData?.masterOrders) return [];
    const currentInput = (formData.jobOrder || '').toLowerCase();
    const sorted = [...dashboardData.masterOrders].sort((a, b) => (dashboardData.joTotals[b.jo]?.lastUpdated || 0) - (dashboardData.joTotals[a.jo]?.lastUpdated || 0));
    return Array.from(new Set(sorted.map(item => item.jo))).filter(jo => jo.toLowerCase().includes(currentInput)).slice(0, 5);
  }, [dashboardData, formData.jobOrder]);

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

  // Live Mass Balance Integrity Evaluation
  useEffect(() => {
    if (!['Extrusion', 'Cutting'].includes(department)) return;
    let totalInput = department === 'Extrusion' ? (formData.extrusionMaterials || []).reduce((sum, mat) => sum + Number(mat.quantity || 0), 0) : Number(formData.inputRollWeight || 0);
    const outputWeight = formData.uom === 'kg' ? Number(formData.actualOutput || 0) : 0;
    const totalScrap = Number(formData.setupScrap || 0) + Number(formData.processScrap || 0) + Number(formData.rejections || 0);
    const totalAccounted = outputWeight + totalScrap;
    const discrepancyKg = totalInput - totalAccounted;
    const discrepancyPercent = totalInput > 0 ? (Math.abs(discrepancyKg) / totalInput) * 100 : 0;
    setMassBalance({ totalInput, totalAccounted, discrepancyKg, discrepancyPercent, isFailed: discrepancyPercent > 2.0 });
  }, [formData.extrusionMaterials, formData.inputRollWeight, formData.actualOutput, formData.setupScrap, formData.processScrap, formData.rejections, formData.uom, department]);

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
        if (result.user.department === 'Quality Control') setQcStage('Extrusion');
        toast.success(`Welcome back, ${result.user.name}`, { icon: '👋' });
      } else toast.error(result.message || "Invalid PIN. Please try again.");
    } catch (error) { toast.error("Network error. Please check your connection."); } 
    finally { setIsLoggingIn(false); }
  };

  const handleLogout = () => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-slate-800">Exit Application?</p>
        <p className="text-xs text-slate-500">Any un-submitted draft data will be wiped entirely. Ensure you have submitted your report.</p>
        <div className="flex gap-2 justify-end mt-2">
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1.5 text-xs font-semibold bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">Cancel</button>
          <button onClick={() => {
            setIsLoggedIn(false); setCurrentUser(null); setDepartment('Dashboard'); localStorage.removeItem(STORAGE_KEY); setFormData(getInitialFormData());
            toast.dismiss(t.id);
          }} className="px-3 py-1.5 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm">Confirm Exit</button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

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

  useEffect(() => { if (isLoggedIn && department === 'Dashboard') fetchDashboardData(); }, [department, isLoggedIn]);

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
    if ((department === 'Extrusion' || department === 'Cutting') && massBalance.isFailed && !formData.discrepancyReason) {
      toast.error(t("Discrepancy Must Be Resolved"), { position: 'top-center', style: { border: '1px solid #ef4444', color: '#ef4444' } }); return;
    }
    setIsSubmitting(true);
    const loadToast = toast.loading("Saving Shift Log to Database...");
    try {
      const payload = { ...formData, department, massDiscrepancyKg: massBalance.discrepancyKg, massDiscrepancyPercent: massBalance.discrepancyPercent };
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) { toast.error("Network error: Could not connect to database.", { id: loadToast }); } 
    finally { setIsSubmitting(false); }
  };

  // Sparkline calculation logic
  const calculateTrend = (current, previous) => {
    if (!previous || previous === 0) return { val: 0, dir: 'none' };
    const pct = ((current - previous) / previous) * 100;
    return { val: Math.abs(pct).toFixed(1), dir: pct > 0 ? 'up' : pct < 0 ? 'down' : 'none' };
  };

  const currentAnalytics = dashboardData.analytics?.[analyticsDept]?.[analyticsPeriod] || defaultAnalytics.daily;
  const trendOutput = calculateTrend(currentAnalytics.output, currentAnalytics.prevOutput);
  const trendConsumption = calculateTrend(currentAnalytics.consumption, currentAnalytics.prevConsumption);
  const trendWastage = calculateTrend(currentAnalytics.wastage, currentAnalytics.prevWastage);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative">
        <Toaster />
        <div className="absolute top-4 right-4"><button onClick={() => setLanguage(l => l === 'en' ? 'bn' : l === 'bn' ? 'ms' : 'en')} className="flex items-center gap-2 text-slate-300 hover:text-white bg-slate-800 px-4 py-2 rounded-full text-sm font-medium transition-colors border border-slate-700 shadow-sm"><Globe size={16} /> {language === 'en' ? 'বাংলা' : language === 'bn' ? 'Bahasa Melayu' : 'English'}</button></div>
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="bg-slate-800 p-8 text-center border-b border-slate-700">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(37,99,235,0.4)]"><Lock size={32} className="text-white" /></div>
            <h1 className="text-2xl font-extrabold text-white mb-2">{t("Production Hub")}</h1>
            <p className="text-slate-400 text-xs font-medium tracking-wide">{t("Secure Operator Access")}</p>
          </div>
          <form onSubmit={handleLogin} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{t("Enter Operator PIN")}</label>
              <input type="password" pattern="[0-9]*" inputMode="numeric" value={pinInput} onChange={(e) => setPinInput(e.target.value)} placeholder="••••" className="w-full text-center text-3xl tracking-widest p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all" autoFocus />
            </div>
            <button type="submit" disabled={isLoggingIn} className={`w-full py-3.5 rounded-xl text-base font-bold text-white transition-all shadow-md active:scale-95 ${isLoggingIn ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5'}`}>{isLoggingIn ? t("Verifying Credentials...") : t("Secure Login")}</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans text-slate-800">
      <Toaster />

      {/* --- FLAG MODAL --- */}
      {isFlagModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2 text-amber-600"><Flag size={18} className="fill-amber-600" /><h3 className="font-bold text-base">Flag Record Error</h3></div>
              <button onClick={() => setIsFlagModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-white border border-slate-200 p-1.5 rounded-lg transition-colors"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">You are flagging a potential error in a recorded log. Management will review this record securely.</p>
              <div className="bg-slate-100 p-3 rounded-xl text-xs text-slate-700 grid grid-cols-2 gap-3 border border-slate-200">
                <div><span className="font-bold block text-[10px] uppercase text-slate-500 tracking-wider">Department</span> {t(flagData.department)}</div>
                <div><span className="font-bold block text-[10px] uppercase text-slate-500 tracking-wider">Date</span> {flagData.date}</div>
                <div className="col-span-2"><span className="font-bold block text-[10px] uppercase text-slate-500 tracking-wider">Job Order</span> <span className="font-semibold text-slate-900">{flagData.jobOrder}</span></div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Reason for Flagging</label>
                <textarea className="w-full p-2.5 text-base border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-shadow" rows="3" placeholder="E.g., Incorrect weight entered..." value={flagData.reason} onChange={(e) => setFlagData({...flagData, reason: e.target.value})}></textarea>
              </div>
              <button onClick={handleFlagSubmit} className="w-full bg-amber-600 hover:bg-amber-700 text-white text-base font-bold py-3 rounded-xl transition-all shadow-sm hover:shadow active:scale-95">Submit Error Flag</button>
            </div>
          </div>
        </div>
      )}

      {/* --- COLLAPSIBLE SIDEBAR --- */}
      <div className={`fixed inset-0 bg-slate-900/60 z-40 transition-opacity backdrop-blur-sm md:hidden ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)} />
      
      <aside className={`fixed md:sticky top-0 left-0 z-50 h-screen bg-slate-900 text-white w-64 flex flex-col transition-transform duration-300 shrink-0 shadow-2xl md:shadow-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 print:hidden`}>
        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
          <div><h1 className="text-xl font-black tracking-tight text-white">DPR Hub</h1><p className="text-[10px] font-semibold text-blue-400 tracking-wider uppercase mt-0.5">Operational Logbook</p></div>
          <button className="md:hidden text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-lg" onClick={() => setIsSidebarOpen(false)}><X size={18}/></button>
        </div>
        
        <div className="p-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <UserCircle className="text-blue-500" size={32} />
            <div className="text-sm min-w-0">
              <p className="font-bold leading-tight text-sm truncate">{currentUser.name}</p>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5 truncate">{t(currentUser.role)} • {currentUser.shift}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {['Dashboard', 'Extrusion', 'Cutting', 'Packing', 'Dispatch', 'Quality Control', 'Incoming Goods'].map((dept) => (
            <button key={dept} onClick={() => { setDepartment(dept); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all ${department === dept ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              {dept === 'Dashboard' && <BarChart3 size={18} />}
              {dept === 'Extrusion' && <Activity size={18} />}
              {dept === 'Packing' && <Package size={18} />}
              {dept === 'Quality Control' && <CheckCircle size={18} />}
              {!['Dashboard', 'Extrusion', 'Packing', 'Quality Control'].includes(dept) && <ClipboardList size={18} />}
              <span className="truncate">{t(dept)}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <button onClick={() => setLanguage(l => l === 'en' ? 'bn' : l === 'bn' ? 'ms' : 'en')} className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 py-2.5 rounded-xl text-xs font-bold transition-colors"><Globe size={16} /> {language.toUpperCase()}</button>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white py-2.5 rounded-xl text-xs font-bold transition-colors border border-red-500/20"><LogOut size={16} /> {t("Exit")}</button>
        </div>
      </aside>

      {/* --- PERSISTENT MASS BALANCE HUD --- */}
      {(department === 'Extrusion' || department === 'Cutting') && massBalance.totalInput > 0 && formData.uom === 'kg' && (
        <div className={`fixed bottom-24 right-4 z-[35] bg-white/95 backdrop-blur shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl p-4 border-l-4 w-64 transition-all duration-300 animate-in slide-in-from-right hidden md:block ${massBalance.isFailed ? 'border-red-500' : 'border-emerald-500'}`}>
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-500">Live Balance Check</h4>
            {massBalance.isFailed ? <AlertTriangle size={16} className="text-red-500 animate-pulse" /> : <Scale size={16} className="text-emerald-500" />}
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between"><span className="text-slate-500 font-medium">Total Input:</span><span className="font-bold text-slate-700">{massBalance.totalInput.toFixed(1)} kg</span></div>
            <div className="flex justify-between"><span className="text-slate-500 font-medium">Output + Scrap:</span><span className="font-bold text-slate-700">{massBalance.totalAccounted.toFixed(1)} kg</span></div>
            <div className="pt-1.5 mt-1 border-t border-slate-100 flex justify-between items-center">
              <span className="font-bold text-slate-800">Variance:</span>
              <span className={`font-black text-sm ${massBalance.isFailed ? 'text-red-600' : 'text-emerald-600'}`}>{massBalance.discrepancyPercent.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-slate-100/50 relative pb-32 md:pb-24">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-3 sticky top-0 z-30 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"><Menu size={18}/></button>
            <h2 className="font-black text-slate-800 text-base tracking-tight truncate">{t(department)}</h2>
          </div>
        </header>

        <div className="p-3 sm:p-5 md:p-8 max-w-7xl mx-auto w-full flex-1">
          <datalist id="jo-suggestions">{joSuggestions.map(jo => <option key={jo} value={jo} />)}</datalist>
          <datalist id="material-suggestions">{materialSuggestions.map(mat => <option key={mat} value={mat} />)}</datalist>
          <datalist id="machine-suggestions">{localHistory.machineIds.map(m => <option key={m} value={m} />)}</datalist>
          <datalist id="batch-suggestions">{localHistory.batchNos.map(b => <option key={b} value={b} />)}</datalist>
          <datalist id="supplier-suggestions">{localHistory.suppliers.map(s => <option key={s} value={s} />)}</datalist>
          <datalist id="downtime-suggestions">{localHistory.downtimeReasons.map(d => <option key={d} value={d} />)}</datalist>

          {department === 'Dashboard' ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Operational Overview</h2>
                  <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Real-time factory metrics and history</p>
                </div>
                <button onClick={fetchDashboardData} disabled={isFetchingDashboard} className="flex items-center justify-center gap-2 text-xs sm:text-sm font-bold bg-white border border-slate-300 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors shadow-sm w-full sm:w-auto active:scale-95 text-slate-700">
                  <RefreshCw size={14} className={isFetchingDashboard ? 'animate-spin text-blue-500' : 'text-slate-400'} /> Refresh Sync
                </button>
              </div>

              {/* Analytics Section */}
              <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4 border-b border-slate-100 pb-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 text-base sm:text-lg"><TrendingUp size={18} className="text-blue-600"/> Analytics</h3>
                    <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
                      {['Extrusion', 'Cutting', 'Packing'].map(dept => (
                        <button key={dept} onClick={() => setAnalyticsDept(dept)} className={`flex-1 sm:flex-none px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${analyticsDept === dept ? 'bg-white shadow text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}>{t(dept)}</button>
                      ))}
                    </div>
                  </div>
                  <div className="flex bg-slate-100 p-1 rounded-xl w-full lg:w-auto">
                    {['daily', 'weekly', 'monthly', 'yearly'].map(period => (
                      <button key={period} onClick={() => setAnalyticsPeriod(period)} className={`flex-1 sm:flex-none px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg capitalize transition-all ${analyticsPeriod === period ? 'bg-slate-800 shadow text-white' : 'text-slate-500 hover:text-slate-700'}`}>{period}</button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Output Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 sm:p-5 rounded-2xl border border-blue-100 relative overflow-hidden group">
                    <p className="text-[10px] sm:text-xs font-black text-blue-500/80 uppercase tracking-widest mb-2">Total Output</p>
                    <div className="flex items-end gap-2 relative z-10">
                      <p className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">{currentAnalytics.output.toFixed(0)} <span className="text-sm sm:text-lg font-bold text-slate-500 tracking-normal">kg</span></p>
                      {trendOutput.dir !== 'none' && (
                        <span className={`flex items-center text-[10px] sm:text-xs font-black mb-1 px-1.5 py-0.5 rounded ${trendOutput.dir === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {trendOutput.dir === 'up' ? <ChevronUp size={12}/> : <ChevronDown size={12}/>} {trendOutput.val}%
                        </span>
                      )}
                    </div>
                    <Package className="absolute -right-4 -bottom-4 text-blue-500/10 transition-transform group-hover:scale-110 duration-500" size={80} />
                  </div>

                  {/* Dynamic Middle Card */}
                  <div className={`p-4 sm:p-5 rounded-2xl border relative overflow-hidden group ${analyticsDept === 'Packing' ? 'bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-100' : 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-100'}`}>
                    <p className={`text-[10px] sm:text-xs font-black uppercase tracking-widest mb-2 ${analyticsDept === 'Packing' ? 'text-purple-500/80' : 'text-emerald-500/80'}`}>{analyticsDept === 'Packing' ? 'Units Packed' : 'Consumption'}</p>
                    <div className="flex items-end gap-2 relative z-10">
                      <p className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">{analyticsDept === 'Packing' ? currentAnalytics.units : currentAnalytics.consumption.toFixed(0)} <span className="text-sm sm:text-lg font-bold text-slate-500 tracking-normal">{analyticsDept === 'Packing' ? 'units' : 'kg'}</span></p>
                      {analyticsDept !== 'Packing' && trendConsumption.dir !== 'none' && (
                        <span className={`flex items-center text-[10px] sm:text-xs font-black mb-1 px-1.5 py-0.5 rounded ${trendConsumption.dir === 'up' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {trendConsumption.dir === 'up' ? <ChevronUp size={12}/> : <ChevronDown size={12}/>} {trendConsumption.val}%
                        </span>
                      )}
                    </div>
                    {analyticsDept === 'Packing' ? <PackageCheck className="absolute -right-4 -bottom-4 text-purple-500/10 transition-transform group-hover:scale-110 duration-500" size={80} /> : <Box className="absolute -right-4 -bottom-4 text-emerald-500/10 transition-transform group-hover:scale-110 duration-500" size={80} />}
                  </div>

                  {/* Dynamic Right Card */}
                  <div className={`p-4 sm:p-5 rounded-2xl border relative overflow-hidden group ${analyticsDept === 'Packing' ? 'bg-gradient-to-br from-indigo-50 to-indigo-100/50 border-indigo-100' : 'bg-gradient-to-br from-rose-50 to-rose-100/50 border-rose-100'}`}>
                    <p className={`text-[10px] sm:text-xs font-black uppercase tracking-widest mb-2 ${analyticsDept === 'Packing' ? 'text-indigo-500/80' : 'text-rose-500/80'}`}>{analyticsDept === 'Packing' ? 'Pallets Processed' : 'Scrap Generated'}</p>
                    <div className="flex items-end gap-2 relative z-10">
                      <p className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">{analyticsDept === 'Packing' ? currentAnalytics.pallets : currentAnalytics.wastage.toFixed(1)} <span className="text-sm sm:text-lg font-bold text-slate-500 tracking-normal">{analyticsDept === 'Packing' ? 'plts' : 'kg'}</span></p>
                      {analyticsDept !== 'Packing' && trendWastage.dir !== 'none' && (
                        <span className={`flex items-center text-[10px] sm:text-xs font-black mb-1 px-1.5 py-0.5 rounded ${trendWastage.dir === 'up' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {trendWastage.dir === 'up' ? <ChevronUp size={12}/> : <ChevronDown size={12}/>} {trendWastage.val}%
                        </span>
                      )}
                    </div>
                    {analyticsDept === 'Packing' ? <Layers className="absolute -right-4 -bottom-4 text-indigo-500/10 transition-transform group-hover:scale-110 duration-500" size={80} /> : <Trash2 className="absolute -right-4 -bottom-4 text-rose-500/10 transition-transform group-hover:scale-110 duration-500" size={80} />}
                  </div>
                </div>
              </div>

              {/* Data Tables Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                <SortableTable 
                  title="Latest Extrusion Runs" data={dashboardData.extrusion} onFlag={(r) => {setFlagData({department: 'Extrusion', date: new Date(r[1]).toLocaleDateString('en-GB'), jobOrder: r[3], reason: ''}); setIsFlagModalOpen(true);}}
                  columns={[
                    { label: 'Date', dataIndex: 1, type: 'date', render: d => new Date(d).toLocaleDateString('en-GB') },
                    { label: 'Job Order', dataIndex: 3, type: 'string', render: v => <span className="font-bold text-slate-900">{v}</span> },
                    { label: 'Output (kg)', dataIndex: 6, type: 'number', render: v => <span className="font-semibold text-blue-700">{v}</span> }
                  ]}
                />
                <SortableTable 
                  title="Latest Cutting Logs" data={dashboardData.cutting} onFlag={(r) => {setFlagData({department: 'Cutting', date: new Date(r[1]).toLocaleDateString('en-GB'), jobOrder: r[3], reason: ''}); setIsFlagModalOpen(true);}}
                  columns={[
                    { label: 'Date', dataIndex: 1, type: 'date', render: d => new Date(d).toLocaleDateString('en-GB') },
                    { label: 'Job Order', dataIndex: 3, type: 'string', render: v => <span className="font-bold text-slate-900">{v}</span> },
                    { label: 'Output (kg)', dataIndex: 6, type: 'number', render: v => <span className="font-semibold text-emerald-700">{v}</span> }
                  ]}
                />
                <SortableTable 
                  title="Latest Packing Logs" data={dashboardData.packing} onFlag={(r) => {setFlagData({department: 'Packing', date: new Date(r[1]).toLocaleDateString('en-GB'), jobOrder: r[3], reason: ''}); setIsFlagModalOpen(true);}}
                  columns={[
                    { label: 'Date', dataIndex: 1, type: 'date', render: d => new Date(d).toLocaleDateString('en-GB') },
                    { label: 'Job Order', dataIndex: 3, type: 'string', render: v => <span className="font-bold text-slate-900">{v}</span> },
                    { label: 'Qty', dataIndex: 6, type: 'number', render: v => <span className="font-semibold text-purple-700">{v}</span> }
                  ]}
                />
                <SortableTable 
                  title="Incoming Materials" data={dashboardData.incoming} onFlag={(r) => {setFlagData({department: 'Incoming Goods', date: new Date(r[1]).toLocaleDateString('en-GB'), jobOrder: r[2], reason: ''}); setIsFlagModalOpen(true);}}
                  columns={[
                    { label: 'Date', dataIndex: 1, type: 'date', render: d => new Date(d).toLocaleDateString('en-GB') },
                    { label: 'Material', dataIndex: 2, type: 'string', render: v => <span className="font-bold text-slate-900">{v}</span> },
                    { label: 'Amount (kg)', dataIndex: 3, type: 'number', render: v => <span className="font-semibold text-blue-700">{v}</span> }
                  ]}
                />
              </div>
            </div>

          ) : (
            // ================= DATA ENTRY FORMS =================
            <form className="space-y-4 sm:space-y-6 animate-in fade-in zoom-in-95 duration-300">
              
              <div className="hidden md:flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-black text-slate-800 flex items-center gap-2 lg:gap-3 tracking-tight">
                    {department === 'Extrusion' && <Activity className="text-blue-600" size={24} />}
                    {department === 'Packing' && <Package className="text-purple-600" size={24} />}
                    {department === 'Quality Control' && <CheckCircle className="text-emerald-600" size={24} />}
                    {department} Report
                  </h2>
                </div>
              </div>

              {/* Section 1: Session Parameters */}
              <section className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2"><ClipboardList size={18} className="text-slate-400"/> {t("Session Parameters")}</h3>
                  <div className="inline-flex items-center gap-2 bg-slate-50 text-slate-500 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 w-fit">
                    <CheckCircle size={14} className="text-emerald-500" /> {saveIndicator}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="min-w-0">
                    <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">{t("Date")}</label>
                    <input type="date" name="date" value={formData.date} onChange={handleInputChange} required className="w-full box-border block appearance-none h-12 px-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white transition-colors text-base" />
                  </div>
                  {department !== 'Incoming Goods' && (
                    <div className="min-w-0">
                      <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">{t("Shift")}</label>
                      <select name="shift" value={formData.shift} onChange={handleInputChange} className="w-full h-12 px-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white transition-colors text-base font-semibold">
                        <option value="AM">{t("Morning (AM)")}</option>
                        <option value="PM">{t("Night (PM)")}</option>
                      </select>
                    </div>
                  )}
                  <div className={`min-w-0 ${department === 'Incoming Goods' ? 'sm:col-span-2 lg:col-span-3' : ''}`}>
                    <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">{department === 'Incoming Goods' ? t('Receiver / Admin Name') : department === 'Quality Control' ? t('QC Inspector') : t('Operator / Supervisor')}</label>
                    <input type="text" name="supervisor" value={formData.supervisor} onChange={handleInputChange} required className="w-full h-12 px-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white transition-colors text-base" />
                  </div>
                  {(department === 'Extrusion' || department === 'Cutting' || department === 'Quality Control') && (
                    <div className="min-w-0">
                      <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">{t("Machine No.")}</label>
                      <input type="text" name="machineId" value={formData.machineId} onChange={handleInputChange} required={department !== 'Quality Control'} placeholder="EXT-01" className="w-full h-12 px-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white uppercase transition-colors text-base font-bold" list="machine-suggestions" />
                    </div>
                  )}
                </div>
              </section>

              {/* MANUFACTURING DEPARTMENTS (Extrusion & Cutting) */}
              {(department === 'Extrusion' || department === 'Cutting') && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  
                  {/* Material Inputs */}
                  <section className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-4 sm:mb-6 flex items-center gap-2"><Box size={18} className="text-blue-500"/> {t("Material Inputs")}</h3>
                    
                    <div className="mb-5">
                      <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">{t("Job Order No.")}</label>
                      <input type="text" name="jobOrder" value={formData.jobOrder} onChange={handleInputChange} required placeholder="WO-12345" className="w-full h-12 px-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase font-black text-slate-800 text-base" list="jo-suggestions" />
                    </div>

                    {department === 'Extrusion' ? (
                      <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 flex-1">
                        <h4 className="text-xs sm:text-sm font-black text-slate-700 mb-3 sm:mb-4 tracking-wide">{t("Shift Accumulator (Materials)")}</h4>
                        <div className="flex flex-col gap-2 sm:gap-3 mb-4">
                          <div className="min-w-0">
                            <input type="text" value={quickMaterialBatch} onChange={e => setQuickMaterialBatch(e.target.value)} className="w-full h-12 px-3 border border-slate-300 rounded-xl focus:ring-blue-500 outline-none text-base font-bold uppercase" placeholder="Scan Batch No." list="batch-suggestions" />
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
                            <div className="flex min-w-0 sm:flex-1 gap-2">
                              <input type="number" step="0.01" value={quickMaterialWeight} onChange={e => setQuickMaterialWeight(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddMaterial())} className="min-w-0 flex-1 h-12 px-3 border border-slate-300 rounded-xl focus:ring-blue-500 outline-none text-base font-black" placeholder="Amount" />
                              <select value={quickMaterialUom} onChange={e => setQuickMaterialUom(e.target.value)} className="h-12 w-20 sm:w-24 px-1 sm:px-2 border border-slate-300 rounded-xl focus:ring-blue-500 outline-none text-base font-bold bg-white shrink-0">
                                <option value="kg">kg</option>
                                <option value="bag">{t("bag")}</option>
                              </select>
                            </div>
                            <button type="button" onClick={handleAddMaterial} className="h-12 w-full sm:w-auto px-5 bg-blue-100 hover:bg-blue-200 text-blue-700 font-black rounded-xl transition-colors shrink-0 active:scale-95">Add Mat.</button>
                          </div>
                          {quickMaterialBatch && quickMaterialName && (
                            <div className="text-[10px] sm:text-xs text-emerald-700 flex items-center gap-1.5 font-bold bg-emerald-100 p-2 rounded-lg border border-emerald-200 mt-1"><CheckCircle size={14}/> Matched: {quickMaterialName}</div>
                          )}
                        </div>
                        
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                          {formData.extrusionMaterials.map((mat) => (
                            <div key={mat.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 text-sm shadow-sm group">
                              <div className="min-w-0 flex-1 pr-2">
                                <div className="font-black text-slate-800 text-xs sm:text-sm truncate">{mat.materialId !== 'N/A' ? mat.materialId : (mat.materialName !== 'N/A' ? mat.materialName : 'Unknown')}</div>
                                <div className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-0.5 truncate">Batch: {mat.batchNo}</div>
                              </div>
                              <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                                <InlineEdit value={mat.quantity} onSave={(val) => updateMaterialQuantity(mat.id, val)} suffix="kg" />
                                <button type="button" onClick={() => handleRemoveMaterial(mat.id)} className="text-slate-300 hover:text-red-500 p-1.5 bg-slate-50 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16}/></button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-200 flex justify-between items-center text-xs sm:text-sm font-bold">
                          <span className="text-slate-600 uppercase tracking-wide">{t("Total Input Material:")}</span>
                          <span className="text-blue-700 text-base sm:text-lg font-black">{formData.extrusionMaterials.reduce((sum, m) => sum + Number(m.quantity || 0), 0).toFixed(2)} kg</span>
                        </div>
                      </div>
                    ) : (
                      <div className="min-w-0">
                        <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">{t("Input Roll Weight (kg)")}</label>
                        <input type="number" step="0.01" name="inputRollWeight" value={formData.inputRollWeight} onChange={handleInputChange} className="w-full h-12 px-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-base font-black bg-white" placeholder="0.00" />
                      </div>
                    )}
                  </section>

                  {/* Output & Scrap */}
                  <section className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-4 sm:mb-6 flex items-center gap-2"><Settings size={18} className="text-emerald-500"/> {t("Production Output & Scrap")}</h3>

                    {department === 'Extrusion' && (
                      <div className="bg-emerald-50/50 p-4 sm:p-5 rounded-2xl border border-emerald-100 mb-5">
                        <h4 className="text-xs sm:text-sm font-black text-emerald-800 mb-3 tracking-wide">{t("Shift Accumulator (Rolls)")}</h4>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
                          <input type="number" step="0.01" value={quickRollWeight} onChange={e => setQuickRollWeight(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddRoll())} className="w-full sm:flex-1 h-12 px-3 border border-emerald-200 rounded-xl focus:ring-emerald-500 outline-none font-black text-base bg-white" placeholder="Weight (kg)" />
                          <button type="button" onClick={handleAddRoll} className="w-full sm:w-auto h-12 px-5 bg-emerald-200 hover:bg-emerald-300 text-emerald-800 font-black rounded-xl transition-colors shrink-0 active:scale-95">Add Roll</button>
                        </div>
                        <div className="space-y-2 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
                          {formData.extrusionRolls.map((roll, i) => (
                            <div key={roll.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-emerald-100 text-sm shadow-sm group">
                              <span className="text-slate-600 font-bold text-xs sm:text-sm">Roll {i + 1}</span>
                              <div className="flex items-center gap-3 sm:gap-4">
                                <InlineEdit value={roll.weight} onSave={(val) => updateRollWeight(roll.id, val)} suffix="kg" />
                                <button type="button" onClick={() => handleRemoveRoll(roll.id)} className="text-slate-300 hover:text-red-500 p-1.5 bg-slate-50 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16}/></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-3 mb-5">
                      <div className="flex-1 min-w-0">
                        <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">{t("Actual Good Output")}</label>
                        <input 
                          type="number" step="0.01" name="actualOutput" value={formData.actualOutput} onChange={handleInputChange} required
                          readOnly={department === 'Extrusion' && formData.extrusionRolls?.length > 0}
                          className={`w-full h-12 px-3 border-2 rounded-xl outline-none text-base sm:text-xl font-black transition-colors ${massBalance.isFailed && formData.uom === 'kg' ? 'border-red-400 text-red-700 bg-red-50' : 'border-slate-300 focus:border-emerald-500 text-slate-800 bg-white'}`} 
                        />
                      </div>
                      <div className="w-20 sm:w-24 shrink-0">
                        <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">{t("UoM")}</label>
                        <select name="uom" value={formData.uom} onChange={handleInputChange} className="w-full h-12 px-2 border border-slate-300 rounded-xl outline-none bg-white font-bold text-base">
                          <option value="kg">kg</option>
                          <option value="pcs">pcs</option>
                        </select>
                      </div>
                    </div>

                    {/* Scrap */}
                    <div className="bg-rose-50/40 p-4 sm:p-5 rounded-2xl border border-rose-100 mt-auto">
                      <h4 className="text-xs sm:text-sm font-black text-rose-800 mb-3 tracking-wide">{t("Scrap Accumulator")}</h4>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
                        <select value={quickScrapType} onChange={e => setQuickScrapType(e.target.value)} className="w-full sm:flex-1 h-12 px-2 border border-rose-200 rounded-xl focus:ring-rose-500 outline-none text-base font-bold bg-white">
                          <option value="setupScrap">Setup Scrap</option>
                          <option value="processScrap">Process Scrap</option>
                        </select>
                        <div className="flex w-full sm:w-auto sm:flex-[0.8] gap-2">
                          <input type="number" step="0.01" value={quickScrapWeight} onChange={e => setQuickScrapWeight(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddScrap())} className="min-w-0 flex-1 h-12 px-3 border border-rose-200 rounded-xl focus:ring-rose-500 outline-none text-base font-black bg-white" placeholder="kg" />
                          <button type="button" onClick={handleAddScrap} className="h-12 w-16 sm:w-auto sm:px-4 bg-rose-200 hover:bg-rose-300 text-rose-900 font-black rounded-xl transition-colors active:scale-95 shrink-0 text-sm">Add</button>
                        </div>
                      </div>
                      
                      {formData.scrapEntries?.length > 0 && (
                        <div className="space-y-2 mb-3 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                          {formData.scrapEntries.map((scrap) => (
                            <div key={scrap.id} className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-rose-100 text-xs sm:text-sm shadow-sm">
                              <span className="text-slate-600 font-bold">{scrap.type === 'setupScrap' ? 'Setup' : 'Process'}</span>
                              <div className="flex items-center gap-3 sm:gap-4">
                                <InlineEdit value={scrap.weight} onSave={(val) => updateScrapWeight(scrap.id, val)} suffix="kg" className="text-rose-700" />
                                <button type="button" onClick={() => handleRemoveScrap(scrap.id)} className="text-slate-300 hover:text-rose-600 p-1.5 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"><Trash2 size={16}/></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex gap-3 pt-3 border-t border-rose-100">
                        <div className="flex-1 min-w-0">
                          <label className="block text-[10px] font-black text-rose-700 uppercase tracking-wider mb-1.5">Total Setup</label>
                          <input type="number" name="setupScrap" value={formData.setupScrap} onChange={handleInputChange} readOnly={formData.scrapEntries?.some(s => s.type === 'setupScrap')} className={`w-full h-10 px-2 rounded-lg outline-none text-base font-black border ${formData.scrapEntries?.some(s => s.type === 'setupScrap') ? 'bg-rose-50 border-transparent text-rose-900' : 'bg-white border-rose-200 focus:border-rose-400'}`} placeholder="0.00" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <label className="block text-[10px] font-black text-rose-700 uppercase tracking-wider mb-1.5">Total Process</label>
                          <input type="number" name="processScrap" value={formData.processScrap} onChange={handleInputChange} readOnly={formData.scrapEntries?.some(s => s.type === 'processScrap')} className={`w-full h-10 px-2 rounded-lg outline-none text-base font-black border ${formData.scrapEntries?.some(s => s.type === 'processScrap') ? 'bg-rose-50 border-transparent text-rose-900' : 'bg-white border-rose-200 focus:border-rose-400'}`} placeholder="0.00" />
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {/* PACKING DEPARTMENT */}
              {department === 'Packing' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full">
                  <section className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-5 flex items-center gap-2"><Package size={18} className="text-purple-500"/> {t("Finished Goods Packing")}</h3>
                    <div className="space-y-4 sm:space-y-5">
                      <div className="min-w-0">
                        <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">{t("Job Order No.")}</label>
                        <input type="text" name="jobOrder" value={formData.jobOrder} onChange={handleInputChange} required placeholder="WO-12345" className="w-full h-12 px-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none uppercase font-black text-slate-800 bg-slate-50 focus:bg-white text-base" list="jo-suggestions" />
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-1 min-w-0">
                          <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">{t("Packing Size")}</label>
                          <input type="number" step="0.01" name="packingSize" value={formData.packingSize} onChange={handleInputChange} placeholder="e.g. 25.00" className="w-full h-12 px-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white font-black text-base sm:text-base" />
                        </div>
                        <div className="w-24 sm:w-28 shrink-0">
                          <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">{t("UoM")}</label>
                          <select name="packingUom" value={formData.packingUom} onChange={handleInputChange} className="w-full h-12 px-2 border border-slate-300 rounded-xl outline-none bg-white font-bold text-base">
                            <option value="kg/bag">kg/bag</option><option value="pcs/bag">pcs/bag</option><option value="kg/roll">kg/roll</option><option value="kg/carton">kg/carton</option>
                          </select>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">{t("Quantity Packed")}</label>
                        <input type="number" name="quantityPacked" value={formData.quantityPacked} onChange={handleInputChange} placeholder="e.g. 10" className="w-full h-12 px-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white font-black text-lg sm:text-xl text-purple-700" />
                      </div>
                    </div>
                  </section>

                  <section className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-5 flex items-center gap-2"><Scale size={18} className="text-blue-500"/> {t("Palletisation Details")}</h3>
                    
                    <div className="mb-5 min-w-0">
                      <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">{t("Pallet Weight (kg) [Tare/Gross]")}</label>
                      <input type="number" step="0.01" name="palletWeight" value={formData.palletWeight} onChange={handleInputChange} placeholder="e.g. 15.00" className="w-full md:w-1/2 h-12 px-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white font-black text-base sm:text-base" />
                    </div>

                    <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl flex-1 flex flex-col">
                      <h4 className="text-xs sm:text-sm font-black text-slate-700 mb-1 tracking-wide">{t("Individual Bag Accumulator")}</h4>
                      <p className="text-[10px] sm:text-xs font-semibold text-slate-500 mb-4">Tap added weights below to edit inline.</p>
                      
                      <div className="flex-1 space-y-2 overflow-y-auto pr-1 custom-scrollbar">
                        {formData.bagWeights.map((bag, index) => (
                          <div key={bag.id} className="flex gap-2 sm:gap-3 items-center">
                            <span className="text-[10px] font-black uppercase text-slate-400 w-10 sm:w-12 shrink-0 tracking-wider">Bag {index + 1}</span>
                            <input type="number" step="0.01" value={bag.weight} onChange={(e) => updateBagWeight(bag.id, e.target.value)} placeholder="0.00 kg" className="min-w-0 flex-1 h-10 sm:h-12 px-3 border border-slate-300 rounded-lg focus:border-blue-500 outline-none font-bold bg-white text-base" />
                            {formData.bagWeights.length > 1 && (
                              <button type="button" onClick={() => removeBagWeightRow(bag.id)} className="text-slate-300 hover:text-red-500 p-2 sm:p-2.5 bg-white border border-slate-200 rounded-lg transition-colors shrink-0"><Trash2 size={16}/></button>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <button type="button" onClick={addBagWeightRow} className="mt-4 flex items-center justify-center gap-2 py-3 text-sm text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-xl font-black transition-colors active:scale-95">
                        <PlusCircle size={16} /> Add Another Bag
                      </button>
                    </div>
                  </section>
                </div>
              )}

              {/* DISPATCH & INCOMING & QC */}
              {department === 'Dispatch' && (
                <section className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-5 flex items-center gap-2"><Truck size={18} className="text-blue-500"/> {t("Dispatch / Shipping")}</h3>
                  <div className="space-y-4 sm:space-y-5">
                    <div className="min-w-0">
                      <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">{t("Job Order No.")}</label>
                      <input type="text" name="jobOrder" value={formData.jobOrder} onChange={handleInputChange} required placeholder="WO-12345" className="w-full h-12 px-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase font-black text-base" list="jo-suggestions" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div className="min-w-0">
                        <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">{t("Shipped Quantity (kg)")}</label>
                        <input type="number" step="0.01" name="dispatchQty" value={formData.dispatchQty} onChange={handleInputChange} className="w-full h-12 px-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-black text-base" />
                      </div>
                      <div className="min-w-0">
                        <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">{t("Delivery Order (DO) / Invoice No.")}</label>
                        <input type="text" name="deliveryOrderNo" value={formData.deliveryOrderNo} onChange={handleInputChange} className="w-full h-12 px-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-base" />
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {department === 'Incoming Goods' && (
                <section className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-5 flex items-center gap-2"><ArrowDownToLine size={18} className="text-blue-500"/> {t("Raw Material Inwards")}</h3>
                  <div className="space-y-4 sm:space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div className="min-w-0"><label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">{t("Material Name / ID")}</label><input type="text" name="restockMaterial" value={formData.restockMaterial} onChange={handleInputChange} required className="w-full h-12 px-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-base" list="material-suggestions" /></div>
                      <div className="min-w-0"><label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">{t("Amount (kg)")}</label><input type="number" step="0.01" name="restockAmount" value={formData.restockAmount} onChange={handleInputChange} required className="w-full h-12 px-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-black text-base sm:text-lg text-blue-700" /></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div className="min-w-0"><label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">{t("Supplier Name")}</label><input type="text" name="supplier" value={formData.supplier} onChange={handleInputChange} className="w-full h-12 px-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-base" list="supplier-suggestions" /></div>
                      <div className="min-w-0"><label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">{t("PO No.")}</label><input type="text" name="poNumber" value={formData.poNumber} onChange={handleInputChange} className="w-full h-12 px-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-base" /></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 pt-4 sm:pt-5 border-t border-slate-200">
                      <div className="min-w-0"><label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">{t("Batch No.")}</label><input type="text" name="batchNumber" value={formData.batchNumber} onChange={handleInputChange} className="w-full h-12 px-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold uppercase text-base" list="batch-suggestions" /></div>
                      <div className="min-w-0"><label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">{t("Location")}</label><input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full h-12 px-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold uppercase text-base" /></div>
                      <div className="min-w-0">
                        <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">{t("Condition")}</label>
                        <select name="incomingQualityCheck" value={formData.incomingQualityCheck} onChange={handleInputChange} className="w-full h-12 px-3 border border-slate-300 rounded-xl outline-none bg-white font-bold text-base">
                          <option value="Pass">Pass</option><option value="Damaged">Damaged</option><option value="Contaminated">Contaminated</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {department === 'Quality Control' && (
                <section className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm max-w-3xl mx-auto">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-5 flex items-center gap-2"><CheckCircle size={18} className="text-emerald-500"/> {t("Quality Control Assessment")}</h3>
                  <div className="flex flex-col sm:flex-row bg-slate-100 rounded-xl p-1 mb-6">
                    {['Extrusion', 'Cutting', 'Packing'].map(stage => (
                      <button key={stage} type="button" onClick={() => setQcStage(stage)} className={`flex-1 py-2.5 px-2 text-xs sm:text-base font-black rounded-lg transition-all ${qcStage === stage ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{t(stage)} QC</button>
                    ))}
                  </div>
                  <div className="space-y-4 sm:space-y-5">
                    <div className="min-w-0"><label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">Job Order No.</label><input type="text" name="jobOrder" value={formData.jobOrder} onChange={handleInputChange} required className="w-full h-12 px-3 border border-slate-300 rounded-xl outline-none font-black text-base sm:text-lg uppercase" list="jo-suggestions" /></div>
                    {qcStage === 'Extrusion' && (<><QCField label="Thickness Check (Microns)" name="qcExtThickness" statusName="qcExtThicknessStatus" formData={formData} onChange={handleInputChange} t={t} /><QCField label="Width Check (mm)" name="qcExtWidth" statusName="qcExtWidthStatus" formData={formData} onChange={handleInputChange} t={t} /></>)}
                    {qcStage === 'Cutting' && (<><QCField label="Seal Integrity Assessment" name="qcCutSeal" statusName="qcCutSealStatus" formData={formData} onChange={handleInputChange} t={t} /><QCField label="Length Check (mm)" name="qcCutLength" statusName="qcCutLengthStatus" formData={formData} onChange={handleInputChange} t={t} /></>)}
                    {qcStage === 'Packing' && (<><QCField label="Bag Weight Check (kg)" name="qcPackBagWeight" statusName="qcPackBagWeightStatus" formData={formData} onChange={handleInputChange} t={t} /><QCField label="Quantity Verified" name="qcPackTotalBags" statusName="qcPackTotalBagsStatus" formData={formData} onChange={handleInputChange} t={t} /></>)}
                    <div className="pt-4 border-t border-slate-200 min-w-0"><label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">Remarks</label><textarea name="qcNotes" value={formData.qcNotes} onChange={handleInputChange} rows="3" className="w-full p-3 border border-slate-300 rounded-xl outline-none text-base"></textarea></div>
                  </div>
                </section>
              )}

              {/* Downtime (Only for Manufacturing) */}
              {['Extrusion', 'Cutting'].includes(department) && (
                <section className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-5 flex items-center gap-2"><Clock size={18} className="text-blue-500"/> {t("Machine Downtime")}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 min-w-0">
                      <div className="min-w-0"><label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">{t("Planned (mins)")}</label><input type="number" name="plannedDowntime" value={formData.plannedDowntime} onChange={handleInputChange} className="w-full h-12 px-3 border border-slate-300 rounded-xl outline-none font-bold text-base" /></div>
                      <div className="min-w-0"><label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">{t("Unplanned (mins)")}</label><input type="number" name="unplannedDowntime" value={formData.unplannedDowntime} onChange={handleInputChange} className="w-full h-12 px-3 border border-slate-300 rounded-xl outline-none font-bold text-base" /></div>
                    </div>
                    <div className="sm:col-span-2 min-w-0">
                      <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">{t("Primary Downtime Reason")}</label>
                      <input type="text" name="downtimeReason" value={formData.downtimeReason} onChange={handleInputChange} className="w-full h-12 px-3 border border-slate-300 rounded-xl outline-none font-semibold text-base" list="downtime-suggestions" />
                    </div>
                  </div>
                </section>
              )}
              
              {/* Discrepancy Box (if failed) */}
              {['Extrusion', 'Cutting'].includes(department) && massBalance.isFailed && (
                <div className="p-4 sm:p-5 bg-red-50 border border-red-200 rounded-2xl animate-in slide-in-from-bottom-2">
                   <label className="block text-xs sm:text-sm font-black text-red-800 mb-2 tracking-wide">{t("Reason for Discrepancy (Required for Override)")}</label>
                   <input type="text" name="discrepancyReason" value={formData.discrepancyReason} onChange={handleInputChange} placeholder="e.g. Scale calibration issue..." className="w-full h-12 px-3 border border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-none bg-white font-semibold text-base" />
                </div>
              )}

            </form>
          )}
        </div>

        {/* STICKY FOOTER ACTION BAR */}
        {department !== 'Dashboard' && (
          <div className="fixed bottom-0 right-0 w-full md:w-[calc(100%-16rem)] bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:p-4 shadow-[0_-10px_30px_-5px_rgba(0,0,0,0.1)] z-50 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 md:px-8">
            <div className="flex flex-col text-center sm:text-left text-sm w-full sm:w-auto">
              <span className="font-black text-slate-800 tracking-tight text-sm sm:text-base">{t(department)} Report</span>
              <span className="text-slate-500 text-[10px] sm:text-[11px] uppercase tracking-widest font-bold flex items-center justify-center sm:justify-start gap-1.5 mt-0.5"><CheckCircle size={12} className="text-emerald-500"/> {saveIndicator}</span>
            </div>
            
            <button 
              onClick={handleSave} disabled={isSubmitting}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm sm:text-base font-black transition-all w-full sm:w-auto shadow-md active:scale-95 ${
                isSubmitting ? 'bg-slate-400 cursor-not-allowed text-white' : 
                (massBalance.isFailed && !formData.discrepancyReason && ['Extrusion', 'Cutting'].includes(department)) ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30 ring-4 ring-red-100' : 
                'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30 hover:-translate-y-0.5'
              }`}
            >
              <Save size={18} /> 
              {isSubmitting ? t('Saving...') : 
               (massBalance.isFailed && !formData.discrepancyReason && ['Extrusion', 'Cutting'].includes(department)) ? t('Discrepancy Must Be Resolved') : t('Submit Shift Log')}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;