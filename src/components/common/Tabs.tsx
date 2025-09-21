import Link from 'next/link';
import { IconType } from 'react-icons';

interface Tab {
  id: string;
  label: string;
  icon: IconType;
  highlight?: boolean;
  href?: string;
}

interface TabsProps {
  activeTab: string;
  tabs: Tab[];
  className?: string;
}

export function Tabs({ activeTab, tabs, className }: TabsProps) {
  return (
    <div className={`border-b border-primary/20 ${className}`}>
      <div className='flex justify-center gap-8'>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const hasHighlight = tab.highlight || false;

          if (!tab.href) {
            return (
              <button key={tab.id}>
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
                {tab.label}
                {hasHighlight && <div className='w-2 h-2 bg-primary relative top-[-1px] rounded-full'></div>}
              </button>
            );
          }

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`flex items-center gap-2 px-1 py-2 pb-3 text-sm relative ${
                isActive ? 'text-primary border-b-2 border-primary font-semibold' : 'text-gray-600'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
              {tab.label}
              {hasHighlight && <div className='w-2 h-2 bg-primary relative top-[-1px] rounded-full'></div>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
