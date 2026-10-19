'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Table, Download, AlertCircle, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

type ExcelPreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  fileData: string; // base64 or dataURL
  fileName: string;
  onDownload?: () => void;
};

export const ExcelPreviewModal: React.FC<ExcelPreviewModalProps> = ({
  isOpen,
  onClose,
  fileData,
  fileName,
  onDownload,
}) => {
  const [sheets, setSheets] = useState<{ [name: string]: any[][] }>({});
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [activeSheet, setActiveSheet] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !fileData) return;

    setIsLoading(true);
    setError(null);
    setSheets({});
    setSheetNames([]);
    setActiveSheet('');

    try {
      // Decode base64
      let base64String = fileData;
      if (fileData.includes(',')) {
        base64String = fileData.split(',')[1];
      }

      const binaryString = atob(base64String);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Read Excel with XLSX
      const workbook = XLSX.read(bytes, { type: 'array' });
      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error('File Excel tidak memiliki lembar kerja (sheet).');
      }

      const parsedSheets: { [name: string]: any[][] } = {};
      workbook.SheetNames.forEach((name) => {
        const worksheet = workbook.Sheets[name];
        // Convert sheet to 2D array of rows
        const jsonData = XLSX.utils.sheet_to_json<any[]>(worksheet, {
          header: 1,
          defval: '',
          blankrows: false,
        });
        parsedSheets[name] = jsonData;
      });

      setSheets(parsedSheets);
      setSheetNames(workbook.SheetNames);
      setActiveSheet(workbook.SheetNames[0]);
    } catch (err: any) {
      console.error('Gagal membaca file Excel:', err);
      setError(
        'Format file Excel tidak dapat dibaca atau rusak. Anda masih bisa mengunduh file ini secara langsung.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [isOpen, fileData]);

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
      return;
    }
    try {
      const link = document.createElement('a');
      link.href = fileData;
      link.download = fileName || 'Dokumen.xlsx';
      link.click();
    } catch (e) {
      console.error('Gagal download file:', e);
    }
  };

  if (!isOpen) return null;

  const currentRows = (activeSheet && sheets[activeSheet]) || [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-9999 flex items-center justify-center p-3 md:p-6 bg-slate-900/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-5xl h-[88vh] max-h-[850px] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-100"
        >
          {/* Header */}
          <div className="p-4 md:px-6 md:py-4 bg-linear-to-r from-[#183449] to-[#2B5474] text-white flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-emerald-400 shrink-0 border border-white/20">
                <FileSpreadsheet size={22} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Excel Preview
                  </span>
                  {currentRows.length > 0 && (
                    <span className="text-[10px] text-white/70 font-semibold hidden sm:inline">
                      {currentRows.length} Baris
                    </span>
                  )}
                </div>
                <h3 className="text-sm md:text-base font-bold text-white truncate max-w-md mt-0.5">
                  {fileName}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleDownload}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-white/20 active:scale-95"
                title="Download file ini"
              >
                <Download size={15} />
                <span className="hidden sm:inline">Unduh</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-rose-500 hover:text-white text-white/80 transition-all flex items-center justify-center active:scale-95"
                title="Tutup"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Sheet Tabs Header (if multiple sheets exist) */}
          {sheetNames.length > 1 && (
            <div className="flex items-center gap-1.5 px-4 md:px-6 py-2 bg-slate-100/80 border-b border-slate-200 overflow-x-auto scrollbar-hide shrink-0">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mr-1">
                Sheet:
              </span>
              {sheetNames.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setActiveSheet(name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    activeSheet === name
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          )}

          {/* Body Content */}
          <div className="flex-1 overflow-auto bg-slate-50/50 p-2 md:p-4">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-400">
                <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                  Memuat Lembar Kerja Excel...
                </p>
              </div>
            ) : error ? (
              <div className="h-full flex flex-col items-center justify-center gap-3 max-w-md mx-auto text-center p-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                  <AlertCircle size={28} />
                </div>
                <h4 className="text-base font-bold text-slate-800">
                  Tidak Dapat Menampilkan Preview
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">{error}</p>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="mt-2 px-5 py-2.5 bg-[#183449] hover:bg-[#588CBC] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
                >
                  <Download size={14} /> Unduh File Sekarang
                </button>
              </div>
            ) : currentRows.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                <Table size={32} className="text-slate-300" />
                <p className="text-xs font-bold">Sheet ini kosong</p>
              </div>
            ) : (
              <div className="inline-block min-w-full align-middle bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto max-h-[calc(88vh-160px)]">
                  <table className="min-w-full divide-y divide-slate-200 text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100/90 sticky top-0 z-10 backdrop-blur-xs">
                        <th className="px-3 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-12 border-r border-slate-200 bg-slate-100">
                          #
                        </th>
                        {currentRows[0]?.map((_: any, colIdx: number) => (
                          <th
                            key={colIdx}
                            className="px-4 py-2.5 text-[11px] font-black text-slate-600 uppercase tracking-wider border-r border-slate-200 whitespace-nowrap bg-slate-100"
                          >
                            {/* Column Letter / Header */}
                            {String.fromCharCode(65 + (colIdx % 26)) +
                              (colIdx >= 26 ? Math.floor(colIdx / 26) : '')}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {currentRows.map((row: any[], rowIdx: number) => {
                        const isHeader = rowIdx === 0;
                        return (
                          <tr
                            key={rowIdx}
                            className={`transition-colors hover:bg-emerald-50/40 ${
                              isHeader ? 'bg-slate-50 font-bold text-slate-900' : ''
                            }`}
                          >
                            <td className="px-3 py-2 text-[10px] font-bold text-slate-400 text-center border-r border-slate-100 bg-slate-50/50 select-none">
                              {rowIdx + 1}
                            </td>
                            {currentRows[0]?.map((_: any, colIdx: number) => {
                              const cellValue = row[colIdx];
                              const displayVal =
                                cellValue !== undefined && cellValue !== null
                                  ? String(cellValue)
                                  : '';
                              return (
                                <td
                                  key={colIdx}
                                  className="px-4 py-2 border-r border-slate-100 whitespace-pre truncate max-w-xs"
                                  title={displayVal}
                                >
                                  {displayVal}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="px-6 py-2.5 bg-white border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium shrink-0">
            <span>
              {fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv')
                ? 'Microsoft Excel / Spreadsheet Document'
                : 'Dokumen Lampiran'}
            </span>
            <span>Maksimal 5 file lampiran didukung</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ExcelPreviewModal;
