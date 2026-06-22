import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ClipboardList, Settings, Box, AlertTriangle, Clock, Save, Printer, Scale, 
  Package, Truck, ArrowDownToLine, PlusCircle, Trash2, CheckCircle, BarChart3, 
  Activity, RefreshCw, Flag, TrendingUp, X, Search, PackageCheck, Layers, 
  Lock, LogOut, UserCircle, Globe, Menu, ChevronUp, ChevronDown, Edit2, Camera,
  Archive, ShoppingCart, CalendarDays, Zap
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
    "Quantity": "Quantity",
    "+ Add": "+ Add",
    "Total Input Material:": "Total Input Material:",
    "Input Roll Weight (kg)": "Input Roll Weight (kg)",
    "Production Output & Wastage": "Production Output & Wastage",
    "Shift Accumulator (Rolls)": "Shift Accumulator (Rolls)",
    "New Roll Weight (kg)": "New Roll Weight (kg)",
    "+ Add Roll": "+ Add Roll",
    "Accumulated Good Output": "Accumulated Good Output",
    "Actual Good Output": "Actual Good Output",
    "UoM": "UoM",
    "Wastage Generated": "Wastage Generated",
    "Wastage Accumulator": "Wastage Accumulator",
    "Type": "Type",
    "Weight (kg)": "Weight (kg)",
    "Setup Wastage": "Setup Wastage",
    "Process Wastage": "Process Wastage",
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
    "Machine Inspection": "Machine Inspection",
    "Machine Type": "Machine Type",
    "Filter Status": "Filter Status",
    "Scrap Purged": "Scrap Purged",
    "Sealing Temperature (℃)": "Sealing Temperature (℃)",
    "Blade / Thickness Check": "Blade / Thickness Check",
    "Machine Cleanliness": "Machine Cleanliness",
    "Safety Guards": "Safety Guards",
    "Good": "Good",
    "Needs Change": "Needs Change",
    "Changed": "Changed",
    "Yes": "Yes",
    "No": "No",
    "Status": "Status",
    "Pass": "Pass",
    "Fail": "Fail",
    "N/A": "N/A",
    "Submit Shift Log": "Submit Shift Log",
    "Saving...": "Saving...",
    "Discrepancy Must Be Resolved": "Discrepancy Must Be Resolved",
    "Mass Balance Verified": "Mass Balance Verified",
    "Mass Balance Failed (Discrepancy > 2%)": "Mass Balance Failed (Discrepancy > 2%)",
    "Total Input": "Total Input",
    "Total Output + Wastage": "Total Output + Wastage",
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
    "Optional": "Optional",
    "Evidence Photo (Optional)": "Evidence Photo (Optional)",
    "Tap to take photo or upload": "Tap to take photo or upload",
    "bag": "bag",
    "Mark Job as Complete": "Mark Job as Complete",
    "Flag this order as fully packed and ready for shipping.": "Flag this order as fully packed and ready for shipping.",
    "Ready to Ship Tracker": "Ready to Ship Tracker",
    "Customer": "Customer",
    "Packing Details": "Packing Details",
    "Packed Weight": "Packed Weight",
    "Pending Dispatch": "Pending Dispatch",
    "Container Logistics": "Container Logistics",
    "Container": "Container",
    "Arrival Date": "Arrival Date",
    "Laden Date": "Laden Date",
    "ETD PK Date": "ETD PK Date",
    "Inventory": "Inventory",
    "Warehouse Overview": "Warehouse Overview",
    "Raw Material Stock": "Raw Material Stock",
    "Finished Goods (Pending)": "Finished Goods (Pending)",
    "Total Volume": "Total Volume",
    "Material": "Material",
    "Incoming": "Incoming",
    "Consumed": "Consumed",
    "Current Stock": "Current Stock",
    "Purchase Requisition": "Purchase Requisition",
    "Item Name": "Item Name",
    "Remarks": "Remarks",
    "Resolve": "Resolve",
    "Action": "Action",
    "Job Schedule": "Job Schedule",
    "Job Schedule & Overview": "Job Schedule & Overview",
    "Pending Extrusion": "Pending Extrusion",
    "Pending Cutting": "Pending Cutting",
    "Pending Packing": "Pending Packing",
    "Left to run": "Left to run",
    "Left to cut": "Left to cut",
    "Left to pack": "Left to pack",
    "Run Date": "Run Date",
    "Target": "Target",
    "Unscheduled": "Unscheduled",
    "Job Order Overview": "Job Order Overview",
    "Scheduled Run Date": "Scheduled Run Date",
    "Assigned Machine": "Assigned Machine",
    "Extrusion Pending": "Extrusion Pending",
    "Cutting Pending": "Cutting Pending",
    "Packing Pending": "Packing Pending",
    "Shift Schedule": "Shift Schedule",
    "Shift Target": "Shift Target",
    "Auto-Schedule Jobs": "Auto-Schedule Jobs",
    "Urgency": "Urgency"
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
    "Quantity": "পরিমাণ",
    "Unit": "একক",
    "+ Add": "+ যোগ করুন",
    "Total Input Material:": "মোট ইনপুট কাঁচামাল:",
    "Input Roll Weight (kg)": "ইনপুট রোল ওজন (কেজি)",
    "Production Output & Wastage": "উৎপাদন আউটপুট এবং বর্জ্য",
    "Shift Accumulator (Rolls)": "শিফট অ্যাকুমুলেটর (রোল)",
    "New Roll Weight (kg)": "নতুন রোলের ওজন (কেজি)",
    "+ Add Roll": "+ রোল যোগ করুন",
    "Accumulated Good Output": "জমে থাকা ভালো আউটপুট",
    "Actual Good Output": "প্রকৃত ভালো আউটপুট",
    "UoM": "একক (UoM)",
    "Wastage Generated": "উৎপাদিত বর্জ্য",
    "Wastage Accumulator": "বর্জ্য অ্যাকুমুলেটর",
    "Type": "ধরন",
    "Weight (kg)": "ওজন (কেজি)",
    "Setup Wastage": "সেটআপ বর্জ্য",
    "Process Wastage": "প্রসেস বর্জ্য",
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
    "Machine Inspection": "মেশিন পরিদর্শন",
    "Machine Type": "মেশিনের ধরন",
    "Filter Status": "ফিল্টার স্ট্যাটাস",
    "Scrap Purged": "স্ক্র্যাপ পার্জ করা হয়েছে",
    "Sealing Temperature (℃)": "সিলিং তাপমাত্রা (℃)",
    "Blade / Thickness Check": "ব্লেড / পুরুত্ব চেক",
    "Machine Cleanliness": "মেশিনের পরিচ্ছন্নতা",
    "Safety Guards": "নিরাপত্তা গার্ড",
    "Good": "ভালো",
    "Needs Change": "পরিবর্তন প্রয়োজন",
    "Changed": "পরিবর্তন করা হয়েছে",
    "Yes": "হ্যাঁ",
    "No": "না",
    "Status": "স্ট্যাটাস",
    "Pass": "পাস",
    "Fail": "ফেইল",
    "N/A": "প্রযোজ্য নয়",
    "Submit Shift Log": "শিফট লগ জমা দিন",
    "Saving...": "সেভ হচ্ছে...",
    "Discrepancy Must Be Resolved": "অসঙ্গতি সমাধান করতে হবে",
    "Mass Balance Verified": "ম্যাস ব্যালেন্স যাচাই করা হয়েছে",
    "Mass Balance Failed (Discrepancy > 2%)": "ম্যাস ব্যালেন্স ফেইল (পার্থক্য > ২%)",
    "Total Input": "মোট ইনপুট",
    "Total Output + Wastage": "মোট আউটপুট + বর্জ্য",
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
    "Optional": "ঐচ্ছিক",
    "Evidence Photo (Optional)": "প্রমাণের ছবি (ঐচ্ছিক)",
    "Tap to take photo or upload": "ছবি তুলতে বা আপলোড করতে ট্যাপ করুন",
    "bag": "ব্যাগ",
    "Mark Job as Complete": "কাজটি সম্পূর্ণ হিসেবে চিহ্নিত করুন",
    "Flag this order as fully packed and ready for shipping.": "এই অর্ডারটি সম্পূর্ণ প্যাক করা এবং শিপিংয়ের জন্য প্রস্তুত হিসেবে ফ্ল্যাগ করুন।",
    "Ready to Ship Tracker": "শিপিংয়ের জন্য প্রস্তুত ট্র্যাকার",
    "Customer": "গ্রাহক",
    "Packing Details": "প্যাকিং বিবরণ",
    "Packed Weight": "প্যাক করা ওজন",
    "Pending Dispatch": "অপেক্ষমাণ ডিসপ্যাচ",
    "Container Logistics": "কনটেইনার লজিস্টিকস",
    "Container": "কনটেইনার",
    "Arrival Date": "আগমনের তারিখ",
    "Laden Date": "লাডেন তারিখ",
    "ETD PK Date": "ইটিডি পিকে তারিখ",
    "Inventory": "ইনভেন্টরি",
    "Warehouse Overview": "গুদাম ওভারভিউ",
    "Raw Material Stock": "কাঁচামাল স্টক",
    "Finished Goods (Pending)": "ফিনিশড গুডস (অপেক্ষমাণ)",
    "Total Volume": "মোট আয়তন",
    "Material": "উপাদান",
    "Incoming": "ইনকামিং",
    "Consumed": "ব্যবহৃত",
    "Current Stock": "বর্তমান স্টক",
    "Purchase Requisition": "ক্রয় রিকুইজিশন",
    "Item Name": "আইটেমের নাম",
    "Remarks": "মন্তব্য",
    "Resolve": "সমাধান করুন",
    "Action": "অ্যাকশন",
    "Job Schedule": "কাজের সময়সূচী",
    "Job Schedule & Overview": "কাজের সময়সূচী এবং ওভারভিউ",
    "Pending Extrusion": "অপেক্ষমাণ এক্সট্রুশন",
    "Pending Cutting": "অপেক্ষমাণ কাটিং",
    "Pending Packing": "অপেক্ষমাণ প্যাকিং",
    "Left to run": "বাকি রান",
    "Left to cut": "বাকি কাট",
    "Left to pack": "বাকি প্যাক",
    "Run Date": "রান তারিখ",
    "Target": "লক্ষ্য",
    "Unscheduled": "অনির্ধারিত",
    "Job Order Overview": "জব অর্ডার ওভারভিউ",
    "Scheduled Run Date": "নির্ধারিত রান তারিখ",
    "Assigned Machine": "বরাদ্দকৃত মেশিন",
    "Extrusion Pending": "এক্সট্রুশন অপেক্ষমাণ",
    "Cutting Pending": "কাটিং অপেক্ষমাণ",
    "Packing Pending": "প্যাকিং অপেক্ষমাণ",
    "Shift Schedule": "শিফট শিডিউল",
    "Shift Target": "শিফট টার্গেট",
    "Auto-Schedule Jobs": "অটো-শিডিউল জবস",
    "Urgency": "জরুরী"
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
    "Quantity": "Kuantiti",
    "Unit": "Unit",
    "+ Add": "+ Tambah",
    "Total Input Material:": "Jumlah Bahan Input:",
    "Input Roll Weight (kg)": "Berat Gulungan Input (kg)",
    "Production Output & Wastage": "Keluaran Pengeluaran & Sisa",
    "Shift Accumulator (Rolls)": "Pengumpul Syif (Gulungan)",
    "New Roll Weight (kg)": "Berat Gulungan Baru (kg)",
    "+ Add Roll": "+ Tambah Gulungan",
    "Accumulated Good Output": "Terkumpul Keluaran Baik",
    "Actual Good Output": "Keluaran Baik Sebenar",
    "UoM": "Unit",
    "Wastage Generated": "Sisa Terjana",
    "Wastage Accumulator": "Pengumpul Sisa",
    "Type": "Jenis",
    "Weight (kg)": "Berat (kg)",
    "Setup Wastage": "Sisa Persediaan",
    "Process Wastage": "Sisa Proses",
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
    "Machine Inspection": "Pemeriksaan Mesin",
    "Machine Type": "Jenis Mesin",
    "Filter Status": "Status Penapis",
    "Scrap Purged": "Sisa Dibuang",
    "Sealing Temperature (℃)": "Suhu Pengedap (℃)",
    "Blade / Thickness Check": "Pemeriksaan Bilah / Ketebalan",
    "Machine Cleanliness": "Kebersihan Mesin",
    "Safety Guards": "Pengadang Keselamatan",
    "Good": "Baik",
    "Needs Change": "Perlu Ditukar",
    "Changed": "Telah Ditukar",
    "Yes": "Ya",
    "No": "Tidak",
    "Status": "Status",
    "Pass": "Lulus",
    "Fail": "Gagal",
    "N/A": "N/A",
    "Submit Shift Log": "Hantar Log Syif",
    "Saving...": "Menyimpan...",
    "Discrepancy Must Be Resolved": "Percanggahan Mesti Diselesaikan",
    "Mass Balance Verified": "Imbangan Jisim Disahkan",
    "Mass Balance Failed (Discrepancy > 2%)": "Imbangan Jisim Gagal (Percanggahan > 2%)",
    "Total Input": "Jumlah Input",
    "Total Output + Wastage": "Jumlah Keluaran + Sisa",
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
    "Optional": "Pilihan",
    "Evidence Photo (Optional)": "Gambar Bukti (Pilihan)",
    "Tap to take photo or upload": "Ketik untuk mengambil gambar atau muat naik",
    "bag": "beg",
    "Mark Job as Complete": "Tandakan Kerja sebagai Selesai",
    "Flag this order as fully packed and ready for shipping.": "Tandakan pesanan ini sebagai siap dibungkus dan sedia untuk penghantaran.",
    "Ready to Ship Tracker": "Penjejak Sedia untuk Dihantar",
    "Customer": "Pelanggan",
    "Packing Details": "Butiran Pembungkusan",
    "Packed Weight": "Berat Dibungkus",
    "Pending Dispatch": "Penghantaran Tertunda",
    "Container Logistics": "Logistik Kontena",
    "Container": "Kontena",
    "Arrival Date": "Tarikh Ketibaan",
    "Laden Date": "Tarikh Muatan (Laden)",
    "ETD PK Date": "Tarikh ETD PK",
    "Inventory": "Inventori",
    "Warehouse Overview": "Gambaran Keseluruhan Gudang",
    "Raw Material Stock": "Stok Bahan Mentah",
    "Finished Goods (Pending)": "Barang Siap (Tertunda)",
    "Total Volume": "Jumlah Isipadu",
    "Material": "Bahan",
    "Incoming": "Masuk",
    "Consumed": "Digunakan",
    "Current Stock": "Stok Semasa",
    "Purchase Requisition": "Permintaan Pembelian",
    "Item Name": "Nama Item",
    "Remarks": "Catatan",
    "Resolve": "Selesaikan",
    "Action": "Tindakan",
    "Job Schedule": "Jadual Kerja",
    "Job Schedule & Overview": "Jadual Kerja & Gambaran Keseluruhan",
    "Pending Extrusion": "Penyemperitan Tertunda",
    "Pending Cutting": "Pemotongan Tertunda",
    "Pending Packing": "Pembungkusan Tertunda",
    "Left to run": "Baki untuk dijalankan",
    "Left to cut": "Baki untuk dipotong",
    "Left to pack": "Baki untuk dibungkus",
    "Run Date": "Tarikh Larian",
    "Target": "Sasaran",
    "Unscheduled": "Tidak Dijadualkan",
    "Job Order Overview": "Gambaran Keseluruhan Pesanan Kerja",
    "Scheduled Run Date": "Tarikh Larian Dijadualkan",
    "Assigned Machine": "Mesin Ditugaskan",
    "Extrusion Pending": "Penyemperitan Tertunda",
    "Cutting Pending": "Pemotongan Tertunda",
    "Packing Pending": "Pembungkusan Tertunda",
    "Shift Schedule": "Jadual Syif",
    "Shift Target": "Sasaran Syif",
    "Auto-Schedule Jobs": "Jadual Auto",
    "Urgency": "Kecemasan"
  }
};

