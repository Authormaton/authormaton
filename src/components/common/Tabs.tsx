import Link from 'next/link';
import { IconType } from 'react-icons';
import { useRef, useState } from 'react';

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
  // Accessibility Note: This component provides keyboard navigation for tabs using ArrowLeft, ArrowRight, Home, and End keys,
  // along with appropriate ARIA roles and attributes for screen reader compatibility.
  const tabRefs = useRef<(HTMLButtonElement | HTMLAnchorElement | null)[]>([]);
  const [focusedTab, setFocusedTab] = useState(() => {
    const index = tabs.findIndex((tab) => tab.id === activeTab);
    return index >= 0 ? index : 0;
  });

  const handleKeyDown = (event: React.KeyboardEvent) => {
    let newFocusIndex = focusedTab;

    switch (event.key) {
      case "ArrowLeft":
        newFocusIndex = (focusedTab - 1 + tabs.length) % tabs.length;
        break;
      case "ArrowRight":
        newFocusIndex = (focusedTab + 1) % tabs.length;
        break;
      case "Home":
        newFocusIndex = 0;
        break;
      case "End":
        newFocusIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    setFocusedTab(newFocusIndex);
    tabRefs.current[newFocusIndex]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      onKeyDown={handleKeyDown}
      className={`border-b border-primary/20 ${className}`}
    >
      <div className='flex justify-center gap-8'>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const hasHighlight = tab.highlight || false;

          if (!tab.href) {
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                ref={(el) => (tabRefs.current[tabs.findIndex((t) => t.id === tab.id)] = el)}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
                {tab.label}
                {hasHighlight && <div className='w-2 h-2 bg-primary relative top-[-1px] rounded-full'></div>}
              </button>
            );
          }

          return (
            <Link
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              ref={(el) => (tabRefs.current[tabs.findIndex((t) => t.id === tab.id)] = el)}
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
