const StatCards: React.FC<{ stats: Record<string, any> }> = ({ stats }) => {
  return (
    <>
      <Card
        title="Number of Applications"
        value={stats["application length"]?.count || 0}
        pillText="2.75%"
        period="From Jan 1st - Jul 31st"
      />
      <Card
        title="Number of Interviews"
        value={stats["Interview Scheduled"]?.count || 0}
        pillText="1.01%"
        period="From Jan 1st - Jul 31st"
      />
      <Card
        title="Number of Offers"
        value={stats["Offer Received"]?.count || 0}
        pillText="60.75%"
        period="Previous 365 days"
      />
    </>
  );
};
export default StatCards;
const Card = ({
  title,
  value,
  period,
}: {
  title: string;
  value: string;
  pillText: string;
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