// --- CONFIGURATION ENGINE ---
// Manage all production constraints and routing logic here instead of inside the algorithm
const SCHEDULING_CONFIG = {
  capacities: {
    extrusion: { default: 3000, 'B6': 3000 },
    cutting: { defaultKg: 3000, defaultPcs: 4000, 'C5_pcs': 4000 },
    packing: { kg: 6750, pcs: 45000 } // Approx 450 bags/shift
  },
  concurrency: {
    // Pipeline Variables for Concurrent Manufacturing (Just-In-Time)
    rollWeightKg: 180,               // Standard weight of a roll before it is moved to cutting
    transitTimeMins: 30,             // Time needed to weigh, QA, and move the roll to the next machine
    packBatchPcs: 150,               // Target pcs needed to trigger the packing team to start
    packBatchKg: 50                  // Target kg needed to trigger the packing team to start (if order is in kg)
  },
  extrusionRoutingRules: [
    // The algorithm evaluates these top-to-bottom. It will use the first rule that matches.
    { material: 'HDPE', minWidth: 700, maxWidth: Infinity, machines: ['B8'] },
    { material: 'HDPE', minWidth: 0, maxWidth: 699.99, machines: ['B1', 'B8'] },
    { material: 'LDPE', minWidth: 1800.01, maxWidth: Infinity, machines: ['B6'] },
    { material: 'LDPE', minWidth: 1200, maxWidth: 1800, machines: ['B4', 'B5'] },
    { material: 'LDPE', minWidth: 700, maxWidth: 1199.99, machines: ['B9', 'B4', 'B5'] },
    { material: 'LDPE', minWidth: 0, maxWidth: 699.99, machines: ['B2', 'B9'] }
  ],
  defaultExtrusionMachines: ['B1','B2','B3','B4','B5','B6','B7','B8','B9']
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

// 2. Sortable, Filterable & Paginated Table Component
const SortableTable = ({ title, columns, data, onFlag, onRowClick, rowsPerPage = 5 }) => {
  const [filter, setFilter] = useState('');
  const [sortCol, setSortCol] = useState(0); 
  const [sortDesc, setSortDesc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter(row => {
      if (!row) return false;
      const cells = Array.isArray(row) ? row : Object.values(row);
      return cells.some(cell => cell != null && String(cell).toLowerCase().includes((filter || '').toLowerCase()));
    });
  }, [data, filter]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let valA = a[columns[sortCol].dataIndex];
      let valB = b[columns[sortCol].dataIndex];
      if (columns[sortCol].type === 'date') { valA = new Date(valA).getTime(); valB = new Date(valB).getTime(); }
      else if (columns[sortCol].type === 'number') { valA = parseFloat(valA) || 0; valB = parseFloat(valB) || 0; }
      
      if (valA === valB) return 0;
      if (valA < valB) return sortDesc ? 1 : -1;
      if (valA > valB) return sortDesc ? -1 : 1;
      return 0;
    });
  }, [filteredData, sortCol, sortDesc, columns]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, sortCol, sortDesc]);

  const totalPages = rowsPerPage > 0 ? Math.ceil(sortedData.length / rowsPerPage) || 1 : 1;
  const paginatedData = rowsPerPage > 0 ? sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage) : sortedData;

  const handleSort = (index) => {
    if (sortCol === index) setSortDesc(!sortDesc);
    else { setSortCol(index); setSortDesc(true); }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h3 className="font-bold text-slate-800 text-base">{title}</h3>
        <div className="relative w-full sm:w-auto">
          <input 
            type="text" placeholder="Search records..." value={filter} onChange={e => setFilter(e.target.value)}
            className="pl-9 pr-3 py-2.5 text-base border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-56"
          />
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
        </div>
      </div>
      
      <div className={`p-0 flex-1 ${rowsPerPage === 0 ? 'max-h-[500px] overflow-auto custom-scrollbar' : 'overflow-x-auto'}`}>
        <table className="w-full text-left whitespace-nowrap relative">
          <thead className="text-xs text-slate-500 bg-slate-100/90 backdrop-blur-sm uppercase border-b border-slate-200 font-bold sticky top-0 z-10">
            <tr>
              {columns.map((col, i) => (
                <th key={i} onClick={() => col.sortable !== false && handleSort(i)} className={`px-5 py-3 cursor-pointer hover:bg-slate-200/80 transition-colors ${col.sortable !== false ? 'select-none' : ''}`}>
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {sortCol === i ? (sortDesc ? <ChevronDown size={14} className="text-blue-600"/> : <ChevronUp size={14} className="text-blue-600"/>) : <span className="w-3.5" />}
                  </div>
                </th>
              ))}
              {onFlag && <th className="px-5 py-3 text-center">Action</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? paginatedData.map((row, i) => (
              <tr key={i} onClick={() => onRowClick && onRowClick(row)} className={`border-b border-slate-100 last:border-0 hover:bg-blue-50/30 transition-colors text-sm ${onRowClick ? 'cursor-pointer' : ''}`}>
                {columns.map((col, j) => (
                  <td key={j} className="px-5 py-3.5 text-slate-700">
                    {col.render ? col.render(row[col.dataIndex], row) : row[col.dataIndex]}
                  </td>
                ))}
                {onFlag && (
                  <td className="px-5 py-3.5 text-center">
                    <button onClick={(e) => { e.stopPropagation(); onFlag(row); }} className="text-slate-400 hover:text-amber-600 transition-colors bg-white border border-slate-200 p-2 rounded-lg shadow-sm active:scale-95" title="Flag Error"><Flag size={16}/></button>
                  </td>
                )}
              </tr>
            )) : <tr><td colSpan={columns.length + (onFlag ? 1 : 0)} className="text-center py-8 text-slate-400 italic">No records found.</td></tr>}
          </tbody>
        </table>
      </div>

      {rowsPerPage > 0 && (
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between">
          <span className="text-sm text-slate-500 font-medium hidden sm:block">Page {currentPage} of {totalPages}</span>
          <span className="text-sm text-slate-500 font-medium sm:hidden">{currentPage} / {totalPages}</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-bold bg-white border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:scale-95"
            >
              Prev
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-bold bg-white border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:scale-95"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// 3. Image Upload Field Component
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

// QC Field Component
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

const STORAGE_KEY = 'dpr_draft_session';

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

const defaultStats = { output: 0, prevOutput: 0, consumption: 0, prevConsumption: 0, wastage: 0, prevWastage: 0, units: 0, pallets: 0 };
const defaultAnalytics = { daily: defaultStats, weekly: defaultStats, monthly: defaultStats, yearly: defaultStats };

// YOUR GOOGLE SCRIPT URL HERE
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyM2vaERlbEX1sziKs8I8q1X1vogpi5WR38MJ7Z2H6wA9iamBOmSFBVPuEaB5-mAt2RbQ/exec';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null); 

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

  // Function to manually toggle the Ready to Ship status from the Dashboard
  const handleToggleReadyToShip = async (jo, isReady) => {
    const loadToast = toast.loading(isReady ? "Marking as Ready to Ship..." : "Reverting status...");
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'toggleReadyToShip', jo, isReady })
      });
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
      const totals = dashboardData.joTotals[order.jo] || { extrusion: 0, cutting: 0, packing: 0, lastUpdated: 0 };
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
        requiresCutting: order.requiresCutting,
        urgency: order.urgency || 5, // Fallback to 5
        lastUpdated: totals.lastUpdated || 0,
        isReadyToShip: order.isReadyToShip || false
      };
    }).sort((a, b) => b.lastUpdated - a.lastUpdated || b.issueDateMs - a.issueDateMs);
  }, [dashboardData]);

  const readyToShipData = useMemo(() => {
    if (!dashboardData?.masterOrders || !dashboardData?.joTotals) return [];
    return dashboardData.masterOrders.filter(order => {
        if (!order.isReadyToShip) return false;
        const totals = dashboardData.joTotals[order.jo];
        if (!totals) return false;
        // Only show orders that still have a meaningful amount pending dispatch (> 0.5kg)
        // This completely eliminates floating-point ghost decimals keeping orders on the list
        const pending = totals.packing - totals.dispatched;
        return pending > 0.5; 
    }).map(order => {
        const totals = dashboardData.joTotals[order.jo];
        return {
            jo: order.jo,
            customer: order.customer,
            description: order.description,
            dimension: order.dimension,
            packingSize: totals.packingSize || '-',
            packingUom: totals.packingUom || '-',
            totalPackedWeight: totals.packing || 0,
            totalPalletWeight: totals.palletWeight || 0,
            pendingDispatch: totals.packing - totals.dispatched,
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
        return { ...o, runDateMs: sched.runDateMs || 9999999999999, runDateDisplay: sched.runDateDisplay || t("Unscheduled"), schedMachine: sched.machine || '-' };
    }).sort((a, b) => a.runDateMs - b.runDateMs || b.extPending - a.extPending);
  }, [activeOrdersData, scheduleMap]);

  const pendingCutting = useMemo(() => {
    return activeOrdersData.filter(o => o.requiresCutting && o.cutPending > 0.5).map(o => {
        const sched = scheduleMap[o.jo]?.cutting || scheduleMap[o.jo]?.general || {};
        return { ...o, runDateMs: sched.runDateMs || 9999999999999, runDateDisplay: sched.runDateDisplay || t("Unscheduled"), schedMachine: sched.machine || '-' };
    }).sort((a, b) => a.runDateMs - b.runDateMs || b.cutPending - a.cutPending);
  }, [activeOrdersData, scheduleMap]);

  const pendingPacking = useMemo(() => {
    return activeOrdersData.filter(o => o.packPending > 0.5).map(o => {
        const sched = scheduleMap[o.jo]?.packing || scheduleMap[o.jo]?.general || {};
        return { ...o, runDateMs: sched.runDateMs || 9999999999999, runDateDisplay: sched.runDateDisplay || t("Unscheduled"), schedMachine: sched.machine || '-' };
    }).sort((a, b) => a.runDateMs - b.runDateMs || b.packPending - a.packPending);
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

  // Live Mass Balance Integrity Evaluation
  useEffect(() => {
    if (!['Extrusion', 'Cutting'].includes(department)) return;
    let totalInput = department === 'Extrusion' ? (formData.extrusionMaterials || []).reduce((sum, mat) => sum + Number(mat.quantity || 0), 0) : Number(formData.inputRollWeight || 0);
    const outputWeight = formData.uom === 'kg' ? Number(formData.actualOutput || 0) : 0;
    const totalWastage = Number(formData.setupScrap || 0) + Number(formData.processScrap || 0) + Number(formData.rejections || 0);
    const totalAccounted = outputWeight + totalWastage;
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
    
    // Check if user has scrolled to the absolute bottom of the container (with a 20px threshold)
    const isAtBottom = Math.ceil(currentScrollY + e.target.clientHeight) >= e.target.scrollHeight - 20;

    if (isAtBottom) {
      setIsFooterVisible(true);  // Always show footer when at the bottom
    } else if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
      setIsFooterVisible(false); // Scrolling down, hide footer
    } else {
      setIsFooterVisible(true);  // Scrolling up, show footer
    }
    
    lastScrollY.current = currentScrollY;
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative">
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
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans text-slate-800">
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
      {(department === 'Extrusion' || department === 'Cutting') && massBalance.totalInput > 0 && formData.uom === 'kg' && (
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
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-slate-100/50 relative pb-32 md:pb-24" onScroll={handleScroll}>
        
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
                  columns={[
                    { label: 'Status', dataIndex: 'isReadyToShip', type: 'boolean', render: (v, row) => (
                      <button 
                        onClick={() => handleToggleReadyToShip(row.jo, !v)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-colors shadow-sm border ${v ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'}`}
                        title="Click to toggle Ready to Ship status"
                      >
                        {v ? <><CheckCircle size={14} className="fill-emerald-100"/> Ready</> : 'Pending'}
                      </button>
                    )},
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

          ) : department === 'Job Schedule' ? (
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
                         { label: t("Left to cut"), dataIndex: 'cutPending', type: 'number', render: v => <span className="font-black text-emerald-600 text-base whitespace-nowrap">{v.toFixed(1)} kg</span> }
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
                         { label: t("Left to pack"), dataIndex: 'packPending', type: 'number', render: v => <span className="font-black text-purple-600 text-base whitespace-nowrap">{v.toFixed(1)} kg</span> }
                       ]}
                     />
                   </>
                 )}
               </div>
            </div>

          ) : department === 'Inventory' ? (
            <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">{t("Warehouse Overview")}</h2>
                    <p className="text-sm font-bold text-slate-500 mt-1">Real-time inventory and stock levels</p>
                  </div>
                  <button onClick={fetchDashboardData} disabled={isFetchingDashboard} className="flex items-center justify-center gap-2 text-base font-black bg-white border border-slate-300 px-5 py-3 rounded-xl hover:bg-slate-50 transition-colors shadow-sm w-full sm:w-auto active:scale-95 text-slate-700">
                    <RefreshCw size={18} className={isFetchingDashboard ? 'animate-spin text-blue-500' : 'text-slate-400'} /> Refresh Sync
                  </button>
                </div>

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
                      { label: 'J/O No.', dataIndex: 'jo', type: 'string', render: (v, row) => (
                        <div className="flex flex-col min-w-[120px]">
                          <span className="font-black text-slate-900 text-base">{v}</span>
                          <span className="text-xs font-bold text-slate-500 mt-0.5 truncate max-w-[150px]" title={row.customer}>{row.customer}</span>
                        </div>
                      )},
                      { label: 'Details', dataIndex: 'dimension', type: 'string', render: v => <span className="inline-block bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-slate-200 w-fit truncate" title={v}>{v || '-'}</span> },
                      { label: 'Pending', dataIndex: 'pendingDispatch', type: 'number', render: v => <span className="font-black text-amber-600 text-base">{v.toFixed(1)} kg</span> },
                      { label: 'Status', dataIndex: 'isReady', type: 'boolean', render: v => (
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${v ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                              {v ? 'Ready' : 'Packing'}
                          </span>
                      )}
                    ]}
                  />
                </div>
                
                {/* Purchase Requisition Tracker inside Inventory */}
                <div className="mt-6 md:mt-8">
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
                      { label: t("Action"), dataIndex: 'timestamp', type: 'string', render: (v) => (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleResolveRequisition(v); }}
                          className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-500 hover:text-white rounded-lg text-xs font-black transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
                        >
                          <CheckCircle size={14}/> {t("Resolve")}
                        </button>
                      )}
                    ]}
                  />
                </div>
            </div>
          ) : (
            // ================= DATA ENTRY FORMS =================
            <form className="space-y-6 md:space-y-8 animate-in fade-in zoom-in-95 duration-300">
              
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
                <div className="absolute top-5 md:top-8 right-5 md:right-8 flex items-center gap-2 bg-slate-50 text-slate-500 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200">
                  <CheckCircle size={14} className="text-emerald-500" /> {saveIndicator}
                </div>
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
                  {(department === 'Extrusion' || department === 'Cutting') && (
                    <div className="min-w-0">
                      <label className="block text-sm font-bold text-slate-700 mb-2">{t("Machine No.")}</label>
                      <input type="text" name="machineId" value={formData.machineId} onChange={handleInputChange} required placeholder={department === 'Extrusion' ? 'e.g. B1' : 'e.g. C1'} className="w-full h-14 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white uppercase transition-colors text-base font-black" list="machine-suggestions" />
                    </div>
                  )}
                </div>
              </section>

              {/* PURCHASE REQUISITION FORM */}
              {department === 'Purchase Requisition' && (
                <section className="bg-white p-5 md:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-3xl mx-auto">
                  <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"><ShoppingCart size={22} className="text-amber-500"/> {t("Purchase Requisition")}</h3>
                  <div className="space-y-5">
                    <div className="min-w-0">
                      <label className="block text-sm font-bold text-slate-700 mb-2">{t("Item Name")}</label>
                      <input type="text" name="reqItemName" value={formData.reqItemName} onChange={handleInputChange} required placeholder="e.g. STRAPPING BAND, OPP TAPE..." className="w-full h-14 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none uppercase font-black text-base" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="flex gap-4">
                        <div className="flex-1 min-w-0">
                          <label className="block text-sm font-bold text-slate-700 mb-2">{t("Quantity")}</label>
                          <input type="number" step="0.01" name="reqQuantity" value={formData.reqQuantity} onChange={handleInputChange} required className="w-full h-14 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-black text-xl text-amber-600" />
                        </div>
                        <div className="w-24 shrink-0">
                          <label className="block text-sm font-bold text-slate-700 mb-2">{t("UoM")}</label>
                          <select name="reqUom" value={formData.reqUom} onChange={handleInputChange} className="w-full h-14 px-3 border border-slate-300 rounded-xl outline-none bg-white font-bold text-base">
                            <option value="pcs">pcs</option><option value="box">box</option><option value="rolls">rolls</option><option value="kg">kg</option>
                          </select>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <label className="block text-sm font-bold text-slate-700 mb-2">{t("Current Stock")}</label>
                        <input type="number" step="0.01" name="reqCurrentStock" value={formData.reqCurrentStock} onChange={handleInputChange} required className="w-full h-14 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-bold text-base" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <label className="block text-sm font-bold text-slate-700 mb-2">{t("Remarks")}</label>
                      <input type="text" name="reqRemarks" value={formData.reqRemarks} onChange={handleInputChange} placeholder="Urgency, size specifics, etc." className="w-full h-14 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-semibold text-base" />
                    </div>
                  </div>
                </section>
              )}

              {/* MANUFACTURING DEPARTMENTS (Extrusion & Cutting) -> 2 Column Grid */}
              {(department === 'Extrusion' || department === 'Cutting') && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
                  
                  {/* Left Column: 1. Material Inputs */}
                  <section className="bg-white p-5 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
                    <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"><Box size={22} className="text-blue-500"/> {t("Material Inputs")}</h3>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-bold text-slate-700 mb-2">{t("Job Order No.")}</label>
                      <input type="text" name="jobOrder" value={formData.jobOrder} onChange={handleInputChange} required placeholder="e.g. 99-1" className="w-full h-14 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase font-black text-slate-800 text-base" list="jo-suggestions" />
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
                            <div key={mat.id} className="flex justify-between items-center bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm group">
                              <div className="min-w-0 flex-1 pr-2">
                                <div className="font-black text-slate-800 text-sm truncate">{mat.materialId !== 'N/A' ? mat.materialId : (mat.materialName !== 'N/A' ? mat.materialName : 'Unknown')}</div>
                                <div className="text-[11px] text-slate-500 font-bold mt-0.5 truncate">Batch: {mat.batchNo}</div>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <InlineEdit value={mat.quantity} onSave={(val) => updateMaterialQuantity(mat.id, val)} suffix="kg" />
                                <button type="button" onClick={() => handleRemoveMaterial(mat.id)} className="text-slate-300 hover:text-red-500 p-2 bg-slate-50 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18}/></button>
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
                            <div key={roll.id} className="flex justify-between items-center bg-white p-3.5 rounded-xl border border-emerald-100 shadow-sm group">
                              <span className="text-slate-600 font-bold text-sm">Roll {i + 1}</span>
                              <div className="flex items-center gap-4">
                                <InlineEdit value={roll.weight} onSave={(val) => updateRollWeight(roll.id, val)} suffix="kg" />
                                <button type="button" onClick={() => handleRemoveRoll(roll.id)} className="text-slate-300 hover:text-red-500 p-2 bg-slate-50 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18}/></button>
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
                          className={`w-full h-14 px-4 border-2 rounded-xl outline-none text-xl font-black transition-colors ${massBalance.isFailed && formData.uom === 'kg' ? 'border-red-400 text-red-700 bg-red-50' : 'border-slate-300 focus:border-emerald-500 text-slate-800 bg-white'}`} 
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
                          <div key={scrap.id} className="flex justify-between items-center bg-white p-3.5 rounded-xl border border-rose-100 shadow-sm">
                            <span className="text-slate-600 font-bold text-sm">{scrap.type === 'setupScrap' ? 'Setup' : 'Process'}</span>
                            <div className="flex items-center gap-4">
                              <InlineEdit value={scrap.weight} onSave={(val) => updateScrapWeight(scrap.id, val)} suffix="kg" className="text-rose-700" />
                              <button type="button" onClick={() => handleRemoveScrap(scrap.id)} className="text-slate-300 hover:text-rose-600 p-2 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"><Trash2 size={18}/></button>
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
                        <input type="text" name="jobOrder" value={formData.jobOrder} onChange={handleInputChange} required placeholder="e.g. 99-1" className="w-full h-14 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none uppercase font-black text-slate-800 bg-slate-50 focus:bg-white text-base" list="jo-suggestions" />
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
                          <div key={bag.id} className="flex gap-3 items-center">
                            <span className="text-[11px] font-black uppercase text-slate-400 w-12 shrink-0 tracking-wider">Bag {index + 1}</span>
                            <input type="number" step="0.01" value={bag.weight} onChange={(e) => updateBagWeight(bag.id, e.target.value)} placeholder="0.00 kg" className="min-w-0 flex-1 h-12 px-4 border border-slate-300 rounded-xl focus:border-blue-500 outline-none font-bold bg-white text-base" />
                            {formData.bagWeights.length > 1 && (
                              <button type="button" onClick={() => removeBagWeightRow(bag.id)} className="text-slate-300 hover:text-red-500 p-3 bg-white border border-slate-200 rounded-xl transition-colors shrink-0"><Trash2 size={18}/></button>
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
                        <input type="text" name="jobOrder" value={formData.jobOrder} onChange={handleInputChange} required placeholder="e.g. 99-1" className="w-full h-14 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase font-black text-base bg-slate-50 focus:bg-white transition-colors" list="jo-suggestions" />
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
                           <div key={batch.id} className="flex justify-between items-center bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                             <div className="flex items-center gap-3">
                               <span className="bg-blue-100 text-blue-700 font-black text-xs px-2.5 py-1 rounded-md">{idx + 1}</span>
                               <input type="text" value={batch.batchNo} onChange={(e) => updateIncomingBatchNo(batch.id, e.target.value)} className="font-bold text-slate-800 text-base outline-none border-b border-dashed border-slate-300 focus:border-blue-500 bg-transparent w-40 uppercase" />
                             </div>
                             <div className="flex items-center gap-4">
                               <InlineEdit value={batch.amount} onSave={(val) => updateIncomingBatchAmount(batch.id, val)} suffix="kg" />
                               <button type="button" onClick={() => removeIncomingBatch(batch.id)} className="text-slate-400 hover:text-red-500 p-2 bg-slate-50 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18}/></button>
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

              {department === 'Quality Control' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8 items-start w-full">
                  
                  {/* Container 1: Machine Inspection */}
                  <section 
                    onClick={() => handleQcFormSwitch('machine')}
                    className={`bg-white p-5 md:p-8 rounded-3xl border-2 transition-all duration-300 shadow-sm flex flex-col ${qcActiveForm === 'machine' ? 'border-blue-500 ring-4 ring-blue-50' : 'border-slate-200 opacity-60 hover:opacity-100 cursor-pointer'}`}
                  >
                    <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                      <Settings size={22} className={qcActiveForm === 'machine' ? 'text-blue-500' : 'text-slate-400'}/> 
                      {t("Machine Inspection")}
                    </h3>
                    
                    <div className="space-y-5 pointer-events-auto flex-1 flex flex-col">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                        <div className="min-w-0">
                            <label className="block text-sm font-bold text-slate-700 mb-2">{t("Machine Type")}</label>
                            <select name="qcMachineType" value={formData.qcMachineType} onChange={handleInputChange} disabled={qcActiveForm !== 'machine'} className="w-full h-14 px-4 border border-slate-300 rounded-xl outline-none bg-white font-bold text-base disabled:bg-slate-50 transition-colors">
                                <option value="Extrusion">{t("Extrusion")}</option>
                                <option value="Cutting">{t("Cutting")}</option>
                            </select>
                        </div>
                        <div className="min-w-0">
                            <label className="block text-sm font-bold text-slate-700 mb-2">{t("Machine No.")}</label>
                            <input type="text" name="machineId" value={formData.machineId} onChange={handleInputChange} disabled={qcActiveForm !== 'machine'} className="w-full h-14 px-4 border border-slate-300 rounded-xl outline-none font-black text-base uppercase disabled:bg-slate-50 transition-colors" list="machine-suggestions" placeholder="e.g. B1 / C1" />
                        </div>
                      </div>

                      {formData.qcMachineType === 'Extrusion' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                          <div className="min-w-0">
                              <label className="block text-sm font-bold text-slate-700 mb-2">{t("Filter Status")}</label>
                              <select name="qcExtFilter" value={formData.qcExtFilter} onChange={handleInputChange} disabled={qcActiveForm !== 'machine'} className="w-full h-14 px-4 border border-slate-300 rounded-xl outline-none bg-white font-bold text-base disabled:bg-slate-50 transition-colors">
                                  <option value="Good">{t("Good")}</option>
                                  <option value="Needs Change">{t("Needs Change")}</option>
                                  <option value="Changed">{t("Changed")}</option>
                              </select>
                          </div>
                          <div className="min-w-0">
                              <label className="block text-sm font-bold text-slate-700 mb-2">{t("Scrap Purged")}</label>
                              <select name="qcExtPurged" value={formData.qcExtPurged} onChange={handleInputChange} disabled={qcActiveForm !== 'machine'} className="w-full h-14 px-4 border border-slate-300 rounded-xl outline-none bg-white font-bold text-base disabled:bg-slate-50 transition-colors">
                                  <option value="Yes">{t("Yes")}</option>
                                  <option value="No">{t("No")}</option>
                                  <option value="N/A">{t("N/A")}</option>
                              </select>
                          </div>
                        </div>
                      )}
                      
                      {formData.qcMachineType === 'Cutting' && (
                          <div className="space-y-5">
                              <QCField label={t("Sealing Temperature (℃)")} name="qcCutTemp" statusName="qcCutTempStatus" formData={formData} onChange={handleInputChange} t={t} placeholder="e.g. 180" disabled={qcActiveForm !== 'machine'} />
                              <QCField label={t("Blade / Thickness Check")} name="qcCutMachineThickness" statusName="qcCutMachineThicknessStatus" formData={formData} onChange={handleInputChange} t={t} placeholder="e.g. 0.05" disabled={qcActiveForm !== 'machine'} />
                          </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                          <div className="min-w-0">
                              <label className="block text-sm font-bold text-slate-700 mb-2">{t("Machine Cleanliness")}</label>
                              <select name="qcMachineCleanliness" value={formData.qcMachineCleanliness} onChange={handleInputChange} disabled={qcActiveForm !== 'machine'} className="w-full h-14 px-4 border border-slate-300 rounded-xl outline-none bg-white font-bold text-base disabled:bg-slate-50 transition-colors">
                                  <option className="text-emerald-600" value="Pass">{t("Pass")}</option>
                                  <option className="text-red-600" value="Fail">{t("Fail")}</option>
                              </select>
                          </div>
                          <div className="min-w-0">
                              <label className="block text-sm font-bold text-slate-700 mb-2">{t("Safety Guards")}</label>
                              <select name="qcMachineSafety" value={formData.qcMachineSafety} onChange={handleInputChange} disabled={qcActiveForm !== 'machine'} className="w-full h-14 px-4 border border-slate-300 rounded-xl outline-none bg-white font-bold text-base disabled:bg-slate-50 transition-colors">
                                  <option className="text-emerald-600" value="Pass">{t("Pass")}</option>
                                  <option className="text-red-600" value="Fail">{t("Fail")}</option>
                              </select>
                          </div>
                      </div>
                      
                      <div className="pt-6 border-t border-slate-200 mt-auto">
                        <ImageUploadField preview={evidenceImagePreview} onFileChange={handleEvidenceImageChange} onClear={clearEvidenceImage} disabled={qcActiveForm !== 'machine'} t={t} />
                        <label className="block text-sm font-bold text-slate-700 mb-2">{t("Overall QC Remarks / Issues Noted")}</label>
                        <textarea name="qcNotes" value={formData.qcNotes} onChange={handleInputChange} disabled={qcActiveForm !== 'machine'} rows="3" className="w-full p-4 border border-slate-300 rounded-xl outline-none text-base disabled:bg-slate-50 transition-colors"></textarea>
                      </div>
                    </div>
                  </section>

                  {/* Container 2: Product QC */}
                  <section 
                    onClick={() => handleQcFormSwitch('product')}
                    className={`bg-white p-5 md:p-8 rounded-3xl border-2 transition-all duration-300 shadow-sm flex flex-col ${qcActiveForm === 'product' ? 'border-emerald-500 ring-4 ring-emerald-50' : 'border-slate-200 opacity-60 hover:opacity-100 cursor-pointer'}`}
                  >
                    <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                      <CheckCircle size={22} className={qcActiveForm === 'product' ? 'text-emerald-500' : 'text-slate-400'}/> 
                      {t("Quality Control Assessment")}
                    </h3>
                    
                    <div className="flex flex-col sm:flex-row bg-slate-100 rounded-xl p-1.5 mb-8 pointer-events-auto">
                      {['Extrusion', 'Cutting', 'Packing'].map(stage => (
                        <button key={stage} type="button" onClick={() => {setQcStage(stage); handleQcFormSwitch('product');}} className={`flex-1 py-3 px-3 text-base font-black rounded-lg transition-all ${qcStage === stage && qcActiveForm === 'product' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{t(stage)} QC</button>
                      ))}
                    </div>

                    <div className="space-y-5 pointer-events-auto flex-1 flex flex-col">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                        <div className="min-w-0 sm:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Job Order No.</label>
                            <input type="text" name="jobOrder" value={formData.jobOrder} onChange={handleInputChange} required={qcActiveForm === 'product'} disabled={qcActiveForm !== 'product'} className="w-full h-14 px-4 border border-slate-300 rounded-xl outline-none font-black text-base uppercase disabled:bg-slate-50 transition-colors" list="jo-suggestions" placeholder="e.g. 99-1" />
                        </div>
                        {qcStage !== 'Packing' && (
                          <div className="min-w-0 sm:col-span-2">
                              <label className="block text-sm font-bold text-slate-700 mb-2">{t("Machine No.")}</label>
                              <input type="text" name="machineId" value={formData.machineId} onChange={handleInputChange} disabled={qcActiveForm !== 'product'} required={qcActiveForm === 'product' && qcStage !== 'Packing'} className="w-full h-14 px-4 border border-slate-300 rounded-xl outline-none font-black text-base uppercase disabled:bg-slate-50 transition-colors" list="machine-suggestions" placeholder="e.g. B1 / C1" />
                          </div>
                        )}
                      </div>

                      {qcStage === 'Extrusion' && (<><QCField label={t("Thickness Check (Microns)")} name="qcExtThickness" statusName="qcExtThicknessStatus" formData={formData} onChange={handleInputChange} t={t} disabled={qcActiveForm !== 'product'} /><QCField label={t("Width Check (mm)")} name="qcExtWidth" statusName="qcExtWidthStatus" formData={formData} onChange={handleInputChange} t={t} disabled={qcActiveForm !== 'product'} /></>)}
                      {qcStage === 'Cutting' && (<><QCField label={t("Seal Integrity Assessment")} name="qcCutSeal" statusName="qcCutSealStatus" formData={formData} onChange={handleInputChange} t={t} disabled={qcActiveForm !== 'product'} /><QCField label={t("Length Check (mm)")} name="qcCutLength" statusName="qcCutLengthStatus" formData={formData} onChange={handleInputChange} t={t} disabled={qcActiveForm !== 'product'} /></>)}
                      {qcStage === 'Packing' && (<><QCField label={t("Packing Size (Bag Weight - kg)")} name="qcPackBagWeight" statusName="qcPackBagWeightStatus" formData={formData} onChange={handleInputChange} t={t} disabled={qcActiveForm !== 'product'} /><QCField label={t("Total Bags Verified")} name="qcPackTotalBags" statusName="qcPackTotalBagsStatus" formData={formData} onChange={handleInputChange} t={t} disabled={qcActiveForm !== 'product'} /></>)}
                      
                      <div className="pt-6 border-t border-slate-200 mt-auto">
                        <ImageUploadField preview={evidenceImagePreview} onFileChange={handleEvidenceImageChange} onClear={clearEvidenceImage} disabled={qcActiveForm !== 'product'} t={t} />
                        <label className="block text-sm font-bold text-slate-700 mb-2">{t("Overall QC Remarks / Issues Noted")}</label>
                        <textarea name="qcNotes" value={formData.qcNotes} onChange={handleInputChange} disabled={qcActiveForm !== 'product'} rows="3" className="w-full p-4 border border-slate-300 rounded-xl outline-none text-base disabled:bg-slate-50 transition-colors"></textarea>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {/* Downtime (Only for Manufacturing) */}
              {['Extrusion', 'Cutting'].includes(department) && (
                <section className="bg-white p-5 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"><Clock size={22} className="text-blue-500"/> {t("Machine Downtime")}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="grid grid-cols-2 gap-4 min-w-0">
                      <div className="min-w-0"><label className="block text-sm font-bold text-slate-700 mb-2">{t("Planned (mins)")}</label><input type="number" name="plannedDowntime" value={formData.plannedDowntime} onChange={handleInputChange} className="w-full h-14 px-4 border border-slate-300 rounded-xl outline-none font-bold text-base" /></div>
                      <div className="min-w-0"><label className="block text-sm font-bold text-slate-700 mb-2">{t("Unplanned (mins)")}</label><input type="number" name="unplannedDowntime" value={formData.unplannedDowntime} onChange={handleInputChange} className="w-full h-14 px-4 border border-slate-300 rounded-xl outline-none font-bold text-base" /></div>
                    </div>
                    <div className="md:col-span-2 min-w-0">
                      <label className="block text-sm font-bold text-slate-700 mb-2">{t("Primary Downtime Reason")}</label>
                      <input type="text" name="downtimeReason" value={formData.downtimeReason} onChange={handleInputChange} className="w-full h-14 px-4 border border-slate-300 rounded-xl outline-none font-semibold text-base" list="downtime-suggestions" />
                    </div>
                  </div>
                </section>
              )}
              
              {/* Discrepancy Box (if failed) */}
              {['Extrusion', 'Cutting'].includes(department) && massBalance.isFailed && (
                <div className="p-6 bg-red-50 border border-red-200 rounded-2xl animate-in slide-in-from-bottom-2">
                   <label className="block text-sm font-black text-red-800 mb-3 tracking-wide">{t("Reason for Discrepancy (Required for Override)")}</label>
                   <input type="text" name="discrepancyReason" value={formData.discrepancyReason} onChange={handleInputChange} placeholder="e.g. Scale calibration issue..." className="w-full h-14 px-4 border border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-none bg-white font-semibold text-base" />
                </div>
              )}

            </form>
          )}
        </div>

        {/* STICKY FOOTER ACTION BAR */}
        {department !== 'Dashboard' && department !== 'Inventory' && department !== 'Job Schedule' && (
          <div className={`fixed bottom-0 right-0 w-full md:w-[calc(100%-18rem)] bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 shadow-[0_-10px_30px_-5px_rgba(0,0,0,0.1)] z-40 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 px-4 md:px-8 transition-transform duration-300 ${!isFooterVisible || isSidebarOpen ? 'translate-y-full' : 'translate-y-0'}`}>
            <div className="flex flex-col text-center sm:text-left text-sm w-full sm:w-auto">
              <span className="font-black text-slate-800 tracking-tight text-base">
                {department === 'Quality Control' ? (qcActiveForm === 'machine' ? 'Machine Inspection' : 'Product QC Report') : `${t(department)} Report`}
              </span>
              <span className="text-slate-500 text-[11px] uppercase tracking-widest font-bold flex items-center justify-center sm:justify-start gap-1.5 mt-0.5"><CheckCircle size={14} className="text-emerald-500"/> {saveIndicator}</span>
            </div>
            
            <button 
              onClick={handleSave} disabled={isSubmitting}
              className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-black transition-all w-full sm:w-auto shadow-md active:scale-95 ${
                isSubmitting ? 'bg-slate-400 cursor-not-allowed text-white' : 
                (massBalance.isFailed && !formData.discrepancyReason && ['Extrusion', 'Cutting'].includes(department)) ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30 ring-4 ring-red-100' : 
                'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30 hover:-translate-y-0.5'
              }`}
            >
              <Save size={20} /> 
              {isSubmitting ? t('Saving...') : 
               (massBalance.isFailed && !formData.discrepancyReason && ['Extrusion', 'Cutting'].includes(department)) ? t('Discrepancy Must Be Resolved') : 
               (department === 'Quality Control' ? `Submit ${qcActiveForm === 'machine' ? 'Machine Inspection' : 'Product QC'}` : t('Submit Log'))}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;