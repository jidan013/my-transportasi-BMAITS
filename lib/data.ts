export type Status = "available" | "borrowed" | "maintenance";

export interface Vehicle {
  id: string;
  name: string;
  type: string;
  plate: string;
  status: Status;
  borrower?: string;
  returnDate?: string;
  image: string;
  year: number;
  capacity: string;
}

export interface Activity {
  id: string;
  action: string;
  user: string;
  vehicle: string;
  timestamp: string;
}

export interface Maintenance {
  id: string;
  vehicle: string;
  date: string;
  type: string;
}

export const VEHICLES: Vehicle[] = [
    {
    id: "1",
    name: "Toyota Avanza",
    type: "MPV",
    plate: "B 1234 XYZ",
    status: "available",
    image:
      "https://images.unsplash.com/photo-1590650046871-92c887180603?auto=format&fit=crop&w=600",
    year: 2022,
    capacity: "7 Penumpang",
  },
  {
    id: "2",
    name: "Toyota Avanza",
    type: "MPV",
    plate: "B 1234 XYZ",
    status: "available",
    image:
      "https://images.unsplash.com/photo-1590650046871-92c887180603?auto=format&fit=crop&w=600",
    year: 2022,
    capacity: "7 Penumpang",
  },
  {
    id: "3",
    name: "Toyota Avanza",
    type: "MPV",
    plate: "B 1234 XYZ",
    status: "available",
    image:
      "https://images.unsplash.com/photo-1590650046871-92c887180603?auto=format&fit=crop&w=600",
    year: 2022,
    capacity: "7 Penumpang",
  },
];
export const ACTIVITIES: Activity[] = [
    {
    id: "a1",
    action: "meminjam",
    user: "Andi",
    vehicle: "Honda Jazz",
    timestamp: "2025-10-29T08:00",
  },
  {
    id: "a2",
    action: "mengembalikan",
    user: "Siti",
    vehicle: "Toyota Avanza",
    timestamp: "2025-10-28T15:30",
  },
  {
    id: "a3",
    action: "meminjam",
    user: "Budi",
    vehicle: "Suzuki Ertiga",
    timestamp: "2025-10-27T09:15",
  },
];
export const MAINTENANCE_SCHEDULES: Maintenance[] = [
    {
    id: "m1",
    vehicle: "Mitsubishi Pajero",
    date: "2025-11-05",
    type: "Servis Rutin",
  },
  { id: "m2", vehicle: "Toyota Avanza", date: "2025-11-10", type: "Ganti Oli" },
  {
    id: "m3",
    vehicle: "Daihatsu Xenia",
    date: "2025-11-15",
    type: "Perbaikan AC",
  },
];