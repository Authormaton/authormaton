import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterDropdown } from '@/components/common/Filter/FilterDropdown';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('FilterDropdown', () => {
  const mockUsePathname = usePathname as jest.Mock;
  const mockUseRouter = useRouter as jest.Mock;
  const mockUseSearchParams = useSearchParams as jest.Mock;

  const mockReplace = jest.fn();

  const paramName = 'status';
  const label = 'Status';
  const options = [
    { label: 'Active', value: 'active' },
    { label: 'Pending', value: 'pending' },
  ];

  beforeEach(() => {
    mockUsePathname.mockReturnValue('/some-path');
    mockUseRouter.mockReturnValue({ replace: mockReplace });
    mockUseSearchParams.mockReturnValue(new URLSearchParams()); // Start with empty search params
    jest.clearAllMocks();
  });

  it('renders correctly with initial "All" selection', () => {
    render(<FilterDropdown paramName={paramName} label={label} options={options} />);
    expect(screen.getByRole('button', { name: 'Status: All' })).toBeInTheDocument();
  });

  it('opens and closes the dropdown', () => {
    render(<FilterDropdown paramName={paramName} label={label} options={options} />);
    const triggerButton = screen.getByRole('button', { name: 'Status: All' });

    // Open dropdown
    fireEvent.click(triggerButton);
    expect(screen.getByText('Status')).toBeInTheDocument(); // DropdownMenuLabel
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();

    // Close dropdown by clicking the button again
    fireEvent.click(triggerButton);
    expect(screen.queryByText('Status')).not.toBeInTheDocument();
    expect(screen.queryByText('Active')).not.toBeInTheDocument();
  });

  it('selects an option and updates the button text and URL', () => {
    render(<FilterDropdown paramName={paramName} label={label} options={options} />);
    const triggerButton = screen.getByRole('button', { name: 'Status: All' });

    fireEvent.click(triggerButton); // Open dropdown
    fireEvent.click(screen.getByText('Active')); // Select 'Active'

    expect(screen.getByRole('button', { name: 'Status: Active' })).toBeInTheDocument();

    const expectedParams = new URLSearchParams();
    expectedParams.set(paramName, 'active');
    expect(mockReplace).toHaveBeenCalledWith(`/some-path?${expectedParams.toString()}`);
  });

  it('selects "All" and removes the parameter from the URL', () => {
    // Simulate an initial selected value in the URL
    mockUseSearchParams.mockReturnValue(new URLSearchParams('status=active'));

    render(<FilterDropdown paramName={paramName} label={label} options={options} />);
    const triggerButton = screen.getByRole('button', { name: 'Status: Active' });

    fireEvent.click(triggerButton); // Open dropdown
    fireEvent.click(screen.getByText('All')); // Select 'All'

    expect(screen.getByRole('button', { name: 'Status: All' })).toBeInTheDocument();

    const expectedParams = new URLSearchParams(); // Empty params
    expect(mockReplace).toHaveBeenCalledWith(`/some-path?${expectedParams.toString()}`);
  });

  it('initializes with a value from search params', () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('status=pending'));
    render(<FilterDropdown paramName={paramName} label={label} options={options} />);
    expect(screen.getByRole('button', { name: 'Status: Pending' })).toBeInTheDocument();
  });
});
