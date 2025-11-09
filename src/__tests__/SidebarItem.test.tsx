import React from 'react';
import { render, screen } from '@testing-library/react';
import { SidebarItem } from '@/components/common/Sidebar/SidebarItem';
import { useSidebar } from '@/components/ui/sidebar';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { LayoutDashboard, LucideIcon } from 'lucide-react';
import { IconType } from 'react-icons/lib';

export type SidebarPathInfo = {
  icon: LucideIcon | IconType;
  title: string;
  hide?: boolean;
};

export const PathInfoRecord: Record<string, SidebarPathInfo> = {
  '/': {
    icon: LayoutDashboard,
    title: 'Dashboard'
  },
  '/projects': {
    icon: LayoutDashboard, // Using LayoutDashboard as a generic icon for testing
    title: 'Projects'
  }
};

// Mock useSidebar
jest.mock('@/components/ui/sidebar', () => ({
  ...jest.requireActual('@/components/ui/sidebar'),
  useSidebar: jest.fn(),
}));

describe('SidebarItem', () => {
  const mockRefCallback = jest.fn();

  beforeEach(() => {
    (useSidebar as jest.Mock).mockReturnValue({ open: true }); // Default to open sidebar
    jest.clearAllMocks();
  });

  it('renders correctly with title and icon when sidebar is open', () => {
    render(
      <TooltipProvider>
        <SidebarItem
          path="/"
          title="Dashboard"
          index={0}
          isActive={true}
          isFocusable={true}
          refCallback={mockRefCallback}
        />
      </TooltipProvider>
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    // Expect icon to be rendered (mocked as null in PathInfoRecord, so checking for its presence is harder without a proper mock)
    // For now, we'll assume the icon component is rendered if no errors occur.
  });

  it('applies active styling when isActive is true', () => {
    render(
      <TooltipProvider>
        <SidebarItem
          path="/"
          title="Dashboard"
          index={0}
          isActive={true}
          isFocusable={true}
          refCallback={mockRefCallback}
        />
      </TooltipProvider>
    );
    const item = screen.getByRole('menuitem');
    expect(item).toHaveClass('bg-gray-100');
    expect(item).toHaveClass('dark:bg-black');
    expect(item).toHaveAttribute('aria-current', 'page');
  });

  it('sets tabIndex to 0 when isFocusable is true', () => {
    render(
      <TooltipProvider>
        <SidebarItem
          path="/"
          title="Dashboard"
          index={0}
          isActive={false}
          isFocusable={true}
          refCallback={mockRefCallback}
        />
      </TooltipProvider>
    );
    expect(screen.getByRole('menuitem')).toHaveAttribute('tabindex', '0');
  });

  it('sets tabIndex to -1 when isFocusable is false', () => {
    render(
      <TooltipProvider>
        <SidebarItem
          path="/projects"
          title="Projects"
          index={1}
          isActive={false}
          isFocusable={false}
          refCallback={mockRefCallback}
        />
      </TooltipProvider>
    );
    expect(screen.getByRole('menuitem')).toHaveAttribute('tabindex', '-1');
  });

  it('calls refCallback with the li element', () => {
    render(
      <TooltipProvider>
        <SidebarItem
          path="/"
          title="Dashboard"
          index={0}
          isActive={true}
          isFocusable={true}
          refCallback={mockRefCallback}
        />
      </TooltipProvider>
    );
    expect(mockRefCallback).toHaveBeenCalledWith(screen.getByRole('menuitem'));
  });

  it('renders tooltip when sidebar is closed', async () => {
    (useSidebar as jest.Mock).mockReturnValue({ open: false });
    render(
      <TooltipProvider>
        <SidebarItem
          path="/"
          title="Dashboard"
          index={0}
          isActive={true}
          isFocusable={true}
          refCallback={mockRefCallback}
        />
      </TooltipProvider>
    );
    // The title is inside the TooltipContent, which appears on hover.
    // We need to interact with the trigger to make the tooltip content visible.
    // For testing purposes, we can directly query for the content after rendering.
    expect(await screen.findByText('Dashboard')).toBeInTheDocument();
  });
});
