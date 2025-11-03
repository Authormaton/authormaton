import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppSidebar } from '@/components/common/Sidebar/AppSidebar';
import { PathInfoRecord } from '@/components/common/Sidebar/SidebarItem';
import { usePathname } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock SidebarItem to simplify testing AppSidebar's logic
jest.mock('@/components/common/Sidebar/SidebarItem', () => ({
  PathInfoRecord: {
    '/': { icon: () => null, title: 'Dashboard' },
    '/projects': { icon: () => null, title: 'Projects' },
    '/hidden': { icon: () => null, title: 'Hidden', hide: true },
  },
  SidebarItem: jest.fn(({ title, isFocusable, refCallback, path, onClick, ...props }) => {
    return (
      <li
        data-testid={`sidebar-item-${title}`}
        tabIndex={isFocusable ? 0 : -1}
        ref={refCallback}
        {...props}
      >
        <a href={path} data-testid={`sidebar-item-link-${title}`} onClick={onClick || (() => {})}>
          {title}
        </a>
      </li>
    );
  }),
}));

describe('AppSidebar', () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/');
    jest.clearAllMocks();
  });

  it('renders sidebar items correctly and sets initial focus', () => {
    render(<AppSidebar />);
    expect(screen.getByTestId('sidebar-item-Dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-item-Projects')).toBeInTheDocument();
    expect(screen.queryByTestId('sidebar-item-Hidden')).not.toBeInTheDocument();

    // Initial focus should be on the active item (Dashboard)
    expect(screen.getByTestId('sidebar-item-Dashboard')).toHaveAttribute('tabindex', '0');
    expect(screen.getByTestId('sidebar-item-Projects')).toHaveAttribute('tabindex', '-1');
  });

  it('moves focus with ArrowDown key', () => {
    render(<AppSidebar />);
    const dashboardItem = screen.getByTestId('sidebar-item-Dashboard');
    const projectsItem = screen.getByTestId('sidebar-item-Projects');

    fireEvent.keyDown(dashboardItem, { key: 'ArrowDown' });
    expect(projectsItem).toHaveFocus();
    expect(projectsItem).toHaveAttribute('tabindex', '0');
    expect(dashboardItem).toHaveAttribute('tabindex', '-1');

    fireEvent.keyDown(projectsItem, { key: 'ArrowDown' });
    expect(dashboardItem).toHaveFocus(); // Wraps around
    expect(dashboardItem).toHaveAttribute('tabindex', '0');
    expect(projectsItem).toHaveAttribute('tabindex', '-1');
  });

  it('moves focus with ArrowUp key', () => {
    render(<AppSidebar />);
    const dashboardItem = screen.getByTestId('sidebar-item-Dashboard');
    const projectsItem = screen.getByTestId('sidebar-item-Projects');

    fireEvent.keyDown(dashboardItem, { key: 'ArrowUp' });
    expect(projectsItem).toHaveFocus(); // Wraps around
    expect(projectsItem).toHaveAttribute('tabindex', '0');
    expect(dashboardItem).toHaveAttribute('tabindex', '-1');

    fireEvent.keyDown(projectsItem, { key: 'ArrowUp' });
    expect(dashboardItem).toHaveFocus();
    expect(dashboardItem).toHaveAttribute('tabindex', '0');
    expect(projectsItem).toHaveAttribute('tabindex', '-1');
  });

  it('moves focus with Home and End keys', () => {
    render(<AppSidebar />);
    const dashboardItem = screen.getByTestId('sidebar-item-Dashboard');
    const projectsItem = screen.getByTestId('sidebar-item-Projects');

    fireEvent.keyDown(projectsItem, { key: 'Home' });
    expect(dashboardItem).toHaveFocus();
    expect(dashboardItem).toHaveAttribute('tabindex', '0');
    expect(projectsItem).toHaveAttribute('tabindex', '-1');

    fireEvent.keyDown(dashboardItem, { key: 'End' });
    expect(projectsItem).toHaveFocus();
    expect(projectsItem).toHaveAttribute('tabindex', '0');
    expect(dashboardItem).toHaveAttribute('tabindex', '-1');
  });

  it('activates link on Enter key', () => {
    const mockClick = jest.fn();
    (usePathname as jest.Mock).mockReturnValue('/'); // Ensure pathname is set for the test
    render(<AppSidebar />);
    const dashboardItem = screen.getByTestId('sidebar-item-Dashboard');
    const dashboardLink = screen.getByTestId('sidebar-item-link-Dashboard');
    dashboardLink.onclick = mockClick;
    fireEvent.keyDown(dashboardItem, { key: 'Enter' });
    expect(mockClick).toHaveBeenCalled();
  });
});
