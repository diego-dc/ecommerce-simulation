import { Link } from "react-router-dom";

interface NavItemsProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const NavItem: React.FC<NavItemsProps> = ({ to, children, className }) => (
  <Link
    to={to}
    className={`font-bold hover:text-primary-500 active:text-primary-700 ${
      className || ""
    }`}
  >
    {children}
  </Link>
);

export default NavItem;
