"use client";

export default function SkeletonCard() {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-2xl mb-4" />
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
    </div>
  );
}