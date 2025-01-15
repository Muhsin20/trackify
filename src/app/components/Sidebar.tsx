import AccountToggle from "./AccountToggle";
import RouteSelect from "./RouteSelect";
import Search from "./Search";
interface UserProps {
  username: string;
  email: string;
}
const Sidebar: React.FC<UserProps> = ({ username, email }) => {
  return (
    <div>
      <div className="overflow-y-scroll sticky top-4 h-[calc(100vh-32px-48px)]">
        <AccountToggle username={username} email={email} />
        <Search />
        <RouteSelect />
      </div>
    </div>
  );
};

export default Sidebar;
