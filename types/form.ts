import type { Vehicle } from './vehicle';

// ✅ Form state (UI-friendly)
export interface FormData {
  nama: string;
  nrp: string;
  unit_kerja: string;
  vehicle_id: string;
  tanggal_peminjaman: string;
  tanggal_kembali: string;
  keperluan: string;
}

// ✅ Step 1 Props
export interface Step1Props {
  data: FormData;
  errors: Record<string, string>;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  formId: string;
}

// ✅ Step 2 Props  
export interface Step2Props {
  data: FormData;
  errors: Record<string, string>;
  onChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >;
  formId: string;
  vehicles: Vehicle[];
  loading: boolean;
}
