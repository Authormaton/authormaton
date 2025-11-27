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
  children: React.ReactNode;
  onTabChange?: (id: string) => void;
}

export function Tabs({ activeTab, tabs, className, children, onTabChange }: TabsProps) {
  // Accessibility Note: This component provides keyboard navigation for tabs using ArrowLeft, ArrowRight, Home, and End keys,
  // along with appropriate ARIA roles and attributes for screen reader compatibility.
  const tabRefs = useRef<(HTMLButtonElement | HTMLAnchorElement | null)[]>([]);
  const [focusedTab, setFocusedTab] = useState(() => {
    const index = tabs.findIndex((tab) => tab.id === activeTab);
    return index >= 0 ? index : 0;
  });

  useEffect(() => {
    const index = tabs.findIndex((tab) => tab.id === activeTab);
    setFocusedTab(index >= 0 ? index : 0);
  }, [activeTab, tabs]);

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
    <div className={className}>
      <div
        role="tablist"
        aria-orientation="horizontal"
        onKeyDown={handleKeyDown}
        className={`border-b border-primary/20`}
      >
        <div className='flex justify-center gap-8'>
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const hasHighlight = tab.highlight || false;

            const handleFocus = () => {
              setFocusedTab(index);
            };

            if (!tab.href) {
              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  tabIndex={focusedTab === index ? 0 : -1}
                  ref={(el) => (tabRefs.current[index] = el)}
                  onFocus={handleFocus}
                  onClick={() => {
                    setFocusedTab(index);
                    onTabChange?.(tab.id);
                  }}
                  className={`flex items-center gap-2 px-1 py-2 pb-3 text-sm relative ${
                    isActive ? 'text-primary border-b-2 border-primary font-semibold' : 'text-gray-600'
                  }`}}
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
                tabIndex={focusedTab === index ? 0 : -1}
                ref={(el) => (tabRefs.current[index] = el)}
                href={tab.href}
                onFocus={handleFocus}
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
      {Array.isArray(children)
        ? (() => {
            if (process.env.NODE_ENV === 'development' && (children as React.ReactNode[]).length !== tabs.length) {
              console.warn(
                `Mismatch between number of tabs (${tabs.length}) and children (${(children as React.ReactNode[]).length}). ` +
                  `Ensure each tab has a corresponding child element.`
              );
            }
            return (children as React.ReactNode[]).slice(0, tabs.length).map((child, index) => {
              const tab = tabs[index];
              return (
                <div
                  key={tab.id}
                  id={`panel-${tab.id}`}
                  role="tabpanel"
                  aria-labelledby={`tab-${tab.id}`}
                  hidden={activeTab !== tab.id}
                >
                  {child}
                </div>
              );
            });
          })()
        : tabs.map((tab) => (
            <div
              key={tab.id}
              id={`panel-${tab.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${tab.id}`}
              hidden={activeTab !== tab.id}
            >
              {activeTab === tab.id ? children : null}
            </div>
          ))}
    </div>
  );
}
