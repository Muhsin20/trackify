"use client";
import ActivityGraph from "./ActivityGraph";
import ApplicationsDonutChart from "./ApplicationsDonutChart";
import StatCards from "./StatCards";

const Grid: React.FC<{ stats: Record<string, any> }> = ({ stats }) => {
  return (
    <>
      <div className="px-4 grid gap-3 grid-cols-12">
        <StatCards stats={stats} />
        <ActivityGraph stats={stats} />
        <ApplicationsDonutChart stats={stats} />
      </div>
    </>
  );
};
export default Grid;
