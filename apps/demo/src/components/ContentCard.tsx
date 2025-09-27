import { ReactNode } from 'react';

interface ContentCardProps {
  children: ReactNode;
  className?: string;
}

export const ContentCard = ({ children, className = '' }: ContentCardProps) => {
  return (
    <div
      className={`bg-gray-800 rounded-lg p-6 border border-gray-700 ${className}`}
    >
      {children}
    </div>
  );
};
