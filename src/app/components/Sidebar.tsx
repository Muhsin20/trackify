import AccountToggle from "./AccountToggle";
import RouteSelect from "./RouteSelect";
import Search from "./Search";

const Sidebar: React.FC = () => {
  return (
    <div>
      <div className="overflow-y-scroll sticky top-4 h-[calc(100vh-32px-48px)]">
        <AccountToggle />
        <Search />
        <RouteSelect />
      </div>
    </div>
  );
};

export default Sidebar;
