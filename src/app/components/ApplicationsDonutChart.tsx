"use client";
import React, { useState } from "react";
import { FiEye } from "react-icons/fi";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import dynamic from "next/dynamic";
const ApplicationsDonutChart: React.FC<{ stats: Record<string, any> }> = ({
  stats,
}) => {
  const [activeIndex, setActiveIndex] = useState(-1);

  const data = [
    { name: "Applications", value: stats["application length"]?.count || 0 },
    { name: "Interviews", value: stats["Interview Scheduled"]?.count || 0 },
    { name: "Offers", value: stats["Offer Received"]?.count || 0 },
    { name: "Rejections", value: stats["Rejected Applications"]?.count || 0 },
  ];

  const COLORS = ["#6366F1", "#3B82F6", "#10B981", "#EF4444"];

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="col-span-4 overflow-hidden rounded border border-stone-300">
      <div className="p-4">
        <h3 className="flex items-center gap-1.5 font-medium">
          <FiEye /> Job Application Insights
        </h3>
      </div>
      <div className="h-[400px] flex justify-center items-center">
        <PieChart width={300} height={300}>
          <Pie
            activeIndex={activeIndex}
            data={data}
            dataKey="value"
            outerRadius={120}
            fill="green"
            onMouseEnter={onPieEnter}
            style={{ cursor: "pointer", outline: "none" }} // Ensure no outline on focus
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(ApplicationsDonutChart), {
  ssr: false, // Disable SSR
});
