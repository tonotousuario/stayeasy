// frontend/src/components/Dashboard/StatsCard.tsx
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, description, icon }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
      {icon && <div className="text-2xl text-blue-500">{icon}</div>}
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-xl font-semibold text-gray-900">{value}</p>
        {description && <p className="text-xs text-gray-400">{description}</p>}
      </div>
    </div>
  );
};

export default StatsCard;
