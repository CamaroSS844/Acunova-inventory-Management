import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  X, 
  Printer, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  Mail, 
  Calendar,
  Sparkles,
  Phone
} from "lucide-react";
import { Quotation, Receipt } from "../types";
import { settingsService } from "../services/api";

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    type: "quotation" | "receipt";
    data: Quotation | Receipt;
    aiCoverNote?: string | null;
  } | null;
  onDownload?: () => void;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  isOpen,
  onClose,
  document,
  onDownload
}) => {
  const [zoom, setZoom] = useState<number>(100);

  const { data: settings } = useQuery({
    queryKey: ["company-settings"],
    queryFn: settingsService.get
  });

  if (!isOpen || !document) return null;

  const companyName = settings?.companyName || "VoltSync Systems";
  const companySubtitle = settings?.companySubtitle || "Electronics Ltd";
  const tagline = settings?.tagline || "Authorized Corporate Distribution";
  const logoUrl = settings?.logoUrl;
  const logoInitials = settings?.logoInitials || "VS";
  const address = settings?.address || "900 Technology Way, Suite 101, Palo Alto, CA 94301";
  const email = settings?.email || "billing@voltsync-electronics.com";
  const phone = settings?.phone || "+1-800-555-8800";
  const vatNumber = settings?.vatNumber || "US-9938201-VS";
  const registrationNumber = settings?.registrationNumber || "VOLT-2026-CA";
  const headerColor = settings?.pdfHeaderColor || "#2563eb";
  const footerTerms = settings?.footerTerms || "Computer generated PDF document. All hardware items include standard 1-year VoltSync enterprise warranty.";

  const isQuotation = document.type === "quotation";
  const quoteData = isQuotation ? (document.data as Quotation) : null;
  const receiptData = !isQuotation ? (document.data as Receipt) : null;

  const docNumber = isQuotation ? quoteData?.quotationNumber : receiptData?.receiptNumber;
  const customerName = isQuotation ? quoteData?.customerName : receiptData?.customerName;
  const customerEmail = isQuotation ? quoteData?.customerEmail : "customer@client.com";
  const date = document.data.date;
  const lines = document.data.lines || [];
  const subtotal = document.data.subtotal || 0;
  const taxAmount = document.data.taxAmount || 0;
  const discountAmount = document.data.discountAmount || 0;
  const total = document.data.total || 0;

  const fileName = `VoltSync_${isQuotation ? "Quotation" : "Receipt"}_${docNumber}.pdf`;

  const handlePrint = () => {
    window.print();
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 15, 150));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 15, 70));

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/80 backdrop-blur-md transition-all duration-200 print:bg-white print:p-0 print:static print:inset-auto print:block">
      
      {/* 1. PDF VIEWER HEADER / TOOLBAR (Hidden during print) */}
      <div className="flex-none bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-lg text-white print:hidden">
        
        {/* Document Info Title */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl">
            <FileText size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm tracking-tight text-white font-mono">{fileName}</h3>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                isQuotation 
                  ? "bg-purple-500/10 text-purple-300 border-purple-500/30" 
                  : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
              }`}>
                {isQuotation ? "PDF Quote Preview" : "PDF Receipt Preview"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Ready for high-resolution vector printing & client dispatch
            </p>
          </div>
        </div>

        {/* Zoom & Page Navigation Controls */}
        <div className="hidden md:flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs text-slate-300">
          <button 
            onClick={handleZoomOut} 
            disabled={zoom <= 70}
            className="p-1 hover:bg-slate-700 rounded transition-colors disabled:opacity-40"
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>
          <span className="font-mono font-bold w-12 text-center text-blue-400">{zoom}%</span>
          <button 
            onClick={handleZoomIn} 
            disabled={zoom >= 150}
            className="p-1 hover:bg-slate-700 rounded transition-colors disabled:opacity-40"
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>
          <div className="h-3 w-px bg-slate-700 mx-1" />
          <span className="text-[11px] font-mono text-slate-400">Page 1 of 1</span>
        </div>

        {/* Action Controls (Download, Trigger Print Command, Close) */}
        <div className="flex items-center gap-2">
          {onDownload && (
            <button
              onClick={onDownload}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Download PDF</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            id="btn-trigger-pdf-print"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-blue-900/40"
          >
            <Printer size={15} />
            <span>Print Document</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors ml-1"
            title="Close Preview"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* 2. PDF VIEWER CANVAS VIEWPORT */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start custom-scrollbar print:p-0 print:overflow-visible">
        
        {/* Printable PDF Document Sheet (A4 Paper Aspect & Style) */}
        <div 
          id="pdf-document-printable-area"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
          className="bg-white text-slate-900 rounded-none sm:rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-[800px] p-8 sm:p-12 space-y-8 transition-transform duration-150 relative overflow-hidden print:shadow-none print:border-none print:max-w-none print:w-full print:p-0 print:m-0 print:rounded-none"
        >
          {/* Decorative Watermark Stamp for Verification */}
          <div className="absolute right-8 top-12 opacity-[0.04] pointer-events-none select-none font-black text-7xl font-mono uppercase tracking-tighter text-slate-900">
            {isQuotation ? "QUOTATION" : "PAID RECEIPT"}
          </div>

          {/* Letterhead Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b-2 border-slate-900">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Company Logo"
                    className="max-h-12 max-w-[180px] object-contain rounded-lg border border-slate-200 p-1"
                  />
                ) : (
                  <span
                    style={{ backgroundColor: headerColor }}
                    className="p-2.5 rounded-xl text-white font-black text-base leading-none shadow-sm font-mono shrink-0"
                  >
                    {logoInitials}
                  </span>
                )}
                <div>
                  <h1 className="font-extrabold text-2xl text-slate-950 tracking-tight leading-none">
                    {companyName} {companySubtitle && <span className="font-light text-slate-500 text-xs font-sans">{companySubtitle}</span>}
                  </h1>
                  {tagline && (
                    <span 
                      style={{ color: headerColor }}
                      className="text-[10px] font-mono tracking-widest uppercase font-bold block mt-1"
                    >
                      {tagline}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-xs text-slate-500 space-y-0.5 font-sans leading-relaxed">
                {address && <p className="flex items-center gap-1.5"><Building2 size={12} className="text-slate-400 shrink-0" /> {address}</p>}
                {(email || phone) && (
                  <p className="flex items-center gap-1.5 flex-wrap">
                    {email && <span className="flex items-center gap-1"><Mail size={12} className="text-slate-400" /> {email}</span>}
                    {email && phone && <span className="text-slate-300">|</span>}
                    {phone && <span className="flex items-center gap-1"><Phone size={12} className="text-slate-400" /> {phone}</span>}
                  </p>
                )}
                {(vatNumber || registrationNumber) && (
                  <p className="font-mono text-[11px] text-slate-400 pt-0.5">
                    {vatNumber && <span>VAT Reg No: {vatNumber}</span>}
                    {vatNumber && registrationNumber && <span> | </span>}
                    {registrationNumber && <span>Registration: {registrationNumber}</span>}
                  </p>
                )}
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1 self-stretch sm:self-auto bg-slate-50 sm:bg-transparent p-4 sm:p-0 rounded-xl border border-slate-100 sm:border-0">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400 block">
                {isQuotation ? "OFFICIAL SALES QUOTATION" : "OFFICIAL CASH RECEIPT"}
              </span>
              <h2 className="text-2xl font-black font-mono text-slate-950">{docNumber}</h2>
              <div className="text-xs text-slate-500 font-mono space-y-1 pt-1">
                <p className="flex items-center sm:justify-end gap-1.5"><Calendar size={12} /> Issued Date: <strong className="text-slate-800">{date}</strong></p>
                {isQuotation && quoteData?.expiryDate && (
                  <p className="text-rose-600 font-semibold">Valid Until: {quoteData.expiryDate}</p>
                )}
                {!isQuotation && (
                  <p className="text-emerald-600 font-semibold flex items-center sm:justify-end gap-1">
                    <CheckCircle2 size={12} /> Payment Status: SETTLED IN FULL
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Customer & Document Context Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-200/80">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase block">Billed / Issued To:</span>
              <p className="font-extrabold text-base text-slate-900">{customerName}</p>
              <p className="text-xs text-slate-500 font-mono">{customerEmail}</p>
            </div>
            <div className="space-y-1 sm:text-right">
              <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase block">Corporate Terms:</span>
              <p className="text-xs font-semibold text-slate-800">Account: VoltSync Silicon Valley Logistics</p>
              <p className="text-xs text-slate-500 font-mono">
                {isQuotation ? "Standard 30-Day Rate Guarantee" : "Immediate Receipt Authorization #PAID-2026"}
              </p>
            </div>
          </div>

          {/* AI Pitch/Cover Note (If available for Quotations) */}
          {document.aiCoverNote && (
            <div className="bg-purple-50/60 border border-purple-200/80 p-4 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-purple-900 font-bold text-xs">
                <Sparkles size={14} className="text-purple-600" />
                <span>VoltSync Executive Summary Note</span>
              </div>
              <p className="text-xs text-purple-950 leading-relaxed italic font-serif">
                "{document.aiCoverNote}"
              </p>
            </div>
          )}

          {/* Itemized Line Items Table */}
          <div className="space-y-3">
            <span className="text-[11px] font-mono font-bold text-slate-400 tracking-wider uppercase block">
              Itemized Line Items
            </span>
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-700 font-bold uppercase font-mono tracking-wider border-b border-slate-200">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Item Description</th>
                    <th className="py-3 px-4 text-center">Qty</th>
                    <th className="py-3 px-4 text-right">Unit Price</th>
                    <th className="py-3 px-4 text-right">Total Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-slate-800">
                  {lines.map((line, index) => (
                    <tr key={index} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 text-slate-400 text-[11px] font-mono">{index + 1}</td>
                      <td className="py-3 px-4 font-sans font-semibold text-slate-900">{line.productName}</td>
                      <td className="py-3 px-4 text-center font-bold text-slate-800">{line.quantity}</td>
                      <td className="py-3 px-4 text-right">${line.unitPrice.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-950">${line.totalPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Breakdown Totals Box */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-slate-200">
            <div className="text-xs text-slate-500 max-w-xs space-y-2">
              <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs">
                <ShieldCheck size={14} className="text-blue-600" />
                <span>Verification & Security</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                This PDF document carries official corporate authorization. All hardware items include standard 1-year VoltSync enterprise warranty.
              </p>
            </div>

            <div className="w-full sm:w-64 bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 font-mono text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Corporate Discount:</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax (15%):</span>
                <span className="font-semibold">${taxAmount.toFixed(2)}</span>
              </div>

              <div className="pt-2 border-t border-slate-300 flex justify-between items-baseline text-slate-950">
                <span className="font-extrabold text-sm uppercase">Total Due:</span>
                <span className="font-black text-lg text-blue-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Signatures & Footer Note */}
          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs text-slate-400">
            <div className="space-y-1 max-w-md">
              <p className="font-semibold text-slate-700">{companyName} - Official Document</p>
              <p className="text-[10px] leading-relaxed">{footerTerms}</p>
            </div>

            <div className="text-center sm:text-right space-y-1 shrink-0">
              <div className="h-8 border-b border-slate-300 w-48 mb-1" />
              <p className="font-bold text-slate-800 text-[11px]">Authorized Signature / Stamp</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
