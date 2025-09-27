import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

interface PageHeaderProps {
  backNav?: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export const PageLayout = ({ children, className = '' }: PageLayoutProps) => {
  return (
    <div className={`min-h-screen bg-gray-900 text-gray-100 ${className}`}>
      <div className="container mx-auto px-6 py-8">{children}</div>
    </div>
  );
};

export const PageHeader = ({
  backNav,
  title,
  subtitle,
  actions,
}: PageHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        {backNav && <div className="mb-2">{backNav}</div>}
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
};
