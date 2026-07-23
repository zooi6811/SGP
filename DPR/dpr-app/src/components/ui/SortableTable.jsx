import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, Flag } from 'lucide-react';

const SortableTable = ({ title, columns, data, onFlag, onRowClick, rowsPerPage = 5, showCompletedToggle = false, showCompleted = false, setShowCompleted = null }) => {
  const [filter, setFilter] = useState('');
  const [sortCol, setSortCol] = useState(0); 
  const [sortDesc, setSortDesc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter(row => {
      if (!row) return false;
      const cells = Array.isArray(row) ? row : Object.values(row);
      const matchesSearch = cells.some(cell => cell != null && String(cell).toLowerCase().includes((filter || '').toLowerCase()));
      
      if (!matchesSearch) return false;
      
      // If it's a completed job, we hide it UNLESS the user checked 'showCompleted' OR is actively searching for it
      if (showCompletedToggle && row.isCompleted && !showCompleted && !filter) {
        return false;
      }
      
      return true;
    });
  }, [data, filter, showCompletedToggle, showCompleted]);

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

  // Safely clamp the page if data shrinks beneath the current page index
  const totalPages = rowsPerPage > 0 ? Math.ceil(sortedData.length / rowsPerPage) || 1 : 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedData = rowsPerPage > 0 ? sortedData.slice((safeCurrentPage - 1) * rowsPerPage, safeCurrentPage * rowsPerPage) : sortedData;

  // Only reset to 1 if the user actively filters or sorts
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, sortCol, sortDesc, data]);

  // Keep actual state in sync if we clamped it visually due to data deletion/refresh
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handleSort = (index) => {
    if (sortCol === index) setSortDesc(!sortDesc);
    else { setSortCol(index); setSortDesc(true); }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <h3 className="font-bold text-slate-800 text-base">{title}</h3>
          {showCompletedToggle && setShowCompleted && (
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors">
              <input 
                type="checkbox" 
                checked={showCompleted} 
                onChange={e => setShowCompleted(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
              />
              Show Completed Jobs
            </label>
          )}
        </div>
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
              <tr key={i} onClick={() => onRowClick && onRowClick(row)} className={`border-b border-slate-100 last:border-0 hover:bg-blue-50/30 transition-colors text-sm ${onRowClick ? 'cursor-pointer' : ''} ${row.isCompleted ? 'opacity-50 bg-slate-50 grayscale-[50%]' : ''}`}>
                {columns.map((col, j) => (
                  <td key={j} className="px-5 py-3.5 text-slate-700">
                    {col.render ? col.render(row[col.dataIndex], row) : row[col.dataIndex]}
                  </td>
                ))}
                {onFlag && (
                  <td className="px-5 py-3.5 text-center">
                    <button type="button" onClick={(e) => { e.stopPropagation(); onFlag(row); }} className="text-slate-400 hover:text-amber-600 transition-colors bg-white border border-slate-200 p-2 rounded-lg shadow-sm active:scale-95" title="Flag Error">
                      <Flag size={16}/>
                    </button>
                  </td>
                )}
              </tr>
            )) : <tr><td colSpan={columns.length + (onFlag ? 1 : 0)} className="text-center py-8 text-slate-400 italic">No records found.</td></tr>}
          </tbody>
        </table>
      </div>

      {rowsPerPage > 0 && (
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between">
          <span className="text-sm text-slate-500 font-medium hidden sm:block">Page {safeCurrentPage} of {totalPages}</span>
          <span className="text-sm text-slate-500 font-medium sm:hidden">{safeCurrentPage} / {totalPages}</span>
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
              disabled={safeCurrentPage <= 1}
              className="px-4 py-2 text-sm font-bold bg-white border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:scale-95"
            >
              Prev
            </button>
            <button 
              type="button"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
              disabled={safeCurrentPage >= totalPages}
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

export default SortableTable;