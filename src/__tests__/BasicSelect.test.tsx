import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BasicSelect } from '../components/common/BasicSelect';

describe('BasicSelect', () => {
  const mockItems = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
  ];

  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with placeholder and opens on click', async () => {
    render(
      <BasicSelect
        placeholder="Select an option"
        items={mockItems}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Select an option')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('allows selecting an option with click', async () => {
    render(
      <BasicSelect
        placeholder="Select an option"
        items={mockItems}
        onChange={mockOnChange}
      />
    );

    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByText('Option 2'));

    expect(mockOnChange).toHaveBeenCalledWith('2');
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument(); // Menu should close
    expect(screen.getByText('Option 2')).toBeInTheDocument(); // Selected value
  });

  it('navigates options with arrow keys and selects with Enter', async () => {
    render(
      <BasicSelect
        placeholder="Select an option"
        items={mockItems}
        onChange={mockOnChange}
      />
    );

    const combobox = screen.getByRole('combobox');
    await userEvent.click(combobox); // Open the select

    // Navigate down to Option 2
    fireEvent.keyDown(combobox, { key: 'ArrowDown' }); // Focus Option 1
    fireEvent.keyDown(combobox, { key: 'ArrowDown' }); // Focus Option 2

    // Select Option 2 with Enter
    fireEvent.keyDown(combobox, { key: 'Enter' });

    expect(mockOnChange).toHaveBeenCalledWith('2');
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument(); // Menu should close
    expect(screen.getByText('Option 2')).toBeInTheDocument(); // Selected value
  });

  it('closes the select with Escape key', async () => {
    render(
      <BasicSelect
        placeholder="Select an option"
        items={mockItems}
        onChange={mockOnChange}
      />
    );

    const combobox = screen.getByRole('combobox');
    await userEvent.click(combobox); // Open the select

    expect(screen.getByText('Option 1')).toBeInTheDocument(); // Menu is open

    fireEvent.keyDown(combobox, { key: 'Escape' });

    expect(screen.queryByText('Option 1')).not.toBeInTheDocument(); // Menu should close
  });

  it('should clear selection when allowEmpty is true and clear button is clicked', async () => {
    render(
      <BasicSelect
        placeholder="Select an option"
        items={mockItems}
        onChange={mockOnChange}
        value="1"
        allowEmpty={true}
      />
    );

    expect(screen.getByText('Option 1')).toBeInTheDocument();

    const clearButton = screen.getByRole('button', { name: /clear/i });
    await userEvent.click(clearButton);

    expect(mockOnChange).toHaveBeenCalledWith(null);
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });
});