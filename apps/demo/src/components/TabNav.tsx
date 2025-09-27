import { Link, useLocation } from 'react-router-dom';

interface TabItem {
  path: string;
  label: string;
}

interface TabNavProps {
  tabs: TabItem[];
  className?: string;
}

export const TabNav = ({ tabs, className = '' }: TabNavProps) => {
  const location = useLocation();

  const getNavLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `px-3 py-2 rounded-md transition-colors ${
      isActive
        ? 'text-blue-400 bg-blue-400/10'
        : 'text-gray-300 hover:text-white hover:bg-gray-700'
    }`;
  };

  return (
    <nav
      className={`flex space-x-4 mb-6 border-b border-gray-600 pb-4 ${className}`}
    >
      {tabs.map(({ path, label }) => (
        <Link key={path} to={path} className={getNavLinkClass(path)}>
          {label}
        </Link>
      ))}
    </nav>
  );
};
