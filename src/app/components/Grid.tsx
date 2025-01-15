"use client";
import ActivityGraph from "./ActivityGraph";
import ApplicationsDonutChart from "./ApplicationsDonutChart";
import StatCards from "./StatCards";

const Grid: React.FC = () => {
  return (
    <>
      <div className="px-4 grid gap-3 grid-cols-12">
        <StatCards />
        <ActivityGraph />
        <ApplicationsDonutChart />
      </div>
    </>
  );
};
export default Grid;
