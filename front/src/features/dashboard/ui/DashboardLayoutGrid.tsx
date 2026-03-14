import React from "react";

interface DashboardLayoutGridProps {
  summary: React.ReactNode;
  clock: React.ReactNode;
  utilities: React.ReactNode;
  activity: React.ReactNode;
}

export const DashboardLayoutGrid = React.memo(function DashboardLayoutGrid({
  summary,
  clock,
  utilities,
  activity,
}: DashboardLayoutGridProps) {
  return (
    <section className="grid gap-6">
      <div>{summary}</div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-4">{clock}</div>

        <div className="grid gap-6 xl:col-span-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">{utilities}</div>
          <div>{activity}</div>
        </div>
      </div>
    </section>
  );
});
