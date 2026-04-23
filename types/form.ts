import type { Vehicle } from './vehicle';


export interface FormData {
  nama: string;
  nrp: string;
  unit_kerja: string;
  vehicle_id: string;
  tanggal_peminjaman: string;
  tanggal_kembali: string;
  keperluan: string;
}


export interface Step1Props {
  data: FormData;
  errors: Record<string, string>;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  formId: string;
}


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
