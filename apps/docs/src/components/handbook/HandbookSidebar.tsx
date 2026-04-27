import type { JSX } from 'react';
import {
  Sidebar,
  SidebarItem,
  SidebarSection
} from '@freecodecamp/uikit/navigation';

export interface HandbookSidebarItem {
  readonly id: string;
  readonly label: string;
}

export interface HandbookSidebarSection {
  readonly label: string;
  readonly items: readonly HandbookSidebarItem[];
}

export interface HandbookSidebarProps {
  readonly sections: readonly HandbookSidebarSection[];
  readonly currentHash?: string;
}

export function HandbookSidebar({
  sections,
  currentHash = ''
}: HandbookSidebarProps): JSX.Element {
  const activeTarget =
    currentHash.replace(/^#/, '') || sections[0]?.items[0]?.id;

  return (
    <Sidebar aria-label='Handbook navigation'>
      <div className='sidebar__intro'>
        <p className='sidebar__intro-kicker'>freeCodeCamp UIKit</p>
        <p className='sidebar__intro-title'>Handbook</p>
      </div>
      {sections.map(section => (
        <SidebarSection key={section.label} label={section.label}>
          {section.items.map(item => (
            <SidebarItem
              key={item.id}
              href={`#${item.id}`}
              active={activeTarget === item.id}
              data-sidebar-link=''
              data-target={item.id}
            >
              {item.label}
            </SidebarItem>
          ))}
        </SidebarSection>
      ))}
      <p className='sidebar__hint'>
        Press <kbd className='kbd'>/</kbd> to search
      </p>
    </Sidebar>
  );
}
