import { Link } from 'react-router-dom';

interface BackNavProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

export const BackNav = ({ to, children, className = '' }: BackNavProps) => {
  return (
    <Link
      to={to}
      className={`text-blue-400 hover:text-blue-300 text-sm ${className}`}
    >
      ← {children}
    </Link>
  );
};
