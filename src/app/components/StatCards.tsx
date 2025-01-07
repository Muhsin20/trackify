import { FiTrendingDown, FiTrendingUp } from "react-icons/fi";
const StatCards: React.FC = () => {
  return (
    <>
      <Card
        title="Number of Applications"
        value="500"
        pillText="2.75%"
        trend="up"
        period="From Jan 1st - Jul 31st"
      />
      <Card
        title="Number of Interviews"
        value="50"
        pillText="1.01%"
        trend="down"
        period="From Jan 1st - Jul 31st"
      />
      <Card
        title="Number of Offers"
        value="5"
        pillText="60.75%"
        trend="up"
        period="Previous 365 days"
      />
    </>
  );
};
export default StatCards;
const Card = ({
  title,
  value,
  pillText,
  trend,
  period,
}: {
  title: string;
  value: string;
  pillText: string;
  trend: "up" | "down";
  period: string;
}) => {
  return (
    <>
      <div className="col-span-4 p-4 rounded border border-stone-300">
        <div className="flex mb-8 items-start justify-between">
          <div>
            <h3 className="text-stone-500 mb-2 text-sm">{title}</h3>
            <p className="text-3xl font-semibold">{value}</p>
          </div>
        </div>

        <p className="text-xs text-stone-500">{period}</p>
      </div>
    </>
  );
};
