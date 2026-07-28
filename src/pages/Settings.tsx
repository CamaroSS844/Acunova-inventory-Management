import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../components/Layout";
import { settingsService } from "../services/api";
import { CompanySettings } from "../types";
import { 
  Percent, 
  CloudLightning, 
  Building, 
  FileText,
  Upload,
  Image as ImageIcon,
  Trash2,
  Check,
  Eye,
  Building2,
  Mail,
  Phone,
  FileCheck,
  Loader2,
  Palette,
  Sparkles
} from "lucide-react";

const PRESET_COLORS = [
  { name: "Volt Blue", value: "#2563eb" },
  { name: "Emerald Green", value: "#059669" },
  { name: "Royal Purple", value: "#7c3aed" },
  { name: "Slate Dark", value: "#0f172a" },
  { name: "Ruby Red", value: "#dc2626" },
  { name: "Amber Gold", value: "#d97706" },
];

export const Settings: React.FC = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { data: serverSettings, isLoading } = useQuery({
    queryKey: ["company-settings"],
    queryFn: settingsService.get,
  });

  const [formState, setFormState] = useState<CompanySettings>({
    companyName: "VoltSync Systems",
    companySubtitle: "Electronics Ltd",
    tagline: "Authorized Corporate Distribution",
    logoUrl: "",
    logoInitials: "VS",
    address: "900 Technology Way, Suite 101, Palo Alto, CA 94301",
    email: "billing@voltsync-electronics.com",
    phone: "+1-800-555-8800",
    vatNumber: "US-9938201-VS",
    registrationNumber: "VOLT-2026-CA",
    pdfHeaderColor: "#2563eb",
    footerTerms: "Computer generated PDF document. All hardware items include standard 1-year VoltSync enterprise warranty."
  });

  useEffect(() => {
    if (serverSettings) {
      setFormState({
        companyName: serverSettings.companyName || "VoltSync Systems",
        companySubtitle: serverSettings.companySubtitle || "Electronics Ltd",
        tagline: serverSettings.tagline || "Authorized Corporate Distribution",
        logoUrl: serverSettings.logoUrl || "",
        logoInitials: serverSettings.logoInitials || "VS",
        address: serverSettings.address || "900 Technology Way, Suite 101, Palo Alto, CA 94301",
        email: serverSettings.email || "billing@voltsync-electronics.com",
        phone: serverSettings.phone || "+1-800-555-8800",
        vatNumber: serverSettings.vatNumber || "US-9938201-VS",
        registrationNumber: serverSettings.registrationNumber || "VOLT-2026-CA",
        pdfHeaderColor: serverSettings.pdfHeaderColor || "#2563eb",
        footerTerms: serverSettings.footerTerms || "Computer generated PDF document. All hardware items include standard 1-year VoltSync enterprise warranty."
      });
    }
  }, [serverSettings]);

  const updateMutation = useMutation({
    mutationFn: (data: CompanySettings) => settingsService.update(data),
    onSuccess: (updated) => {
      queryClient.setQueryData(["company-settings"], updated);
      queryClient.invalidateQueries({ queryKey: ["company-settings"] });
      showToast("PDF document branding & header settings saved successfully!", "success");
    },
    onError: (err: any) => {
      showToast(err.response?.data?.error || "Failed to update system settings", "error");
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("Logo file size must be smaller than 2MB", "error");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormState((prev) => ({ ...prev, logoUrl: reader.result as string }));
      showToast("Custom logo uploaded to header preview!", "success");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setFormState((prev) => ({ ...prev, logoUrl: "" }));
    showToast("Custom logo removed. Reverted to logo initials.", "info");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formState);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500 font-mono text-xs">
        <Loader2 size={28} className="animate-spin text-blue-600" />
        <span>Loading system branding configuration...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Settings & PDF Branding</h1>
        <p className="text-sm text-slate-500 mt-1">
          Customize company logo, official contact information, tax IDs, and header styling rendered on PDF quotations and cash receipts.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* PDF Branding & Header Customization Configuration Panel */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          
          <div className="bg-slate-900 text-white p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl">
                <FileText size={20} />
              </div>
              <div>
                <h2 className="font-extrabold text-base tracking-tight text-white">PDF Quotation & Receipt Branding Panel</h2>
                <p className="text-xs text-slate-400">
                  Manage letterhead company logo, official title, address, tax registration, and footer disclaimer.
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-widest px-3 py-1 bg-slate-800 border border-slate-700 text-blue-400 rounded-full font-bold">
              PDF Header Config v2.4
            </span>
          </div>

          <div className="p-6 space-y-8">

            {/* Logo & Visual Identity */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <ImageIcon size={16} className="text-blue-600" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">1. Company Logo & Header Accent Theme</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Logo Upload Box */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">Company Logo Image</label>
                  
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4">
                    {formState.logoUrl ? (
                      <div className="relative group shrink-0">
                        <img
                          src={formState.logoUrl}
                          alt="Logo Preview"
                          className="w-16 h-16 object-contain bg-white rounded-xl border border-slate-200 p-1 shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="absolute -top-2 -right-2 bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-full shadow-md transition-transform group-hover:scale-110 cursor-pointer"
                          title="Remove logo"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ) : (
                      <div 
                        style={{ backgroundColor: formState.pdfHeaderColor }} 
                        className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-black text-xl font-mono shadow-xs shrink-0"
                      >
                        {formState.logoInitials || "VS"}
                      </div>
                    )}

                    <div className="space-y-1.5 flex-1">
                      <p className="text-xs font-bold text-slate-800">
                        {formState.logoUrl ? "Custom Logo Active" : "Default Initial Badge Active"}
                      </p>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        PNG, JPG, or SVG format (Max 2MB).
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        <label className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-1.5 transition-colors shadow-2xs">
                          <Upload size={13} />
                          <span>{formState.logoUrl ? "Change Logo" : "Upload Logo"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                        </label>

                        {formState.logoUrl && (
                          <button
                            type="button"
                            onClick={handleRemoveLogo}
                            className="px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logo Fallback Initials & Accent Color */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Logo Initials Badge (Fallback)</label>
                    <input
                      type="text"
                      name="logoInitials"
                      value={formState.logoInitials}
                      onChange={handleInputChange}
                      maxLength={4}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold uppercase focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      placeholder="VS"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Palette size={13} className="text-blue-600" />
                      <span>PDF Header Accent Color</span>
                    </label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {PRESET_COLORS.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => setFormState((prev) => ({ ...prev, pdfHeaderColor: c.value }))}
                          style={{ backgroundColor: c.value }}
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-white transition-transform cursor-pointer ${
                            formState.pdfHeaderColor === c.value ? "ring-2 ring-offset-2 ring-slate-900 scale-110 shadow-md" : "hover:scale-105"
                          }`}
                          title={c.name}
                        >
                          {formState.pdfHeaderColor === c.value && <Check size={14} />}
                        </button>
                      ))}
                      <div className="flex items-center gap-1.5 ml-1">
                        <span className="text-[11px] font-mono text-slate-400">Hex:</span>
                        <input
                          type="text"
                          name="pdfHeaderColor"
                          value={formState.pdfHeaderColor}
                          onChange={handleInputChange}
                          className="w-20 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Corporate Name & Tagline */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Building size={16} className="text-blue-600" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">2. Company Legal Title & Tagline</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formState.companyName}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="e.g. VoltSync Systems"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle / Entity Designation</label>
                  <input
                    type="text"
                    name="companySubtitle"
                    value={formState.companySubtitle}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="e.g. Electronics Ltd"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Header Subtitle / Tagline</label>
                  <input
                    type="text"
                    name="tagline"
                    value={formState.tagline}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="e.g. Authorized Corporate Distribution"
                  />
                </div>
              </div>
            </div>

            {/* Address, Phone, Email & Tax Registration */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <FileCheck size={16} className="text-blue-600" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">3. Contact Details & Tax Registration Info</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Official Corporate Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formState.address}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="900 Technology Way, Suite 101, Palo Alto, CA 94301"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Billing / Support Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="billing@voltsync-electronics.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Telephone / Hotline</label>
                  <input
                    type="text"
                    name="phone"
                    value={formState.phone}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="+1-800-555-8800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">VAT / Tax Registration Number</label>
                  <input
                    type="text"
                    name="vatNumber"
                    value={formState.vatNumber}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="US-9938201-VS"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Commercial Registration Code</label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formState.registrationNumber}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="VOLT-2026-CA"
                  />
                </div>
              </div>
            </div>

            {/* PDF Footer Legal Note / Guarantee Terms */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Sparkles size={16} className="text-blue-600" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">4. PDF Footer Terms & Warranty Notice</h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Footer Legal Disclaimer & Terms</label>
                <textarea
                  name="footerTerms"
                  rows={2}
                  value={formState.footerTerms}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="Computer generated PDF document. All hardware items include standard 1-year VoltSync enterprise warranty."
                />
              </div>
            </div>

            {/* LIVE REAL-TIME PDF LETTERHEAD PREVIEW CARD */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs uppercase tracking-wider">
                  <Eye size={16} className="text-blue-600" />
                  <span>Real-Time PDF Header Live Preview</span>
                </div>
                <span className="text-[11px] font-mono font-bold text-slate-400">Sample PDF Render</span>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b-2 border-slate-900">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      {formState.logoUrl ? (
                        <img
                          src={formState.logoUrl}
                          alt="Company Logo Preview"
                          className="max-h-10 max-w-[150px] object-contain rounded-lg border border-slate-200 p-1"
                        />
                      ) : (
                        <span
                          style={{ backgroundColor: formState.pdfHeaderColor || "#2563eb" }}
                          className="p-2 rounded-xl text-white font-black text-sm leading-none shadow-xs font-mono"
                        >
                          {formState.logoInitials || "VS"}
                        </span>
                      )}
                      <div>
                        <h4 className="font-black text-xl text-slate-950 tracking-tight leading-none">
                          {formState.companyName || "Company Name"} {formState.companySubtitle && <span className="font-light text-slate-500 text-xs">{formState.companySubtitle}</span>}
                        </h4>
                        {formState.tagline && (
                          <span 
                            style={{ color: formState.pdfHeaderColor || "#2563eb" }}
                            className="text-[10px] font-mono tracking-widest uppercase font-bold block mt-0.5"
                          >
                            {formState.tagline}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 space-y-0.5 font-sans">
                      {formState.address && <p className="flex items-center gap-1"><Building2 size={11} className="text-slate-400" /> {formState.address}</p>}
                      {(formState.email || formState.phone) && (
                        <p className="flex items-center gap-1.5 flex-wrap">
                          {formState.email && <span className="flex items-center gap-1"><Mail size={11} className="text-slate-400" /> {formState.email}</span>}
                          {formState.email && formState.phone && <span className="text-slate-300">|</span>}
                          {formState.phone && <span className="flex items-center gap-1"><Phone size={11} className="text-slate-400" /> {formState.phone}</span>}
                        </p>
                      )}
                      {(formState.vatNumber || formState.registrationNumber) && (
                        <p className="font-mono text-[10px] text-slate-400">
                          {formState.vatNumber && <span>VAT: {formState.vatNumber}</span>}
                          {formState.vatNumber && formState.registrationNumber && <span> | </span>}
                          {formState.registrationNumber && <span>Reg: {formState.registrationNumber}</span>}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right font-mono space-y-1">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">OFFICIAL QUOTATION</span>
                    <span className="text-lg font-black text-slate-900">QT-2026-001</span>
                    <span className="text-[10px] text-slate-400 block">Issued: 2026-07-27</span>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-slate-400 flex justify-between items-center font-mono">
                  <span>Footer Disclaimer Preview: "{formState.footerTerms}"</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <Check size={12} /> Live Synced
                  </span>
                </div>
              </div>
            </div>

          </div>

          <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex justify-end gap-3">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              id="btn-save-company-settings"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs uppercase tracking-widest font-black rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {updateMutation.isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Check size={16} />
              )}
              <span>Save PDF Branding & Settings</span>
            </button>
          </div>

        </div>

        {/* Existing Core Tax & System Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-3xs">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900">
              <Percent size={18} className="text-blue-500" />
              <h3 className="font-extrabold text-xs uppercase tracking-wider">Tax & Margin Default Configurations</h3>
            </div>
            <div className="space-y-3 text-xs font-medium">
              <div>
                <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Standard VAT Tax Rate (%)</label>
                <input
                  type="text"
                  disabled
                  value="15.0 %"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-500 rounded-xl p-2.5 font-mono cursor-not-allowed font-bold"
                />
                <span className="text-[10px] text-slate-400 block mt-1">Authoritative tax locked for current California state Node.</span>
              </div>
              <div>
                <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Quotation Valid Days Limit</label>
                <select
                  defaultValue="30"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800"
                >
                  <option value="15">15 Business Days</option>
                  <option value="30">30 Calendar Days (Default)</option>
                  <option value="60">60 Calendar Days (Bulk Account)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-blue-400">
              <CloudLightning size={16} />
              <span className="font-bold text-xs uppercase tracking-widest text-slate-350">Service API Logs & Tunnel status</span>
            </div>

            <div className="space-y-3 text-xs font-medium font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block mb-0.5">ENVIRONMENT NODE</span>
                <p className="text-slate-100">CLOUD-DOCKER_RUN</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block mb-0.5">FAST_API TUNNEL</span>
                <p className="text-emerald-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>ONLINE_200_OK</span>
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block mb-0.5">ACTIVE CACHE SCHEMA</span>
                <p className="text-blue-400">Local JSON DB Store</p>
              </div>
            </div>
          </div>
        </div>

      </form>

    </div>
  );
};
