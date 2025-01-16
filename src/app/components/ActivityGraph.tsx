"use client";
import { FiUser } from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
const ActivityGraph: React.FC<{ stats: Record<string, any> }> = ({ stats }) => {
  const applicationsData = [
    { month: "January", applications: 5 },
    { month: "February", applications: 8 },
    { month: "March", applications: 12 },
    { month: "April", applications: 4 },
    { month: "May", applications: 9 },
    { month: "June", applications: 10 },
    { month: "July", applications: 7 },
    { month: "August", applications: 3 },
    { month: "September", applications: 6 },
    { month: "October", applications: 11 },
    { month: "November", applications: 5 },
    { month: "December", applications: 15 },
  ];
  return (
    <>
      <div className="col-span-8 overflow-hidden rounded border border-stone-300">
        <div className="p-4">
          <h3 className="flex items-center gap-1.5 font-medium">
            <FiUser /> Activity
          </h3>
        </div>
        <div className="h-64 px-4">
          {applicationsData.length > 0 ? (
            <ResponsiveContainer width="99%" height="100%">
              <LineChart
                data={stats["Month Counts"]?.data}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  tick={{ fontSize: 12 }}
                  dataKey="month"
                  padding={{ left: 20, right: 20 }}
                />
                <YAxis
                  label={{
                    value: "Applications",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>No activity data available.</p>
          )}
        </div>
      </div>
    </>
  );
};
export default ActivityGraph;
