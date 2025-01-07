"use client";
import React, { useState } from "react";
import { FiEye } from "react-icons/fi";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const ApplicationsDonutChart = () => {
  const [activeIndex, setActiveIndex] = useState(-1);

  const data = [
    { name: "Applications", value: 40 },
    { name: "Interviews", value: 15 },
    { name: "Offers", value: 3 },
    { name: "Rejections", value: 22 },
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

export default ApplicationsDonutChart;
