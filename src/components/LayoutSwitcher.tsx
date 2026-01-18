import React from 'react';
import { Columns2, Rows3, RectangleVertical } from 'lucide-react';

export type LayoutType = 'side-by-side' | 'stacked' | 'tabs';

interface LayoutSwitcherProps {
  currentLayout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
}

const layouts = [
  {
    type: 'side-by-side' as LayoutType,
    icon: Columns2,
    label: 'Side by Side',
    description: 'View inputs and results simultaneously'
  },
  {
    type: 'stacked' as LayoutType,
    icon: Rows3,
    label: 'Stacked',
    description: 'Vertical layout for focused viewing'
  },
  {
    type: 'tabs' as LayoutType,
    icon: RectangleVertical,
    label: 'Tabs',
    description: 'Switch between input and results'
  }
];

export default function LayoutSwitcher({ currentLayout, onLayoutChange }: LayoutSwitcherProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="inline-flex items-center bg-gray-100 rounded-xl p-1.5 gap-1">
        {layouts.map(({ type, icon: Icon, label, description }) => (
          <button
            key={type}
            onClick={() => onLayoutChange(type)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm
              transition-all duration-200 ease-in-out
              ${currentLayout === type
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }
            `}
            title={description}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
