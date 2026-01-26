import {
  IconClock,
  IconFileCheck,
  IconCheck,
} from "@tabler/icons-react";
import type { FC, ComponentType } from "react";

/* ======================
   TYPES
====================== */
export type StatusKey =
  | "diajukan"
  | "ditinjau"
  | "disetujui";

export interface StatusTimelineItem {
  key: StatusKey;
  label: string;
  time: string;
}

interface StatusTimelineProps {
  data: StatusTimelineItem[];
}

/* ======================
   ICON MAPPING
====================== */
const icons: Record<
  StatusKey,
  ComponentType<{ size?: number; stroke?: number; className?: string }>
> = {
  diajukan: IconClock,
  ditinjau: IconFileCheck,
  disetujui: IconCheck,
};

/* ======================
   COMPONENT
====================== */
const StatusTimeline: FC<StatusTimelineProps> = ({ data }) => {
  return (
    <div className="relative pl-6 space-y-6">
      <div className="absolute left-3 top-2 bottom-2 w-px bg-gray-300" />

      {data.map((item, index) => {
        const Icon = icons[item.key];

        return (
          <div key={index} className="flex gap-4">
            <div className="z-10 w-9 h-9 rounded-full bg-blue-700 text-white flex items-center justify-center shadow">
              <Icon size={18} />
            </div>

            <div>
              <p className="text-sm font-semibold text-green-600">
                {item.label}
              </p>
              <p className="text-xs text-gray-500">
                {item.time}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatusTimeline;
