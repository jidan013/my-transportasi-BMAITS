export type BorrowStatus = "approved" | "pending" | "rejected" | "terbit";

export type TimelineKey = "diajukan" | "ditinjau" | "disetujui" | "diterbitkan";


export interface TimelineItem {
  key: "diajukan" | "ditinjau" | "disetujui" | "diterbitkan";
  label: string;
  time: string;
}

export interface StatusTimelineItem {
  key: TimelineKey[];
  label: string;
  time: string;
  item: string;
  data: TimelineItem[];
}

export interface BorrowItem {
    id: number;
  borrower: string;
  vehicle: string;
  plate: string;
  borrowDate: string;
  returnDate: string;
  status: "approved" | "pending" | "rejected" | "terbit";
  timeline: TimelineItem[];
}

export interface BorrowCardProps {
    id: number;
  borrower: string;
  vehicle: string;
  plate: string;
  borrowDate: string;
  returnDate: string;
  status: BorrowStatus;
  timeline: TimelineItem[];
}