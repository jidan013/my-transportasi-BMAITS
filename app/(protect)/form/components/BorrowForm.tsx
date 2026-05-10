"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { isAxiosError } from "axios";

import type { BookingPayload } from "@/types/booking";
import type { Vehicle } from "@/types/vehicle";
import { submitBooking, getAvailableVehicles } from "@/lib/services/booking-service";

/* ─────────────────────────────────────────────────────────────
   SECURITY CONSTANTS
───────────────────────────────────────────────────────────── */

/** Max submit attempts per session window */
const RATE_LIMIT_MAX = 3;
/** Window duration in ms (15 minutes) */
const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
/** Minimum ms between two submits (prevents double-click spam) */
const MIN_SUBMIT_INTERVAL = 3000;
/** Max field lengths */
const MAX_NAMA = 100;
const MAX_KEPERLUAN = 500;
/** NRP/NIP: 8–18 digits only */
const NRP_REGEX = /^\d{8,18}$/;
/** Allowed characters for nama — letters, spaces, dots, commas, apostrophes */
const NAMA_REGEX = /^[a-zA-Z\s.,'\-]+$/;
/** Honeypot field name — looks like a real field to bots */
const HONEYPOT_FIELD = "website";

/* ─────────────────────────────────────────────────────────────
   UNIT KERJA DATA
───────────────────────────────────────────────────────────── */

const UNIT_KERJA_ITS = {
  direktorat: [
    "Direktorat Pendidikan Sarjana dan Pascasarjana",
    "Direktorat Kemahasiswaan",
    "Direktorat Pengembangan Akademik dan Inovasi Pembelajaran",
    "Direktorat Perencanaan dan Pengembangan Strategis",
    "Direktorat Sumber Daya Manusia dan Organisasi",
    "Direktorat Teknologi dan Pengembangan Sistem Informasi",
    "Direktorat Riset dan Pengabdian kepada Masyarakat",
    "Direktorat Inovasi dan Science Techno Park",
    "Direktorat Kerja Sama dan Pengelolaan Usaha",
    "Direktorat Kemitraan Global",
    "Biro Manajemen Aset",
    "Biro Keuangan",
  ],
  fakultas: [
    "Fakultas Sains dan Analitika Data",
    "Fakultas Teknologi Industri dan Sistem Rekayasa",
    "Fakultas Teknik Sipil, Perencanaan, dan Kebumian",
    "Fakultas Teknologi Kelautan",
    "Fakultas Teknologi Elektro dan Informatika Cerdas",
    "Fakultas Desain Kreatif dan Bisnis Digital",
    "Fakultas Vokasi",
    "Fakultas Kedokteran dan Kesehatan",
  ],
};

const ALL_UNIT_GROUPS = [
  { group: "Direktorat", items: UNIT_KERJA_ITS.direktorat },
  { group: "Fakultas", items: UNIT_KERJA_ITS.fakultas },
];

/* ─────────────────────────────────────────────────────────────
   SECURITY HELPERS
───────────────────────────────────────────────────────────── */

/**
 * Strip characters that could be used for XSS or injection.
 * Removes HTML tags and dangerous punctuation entirely.
 */
function sanitize(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")          // strip any HTML tags
    .replace(/[<>"'`]/g, "")          // strip remaining angle brackets & quotes
    .replace(/javascript:/gi, "")     // strip JS protocol
    .replace(/on\w+\s*=/gi, "")       // strip event handlers
    .trimStart();                     // no leading whitespace
}

/** Sanitize but allow only the characters valid for a full name */
function sanitizeName(value: string): string {
  return sanitize(value).replace(/[^a-zA-Z\s.,'\-]/g, "").slice(0, MAX_NAMA);
}

/** Sanitize free-text field */
function sanitizeText(value: string): string {
  return sanitize(value).slice(0, MAX_KEPERLUAN);
}

/** Keep only digits, strip everything else */
function sanitizeNRP(value: string): string {
  return value.replace(/\D/g, "").slice(0, 18);
}

/**
 * Simple client-side rate limiter backed by sessionStorage.
 * Returns { allowed, remainingMs } where remainingMs > 0 means blocked.
 */
function checkRateLimit(): { allowed: boolean; remainingMs: number } {
  try {
    const raw = sessionStorage.getItem("rl_booking");
    const now = Date.now();
    const data: { count: number; windowStart: number } = raw
      ? JSON.parse(raw)
      : { count: 0, windowStart: now };

    if (now - data.windowStart > RATE_LIMIT_WINDOW) {
      // Window expired — reset
      sessionStorage.setItem(
        "rl_booking",
        JSON.stringify({ count: 1, windowStart: now })
      );
      return { allowed: true, remainingMs: 0 };
    }

    if (data.count >= RATE_LIMIT_MAX) {
      const remainingMs = RATE_LIMIT_WINDOW - (now - data.windowStart);
      return { allowed: false, remainingMs };
    }

    sessionStorage.setItem(
      "rl_booking",
      JSON.stringify({ count: data.count + 1, windowStart: data.windowStart })
    );
    return { allowed: true, remainingMs: 0 };
  } catch {
    // sessionStorage unavailable — allow but don't crash
    return { allowed: true, remainingMs: 0 };
  }
}

function formatCountdown(ms: number): string {
  const totalSecs = Math.ceil(ms / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return mins > 0 ? `${mins} menit ${secs} detik` : `${secs} detik`;
}

/** Validate that dates are sane */
function validateDates(
  pinjam: string,
  kembali: string
): string | null {
  if (!pinjam || !kembali) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dPinjam = new Date(pinjam);
  const dKembali = new Date(kembali);

  if (isNaN(dPinjam.getTime()) || isNaN(dKembali.getTime()))
    return "Format tanggal tidak valid.";
  if (dPinjam < today)
    return "Tanggal pinjam tidak boleh di masa lalu.";
  if (dKembali < dPinjam)
    return "Tanggal kembali tidak boleh sebelum tanggal pinjam.";

  const diffDays = (dKembali.getTime() - dPinjam.getTime()) / 86_400_000;
  if (diffDays > 30)
    return "Maksimal durasi peminjaman adalah 30 hari.";

  return null;
}

/** useDebounce — delays updating value until after `delay` ms of no change */
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/* ─────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────── */

interface BorrowFormData {
  nama: string;
  nrp: string;
  unit_kerja: string;
  vehicle_id: string;
  tanggal_pinjam: string;
  tanggal_kembali: string;
  keperluan: string;
  /** Honeypot — must stay empty. Never shown to real users. */
  [HONEYPOT_FIELD]: string;
}

type ToastType = "success" | "error" | "conflict" | "ratelimit";

interface ToastData {
  id: number;
  type: ToastType;
  message: string;
}

/* ─────────────────────────────────────────────────────────────
   TOAST
───────────────────────────────────────────────────────────── */

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: ToastData[];
  onRemove: (id: number) => void;
}) {
  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

function Toast({
  toast,
  onRemove,
}: {
  toast: ToastData;
  onRemove: (id: number) => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const enter = setTimeout(() => setVisible(true), 10);
    const exit = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(toast.id), 350);
    }, 4500);
    return () => { clearTimeout(enter); clearTimeout(exit); };
  }, [toast.id, onRemove]);

  const configs: Record<ToastType, { bg: string; icon: React.ReactNode; title: string }> = {
    success: {
      bg: "bg-white border-l-4 border-l-green-500",
      title: "Berhasil",
      icon: (
        <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      ),
    },
    error: {
      bg: "bg-white border-l-4 border-l-red-500",
      title: "Gagal",
      icon: (
        <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      ),
    },
    conflict: {
      bg: "bg-white border-l-4 border-l-amber-500",
      title: "Konflik",
      icon: (
        <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
      ),
    },
    ratelimit: {
      bg: "bg-white border-l-4 border-l-purple-500",
      title: "Terlalu Banyak Permintaan",
      icon: (
        <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </div>
      ),
    },
  };

  const { bg, icon, title } = configs[toast.type];

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-xl shadow-lg border border-gray-100 min-w-[300px] max-w-[380px] ${bg}`}
      style={{
        transition: "opacity 350ms ease, transform 350ms ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(2rem)",
      }}
    >
      {icon}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{toast.message}</p>
      </div>
      <button
        onClick={() => { setVisible(false); setTimeout(() => onRemove(toast.id), 350); }}
        className="shrink-0 text-gray-300 hover:text-gray-500 transition-colors mt-0.5"
        aria-label="Tutup notifikasi"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   LOADING OVERLAY
───────────────────────────────────────────────────────────── */

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center gap-4">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#1a2744]"
            style={{ animation: "spin 0.8s linear infinite" }}
          />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-gray-900">Mengirim Permohonan</p>
          <p className="text-xs text-gray-400 mt-1">Mohon tunggu sebentar...</p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SEARCHABLE GROUPED SELECT
───────────────────────────────────────────────────────────── */

function UnitKerjaSelect({
  value,
  onChange,
  error,
  disabled,
}: {
  value: string;
  onChange: (val: string) => void;
  error?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(
    () =>
      ALL_UNIT_GROUPS
        .map((g) => ({
          group: g.group,
          items: g.items.filter((item) =>
            item.toLowerCase().includes(search.toLowerCase())
          ),
        }))
        .filter((g) => g.items.length > 0),
    [search]
  );

  return (
    <div ref={ref} className="relative">
      {error && <p className="text-red-500 text-xs mb-1">{error}</p>}
      <button
        type="button"
        disabled={disabled}
        onClick={() => { setOpen((o) => !o); setSearch(""); }}
        className={`w-full px-4 py-3 border rounded-xl bg-white text-sm text-left flex items-center justify-between transition-all
          ${open ? "border-[#1a2744] ring-2 ring-[#1a2744]/20" : error ? "border-red-400" : "border-gray-200 hover:border-gray-300"}
          ${value ? "text-gray-800" : "text-gray-400"}
          disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed`}
      >
        <span className="truncate pr-2">{value || "Pilih Unit / Departemen"}</span>
        <svg
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && !disabled && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-2xl shadow-gray-200/60 overflow-hidden">
          <div className="p-2.5 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg">
              <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(sanitize(e.target.value))}
                placeholder="Cari unit atau departemen..."
                maxLength={80}
                className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center py-6 text-gray-400">
                <svg className="w-8 h-8 mb-2 opacity-40" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
                <p className="text-sm">Tidak ditemukan</p>
              </div>
            ) : (
              filtered.map((group) => (
                <div key={group.group}>
                  <div className="sticky top-0 px-4 py-1.5 text-[10px] font-bold tracking-widest text-[#1a2744]/50 uppercase bg-[#1a2744]/5 border-y border-[#1a2744]/10">
                    {group.group}
                  </div>
                  {group.items.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => { onChange(item); setOpen(false); setSearch(""); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2
                        ${value === item ? "bg-[#1a2744]/8 text-[#1a2744] font-semibold" : "text-gray-700 hover:bg-[#1a2744]/5"}`}
                    >
                      {value === item && (
                        <svg className="w-3.5 h-3.5 text-[#1a2744] shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      <span className={value === item ? "" : "pl-[22px]"}>{item}</span>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION ICON COMPONENT (Moved outside of main component)
───────────────────────────────────────────────────────────── */

const SectionIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="w-7 h-7 rounded-lg bg-[#1a2744]/10 flex items-center justify-center shrink-0">
    {children}
  </div>
);

/* ─────────────────────────────────────────────────────────────
   INFO CARDS (Moved outside of main component)
───────────────────────────────────────────────────────────── */

const INFO_CARDS = [
  {
    bg: "bg-green-50", title: "Priority Approval",
    desc: "Requests for academic research events are prioritized within 24 hours.",
    icon: <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>,
  },
  {
    bg: "bg-[#1a2744]/10", title: "Insurance Cover",
    desc: "All vehicles include standard institutional insurance and roadside assistance.",
    icon: <svg className="w-4 h-4 text-[#1a2744]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>,
  },
  {
    bg: "bg-amber-50", title: "Usage Policy",
    desc: "Vehicles must be returned with a clean interior and minimum 1/4 fuel tank.",
    icon: <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  },
];

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */

const EMPTY_FORM: BorrowFormData = {
  nama: "",
  nrp: "",
  unit_kerja: "",
  vehicle_id: "",
  tanggal_pinjam: "",
  tanggal_kembali: "",
  keperluan: "",
  [HONEYPOT_FIELD]: "",
};

export default function BorrowForm() {
  const [loading, setLoading] = useState(false);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof BorrowFormData, string>>>({});
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // double-submit guard

  const toastCounter = useRef(0);
  const lastSubmitRef = useRef(0);     // timestamp of last successful submit trigger

  const [formData, setFormData] = useState<BorrowFormData>(EMPTY_FORM);

  /* ── Today's date string for min= attribute ── */
  const todayStr = useMemo(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  }, []);

  /* ── Toast helpers ── */
  const addToast = useCallback((type: ToastType, message: string) => {
    const id = ++toastCounter.current;
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /* ── Generic field handler with per-field sanitization ── */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;

      let sanitized = value;
      if (name === "nama") sanitized = sanitizeName(value);
      else if (name === "nrp") sanitized = sanitizeNRP(value);
      else if (name === "keperluan") sanitized = sanitizeText(value);
      // tanggal_pinjam / tanggal_kembali / vehicle_id / unit_kerja — no free-text danger

      setFormData((prev) => ({ ...prev, [name]: sanitized }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof BorrowFormData];
        return next;
      });
    },
    []
  );

  /* ── Debounced dates for vehicle fetch (500 ms delay) ── */
  const debouncedPinjam = useDebounce(formData.tanggal_pinjam, 500);
  const debouncedKembali = useDebounce(formData.tanggal_kembali, 500);

  // FIXED: Use useEffect with proper cleanup and avoid immediate setState on every render
  useEffect(() => {
    let cancelled = false;
    
    const fetchVehicles = async () => {
      if (!debouncedPinjam || !debouncedKembali) {
        if (!cancelled) {
          setAvailableVehicles([]);
        }
        return;
      }
      
      const dateError = validateDates(debouncedPinjam, debouncedKembali);
      if (dateError) {
        if (!cancelled) {
          setAvailableVehicles([]);
        }
        return;
      }

      setLoadingVehicles(true);
      try {
        const vehicles = await getAvailableVehicles({ 
          tanggal_pinjam: debouncedPinjam, 
          tanggal_kembali: debouncedKembali 
        });
        if (!cancelled) {
          setAvailableVehicles(vehicles);
        }
      } catch (error) {
        if (!cancelled) {
          setAvailableVehicles([]);
          setErrors((prev) => ({ ...prev, vehicle_id: "Gagal memuat kendaraan tersedia." }));
        }
      } finally {
        if (!cancelled) {
          setLoadingVehicles(false);
        }
      }
    };

    fetchVehicles();

    return () => { cancelled = true; };
  }, [debouncedPinjam, debouncedKembali]);

  /* ── Validation ── */
  const validate = useCallback((): Partial<Record<keyof BorrowFormData, string>> => {
    const e: Partial<Record<keyof BorrowFormData, string>> = {};

    if (!formData.nama.trim())
      e.nama = "Nama wajib diisi.";
    else if (!NAMA_REGEX.test(formData.nama.trim()))
      e.nama = "Nama hanya boleh berisi huruf, spasi, dan tanda titik/koma.";

    if (!formData.nrp)
      e.nrp = "NRP / NIP wajib diisi.";
    else if (!NRP_REGEX.test(formData.nrp))
      e.nrp = "NRP / NIP harus berupa 8–18 digit angka.";

    if (!formData.unit_kerja)
      e.unit_kerja = "Unit kerja wajib dipilih.";

    if (!formData.tanggal_pinjam)
      e.tanggal_pinjam = "Tanggal pinjam wajib diisi.";

    if (!formData.tanggal_kembali)
      e.tanggal_kembali = "Tanggal kembali wajib diisi.";

    if (formData.tanggal_pinjam && formData.tanggal_kembali) {
      const dateError = validateDates(formData.tanggal_pinjam, formData.tanggal_kembali);
      if (dateError) e.tanggal_kembali = dateError;
    }

    if (!formData.vehicle_id || isNaN(Number(formData.vehicle_id)))
      e.vehicle_id = "Pilih kendaraan yang tersedia.";

    if (!formData.keperluan.trim())
      e.keperluan = "Keperluan wajib diisi.";
    else if (formData.keperluan.trim().length < 10)
      e.keperluan = "Keperluan terlalu singkat (min. 10 karakter).";

    return e;
  }, [formData]);

  /* ── Submit ── */
  const handleSubmit = useCallback(async () => {
    // 1. Honeypot check — if filled, silently do nothing (bot detected)
    if (formData[HONEYPOT_FIELD]) return;

    // 2. Double-submit guard
    if (isSubmitting) return;

    // 3. Minimum interval between submits
    const now = Date.now();
    if (now - lastSubmitRef.current < MIN_SUBMIT_INTERVAL) {
      addToast("ratelimit", "Mohon tunggu sebentar sebelum mencoba kembali.");
      return;
    }

    // 4. Client-side rate limit
    const { allowed, remainingMs } = checkRateLimit();
    if (!allowed) {
      addToast(
        "ratelimit",
        `Terlalu banyak percobaan. Silakan coba lagi dalam ${formatCountdown(remainingMs)}.`
      );
      return;
    }

    // 5. Validation
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 6. Prevent double-submit
    setIsSubmitting(true);
    setLoading(true);
    lastSubmitRef.current = now;

    try {
      const payload: BookingPayload = {
        nama: formData.nama.trim(),
        nrp: parseInt(formData.nrp, 10),
        unit_kerja: formData.unit_kerja,
        vehicle_id: parseInt(formData.vehicle_id, 10),
        tanggal_pinjam: formData.tanggal_pinjam,
        tanggal_kembali: formData.tanggal_kembali,
        keperluan: formData.keperluan.trim(),
      };
      await submitBooking(payload);
      addToast("success", "Permohonan peminjaman kendaraan berhasil diajukan.");
      setFormData(EMPTY_FORM);
      setAvailableVehicles([]);
      setErrors({});
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.status === 409) {
        addToast(
          "conflict",
          err.response.data?.message ?? "Kendaraan sudah dipesan pada rentang tanggal tersebut."
        );
      } else if (isAxiosError(err) && err.response?.status === 429) {
        // Server-side rate limit
        addToast("ratelimit", "Server menolak permintaan. Terlalu banyak percobaan, coba lagi nanti.");
      } else {
        addToast("error", "Gagal mengajukan peminjaman. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  }, [formData, isSubmitting, validate, addToast]);

  /* ── Reset ── */
  const handleReset = useCallback(() => {
    setFormData(EMPTY_FORM);
    setErrors({});
    setAvailableVehicles([]);
  }, []);

  /* ── Shared styles ── */
  const inputBase =
    "w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm text-gray-800 placeholder-gray-400 " +
    "focus:outline-none focus:ring-2 focus:ring-[#1a2744]/20 focus:border-[#1a2744] transition-all";
  const labelBase = "block text-sm font-semibold text-gray-700 mb-1.5";

  /* ─────────────────────────────────────────────────────── */

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      {loading && <LoadingOverlay />}

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 dark:from-gray-950 dark:to-gray-900 py-10 px-4">
        <div className="max-w-3xl mx-auto space-y-5">

          {/* Form card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

            {/* — Requester Information — */}
            <div className="px-8 pt-8 pb-6">
              <div className="flex items-center gap-2.5 mb-6">
                <SectionIcon>
                  <svg className="w-4 h-4 text-[#1a2744]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 1114 0H3z" />
                  </svg>
                </SectionIcon>
                <h2 className="text-sm font-bold text-gray-900 tracking-wide">Requester Information</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Nama */}
                <div>
                  <label className={labelBase}>Nama Lengkap</label>
                  {errors.nama && <p className="text-red-500 text-xs mb-1">{errors.nama}</p>}
                  <input
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    disabled={loading}
                    maxLength={MAX_NAMA}
                    autoComplete="name"
                    placeholder="e.g. Dr. Eng. Heru Santoso"
                    className={`${inputBase} ${errors.nama ? "border-red-400" : ""}`}
                  />
                </div>

                {/* NRP — numeric only, no display changes; field still submitted to BE */}
                <div>
                  <label className={labelBase}>NRP / NIP</label>
                  {errors.nrp && <p className="text-red-500 text-xs mb-1">{errors.nrp}</p>}
                  <input
                    name="nrp"
                    value={formData.nrp}
                    onChange={handleChange}
                    disabled={loading}
                    inputMode="numeric"
                    maxLength={18}
                    autoComplete="off"
                    placeholder="e.g. 198503202010121001"
                    className={`${inputBase} ${errors.nrp ? "border-red-400" : ""}`}
                  />
                </div>

                {/* Unit Kerja */}
                <div className="sm:col-span-2">
                  <label className={labelBase}>Unit / Departemen</label>
                  <UnitKerjaSelect
                    value={formData.unit_kerja}
                    error={errors.unit_kerja}
                    disabled={loading}
                    onChange={(val) => {
                      setFormData((prev) => ({ ...prev, unit_kerja: val }));
                      setErrors((prev) => { const next = { ...prev }; delete next.unit_kerja; return next; });
                    }}
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-100 mx-8" />

            {/* — Booking Details — */}
            <div className="px-8 pt-6 pb-8">
              <div className="flex items-center gap-2.5 mb-6">
                <SectionIcon>
                  <svg className="w-4 h-4 text-[#1a2744]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </SectionIcon>
                <h2 className="text-sm font-bold text-gray-900 tracking-wide">Booking Details</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Tanggal Pinjam */}
                <div>
                  <label className={labelBase}>Tanggal Pinjam</label>
                  {errors.tanggal_pinjam && <p className="text-red-500 text-xs mb-1">{errors.tanggal_pinjam}</p>}
                  <input
                    type="date"
                    name="tanggal_pinjam"
                    value={formData.tanggal_pinjam}
                    onChange={handleChange}
                    disabled={loading}
                    min={todayStr}
                    className={`${inputBase} ${errors.tanggal_pinjam ? "border-red-400" : ""}`}
                  />
                </div>

                {/* Tanggal Kembali */}
                <div>
                  <label className={labelBase}>Tanggal Kembali</label>
                  {errors.tanggal_kembali && <p className="text-red-500 text-xs mb-1">{errors.tanggal_kembali}</p>}
                  <input
                    type="date"
                    name="tanggal_kembali"
                    value={formData.tanggal_kembali}
                    onChange={handleChange}
                    disabled={loading}
                    min={formData.tanggal_pinjam || todayStr}
                    className={`${inputBase} ${errors.tanggal_kembali ? "border-red-400" : ""}`}
                  />
                </div>

                {/* Kendaraan */}
                <div className="sm:col-span-2">
                  <label className={labelBase}>Jenis Kendaraan</label>
                  {errors.vehicle_id && <p className="text-red-500 text-xs mb-1">{errors.vehicle_id}</p>}
                  <div className="relative">
                    <select
                      name="vehicle_id"
                      value={formData.vehicle_id}
                      onChange={handleChange}
                      disabled={loadingVehicles || loading}
                      className={`${inputBase} appearance-none pr-10 disabled:bg-gray-50 disabled:text-gray-400
                        ${errors.vehicle_id ? "border-red-400" : ""}`}
                    >
                      <option value="">
                        {loadingVehicles
                          ? "Memuat kendaraan..."
                          : !formData.tanggal_pinjam || !formData.tanggal_kembali
                            ? "Pilih tanggal terlebih dahulu"
                            : "Pilih Kendaraan"}
                      </option>
                      {availableVehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.nama_kendaraan} — {v.nomor_polisi}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      {loadingVehicles ? (
                        <div
                          className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-[#1a2744]"
                          style={{ animation: "spin 0.7s linear infinite" }}
                        />
                      ) : (
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>

                {/* Keperluan */}
                <div className="sm:col-span-2">
                  <label className={labelBase}>
                    Keperluan
                    <span className="ml-1.5 text-xs font-normal text-gray-400">
                      ({formData.keperluan.length}/{MAX_KEPERLUAN})
                    </span>
                  </label>
                  {errors.keperluan && <p className="text-red-500 text-xs mb-1">{errors.keperluan}</p>}
                  <textarea
                    name="keperluan"
                    value={formData.keperluan}
                    onChange={handleChange}
                    disabled={loading}
                    rows={4}
                    maxLength={MAX_KEPERLUAN}
                    placeholder="Describe the official purpose of the reservation..."
                    className={`${inputBase} resize-none ${errors.keperluan ? "border-red-400" : ""}`}
                  />
                </div>
              </div>
              {/*
                ── HONEYPOT FIELD ──────────────────────────────────────
                Visually hidden from real users; bots fill it automatically.
                If non-empty on submit → silently rejected (no error shown).
              */}
              <div
                aria-hidden="true"
                tabIndex={-1}
                style={{
                  position: "absolute",
                  left: "-9999px",
                  width: "1px",
                  height: "1px",
                  overflow: "hidden",
                  opacity: 0,
                  pointerEvents: "none",
                }}
              >
                <label htmlFor={HONEYPOT_FIELD}>Website</label>
                <input
                  id={HONEYPOT_FIELD}
                  name={HONEYPOT_FIELD}
                  type="text"
                  value={formData[HONEYPOT_FIELD]}
                  onChange={handleChange}
                  autoComplete="off"
                  tabIndex={-1}
                />
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={loading}
                  className="px-6 py-3 rounded-xl border border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || isSubmitting}
                  className="flex items-center gap-2 px-6 py-3 bg-[#1a2744] text-white rounded-xl text-sm font-semibold hover:bg-[#243460] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div
                        className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                        style={{ animation: "spin 0.7s linear infinite" }}
                      />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      Submit Reservation
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Info cards - FIXED: using INFO_CARDS constant instead of recreating */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4">
            {INFO_CARDS.map(({ bg, title, desc, icon }) => (
              <div key={title} className="bg-white rounded-2xl border border-gray-200 p-5 flex gap-3">
                <div className={`mt-0.5 w-8 h-8 rounded-full ${bg} flex items-center justify-center shrink-0`}>
                  {icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}