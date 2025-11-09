// components/ui/StatusBadge.tsx
import { IconCircleCheckFilled, IconUsers, IconTools, IconAlertTriangle, IconCalendar } from "@tabler/icons-react";
import { Status } from "@/lib/data";

interface Props {
  status: Status;
  borrower?: string;
  returnDate?: string;
}

export default function StatusBadge({ status, borrower, returnDate }: Props) {
  const today = new Date().toISOString().split("T")[0];
  const isDueToday = returnDate === today;

  const config = {
    available: {
      color: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
      icon: IconCircleCheckFilled,
      label: "Tersedia",
    },
    borrowed: {
      color: "bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800",
      icon: IconUsers,
      label: "Dipinjam",
    },
    maintenance: {
      color: "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
      icon: IconTools,
      label: "Maintenance",
    },
  };

  const { icon: Icon, color, label } = config[status];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${color} border rounded-full font-semibold text-xs`}>
          <Icon className="w-4 h-4" />
          {label}
        </span>
        {isDueToday && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-700 rounded-full text-xs font-bold animate-pulse">
            <IconAlertTriangle className="w-3.5 h-3.5" />
            Hari Ini
          </span>
        )}
      </div>
      {status === "borrowed" && borrower && returnDate && (
        <div className="text-right text-xs">
          <p className="font-semibold text-orange-700 dark:text-orange-400">{borrower}</p>
          <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1 justify-end">
            <IconCalendar className="w-3 h-3" />
            {new Date(returnDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
          </p>
        </div>
      )}
    </div>
  );
}