import { TimelineKey, StatusTimelineItem } from "@/types/times";
import {
  IconClock,
  IconFileCheck,
  IconCheck,
  IconMail,
} from "@tabler/icons-react";
import type { FC, ComponentType } from "react";

const icons: Record<
  TimelineKey,
  ComponentType<{ size?: number; className?: string }>
> = {
  diajukan: IconClock,
  ditinjau: IconFileCheck,
  disetujui: IconCheck,
  diterbitkan: IconMail,
};

/* ======================
   COMPONENT
====================== */
const StatusTimeline: FC<StatusTimelineItem> = ({ data }) => {
  const lastIndex = data.length - 1;

  return (
    <div className="relative pl-6 space-y-6">
      {/* LINE */}
      <div className="absolute left-4 top-2 bottom-2 w-px bg-gray-300 dark:bg-gray-600" />

      {data.map((item, index) => {
        const Icon = icons[item.key];
        const isLast = index === lastIndex;

        return (
          <div key={`${item.key}-${item.time}`} className="flex gap-4">
            {/* ICON */}
            <div
              className={`z-10 w-9 h-9 rounded-full flex items-center justify-center shadow
                ${
                  isLast
                    ? "bg-emerald-600 text-white"
                    : "bg-blue-700 text-white"
                }`}
            >
              <Icon size={18} />
            </div>

            {/* CONTENT */}
            <div>
              <p
                className={`text-sm font-semibold
                  ${
                    isLast
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-gray-800 dark:text-gray-200"
                  }`}
              >
                {item.label}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
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