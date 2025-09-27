import { Link } from 'react-router-dom';

interface LinkCardProps {
  to: string;
  title: string;
  description: string;
  disabled?: boolean;
  className?: string;
}

export const LinkCard = ({
  to,
  title,
  description,
  disabled = false,
  className = '',
}: LinkCardProps) => {
  const baseClasses =
    'block bg-gray-700 hover:bg-gray-600 p-6 rounded-lg transition-colors group';
  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed hover:bg-gray-700'
    : '';

  return (
    <Link
      to={disabled ? '#' : to}
      className={`${baseClasses} ${disabledClasses} ${className}`}
      onClick={disabled ? e => e.preventDefault() : undefined}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3
            className={`text-lg font-medium ${disabled ? 'text-white' : 'text-white group-hover:text-blue-300'}`}
          >
            {title}
          </h3>
          <p className="text-gray-400 text-sm mt-1">{description}</p>
        </div>
        <div
          className={`${disabled ? 'text-gray-400' : 'text-gray-400 group-hover:text-blue-300'}`}
        >
          →
        </div>
      </div>
    </Link>
  );
};
