import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs } from '../components/common/Tabs';
import { FaHome, FaCog } from 'react-icons/fa';

describe('Tabs', () => {
  const mockTabs = [
    { id: 'home', label: 'Home', icon: FaHome, href: '/home' },
    { id: 'settings', label: 'Settings', icon: FaCog, href: '/settings' },
    { id: 'profile', label: 'Profile', icon: FaHome }, // No href for button tab
  ];

  it('renders tabs correctly with active tab', () => {
    render(<Tabs activeTab="home" tabs={mockTabs} />);

    const homeTab = screen.getByRole('tab', { name: /home/i });
    const settingsTab = screen.getByRole('tab', { name: /settings/i });

    expect(homeTab).toBeInTheDocument();
    expect(settingsTab).toBeInTheDocument();
    expect(homeTab).toHaveAttribute('aria-selected', 'true');
    expect(settingsTab).toHaveAttribute('aria-selected', 'false');
    expect(homeTab).toHaveAttribute('tabindex', '0');
    expect(settingsTab).toHaveAttribute('tabindex', '-1');
  });

  it('navigates with ArrowRight key', () => {
    render(<Tabs activeTab="home" tabs={mockTabs} />);
    const homeTab = screen.getByRole('tab', { name: /home/i });
    const settingsTab = screen.getByRole('tab', { name: /settings/i });

    homeTab.focus();
    fireEvent.keyDown(homeTab, { key: 'ArrowRight' });

    expect(settingsTab).toHaveFocus();
  });

  it('navigates with ArrowLeft key', () => {
    render(<Tabs activeTab="settings" tabs={mockTabs} />);
    const homeTab = screen.getByRole('tab', { name: /home/i });
    const settingsTab = screen.getByRole('tab', { name: /settings/i });

    settingsTab.focus();
    fireEvent.keyDown(settingsTab, { key: 'ArrowLeft' });

    expect(homeTab).toHaveFocus();
  });

  it('navigates to the first tab with Home key', () => {
    render(<Tabs activeTab="settings" tabs={mockTabs} />);
    const homeTab = screen.getByRole('tab', { name: /home/i });
    const settingsTab = screen.getByRole('tab', { name: /settings/i });

    settingsTab.focus();
    fireEvent.keyDown(settingsTab, { key: 'Home' });

    expect(homeTab).toHaveFocus();
  });

  it('navigates to the last tab with End key', () => {
    render(<Tabs activeTab="home" tabs={mockTabs} />);
    const homeTab = screen.getByRole('tab', { name: /home/i });
    const profileTab = screen.getByRole('tab', { name: /profile/i });

    homeTab.focus();
    fireEvent.keyDown(homeTab, { key: 'End' });

    expect(profileTab).toHaveFocus();
  });

  it('wraps around when navigating right from the last tab', () => {
    render(<Tabs activeTab="profile" tabs={mockTabs} />);
    const homeTab = screen.getByRole('tab', { name: /home/i });
    const profileTab = screen.getByRole('tab', { name: /profile/i });

    profileTab.focus();
    fireEvent.keyDown(profileTab, { key: 'ArrowRight' });

    expect(homeTab).toHaveFocus();
  });

  it('wraps around when navigating left from the first tab', () => {
    render(<Tabs activeTab="home" tabs={mockTabs} />);
    const homeTab = screen.getByRole('tab', { name: /home/i });
    const profileTab = screen.getByRole('tab', { name: /profile/i });

    homeTab.focus();
    fireEvent.keyDown(homeTab, { key: 'ArrowLeft' });

    expect(profileTab).toHaveFocus();
  });
});