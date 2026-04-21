import React, { useState } from 'react';

export interface TabsProps {
  children: React.ReactNode;
  defaultActiveKey?: string;
}

export interface TabProps {
  eventKey: string;
  title: React.ReactNode;
  children: React.ReactNode;
}

const TabsContext = React.createContext<{
  activeKey: string;
  setActiveKey: (key: string) => void;
} | null>(null);

export const Tabs: React.FC<TabsProps> = ({ children, defaultActiveKey }) => {
  const tabs = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<TabProps> =>
      React.isValidElement(child) && child.type === Tab
  );

  const [activeKey, setActiveKey] = useState(defaultActiveKey || tabs[0]?.props.eventKey);

  return (
    <TabsContext.Provider value={{ activeKey: activeKey || '', setActiveKey }}>
      <div>
        <div className="flex mb-0 pl-0 mt-0 border-b border-[var(--fcc-border-color)]">
          {tabs.map((tab) => (
            <button
              key={tab.props.eventKey}
              onClick={() => setActiveKey(tab.props.eventKey)}
              className={`flex-1 block relative px-3 py-[5px] text-sm border-none cursor-pointer transition-colors ${
                activeKey === tab.props.eventKey
                  ? 'font-bold bg-[var(--fcc-tertiary-background)] text-[var(--fcc-primary-color)]'
                  : 'text-[var(--fcc-secondary-color)] hover:bg-[var(--fcc-tertiary-background)]'
              }`}
              role="tab"
              aria-selected={activeKey === tab.props.eventKey}
            >
              {tab.props.title}
            </button>
          ))}
        </div>
        <div className="py-4">
          {tabs.map((tab) => (
            <div
              key={tab.props.eventKey}
              role="tabpanel"
              hidden={activeKey !== tab.props.eventKey}
            >
              {tab.props.children}
            </div>
          ))}
        </div>
      </div>
    </TabsContext.Provider>
  );
};

export const Tab: React.FC<TabProps> = () => null;

Tabs.displayName = 'Tabs';
Tab.displayName = 'Tab';
