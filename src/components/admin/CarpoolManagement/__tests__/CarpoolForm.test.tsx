import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CarpoolForm from '../CarpoolForm';

const mockOnSubmit = jest.fn();
const mockAftereventWeeks = ['Fall Week 1', 'Fall Week 2', 'Winter Week 1'];

const defaultProps = {
  onSubmit: mockOnSubmit,
  aftereventWeeks: mockAftereventWeeks,
  loading: false,
};

describe('CarpoolForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(<CarpoolForm {...defaultProps} />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/can drive/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/afterevent week/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add signup/i })).toBeInTheDocument();
  });

  it('shows capacity field when user can drive', async () => {
    render(<CarpoolForm {...defaultProps} />);
    
    const canDriveSelect = screen.getByLabelText(/can drive/i);
    await userEvent.selectOptions(canDriveSelect, 'yes');
    
    expect(screen.getByLabelText(/capacity/i)).toBeInTheDocument();
  });

  it('hides capacity field when user cannot drive', async () => {
    render(<CarpoolForm {...defaultProps} />);
    
    const canDriveSelect = screen.getByLabelText(/can drive/i);
    await userEvent.selectOptions(canDriveSelect, 'no');
    
    expect(screen.queryByLabelText(/capacity/i)).not.toBeInTheDocument();
  });

  it('shows edit mode when initialValues are provided', () => {
    const initialValues = {
      name: 'John Doe',
      phone: '123-456-7890',
      canDrive: 'yes' as const,
      capacity: '4',
      location: 'Middle Earth',
      aftereventWeek: 'Fall Week 1',
    };
    
    render(<CarpoolForm {...defaultProps} initialValues={initialValues} />);
    
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123-456-7890')).toBeInTheDocument();
  });

  it('calls onSubmit with correct data when form is submitted', async () => {
    render(<CarpoolForm {...defaultProps} />);
    
    // Fill out the form
    await userEvent.type(screen.getByLabelText(/name/i), 'Jane Smith');
    await userEvent.type(screen.getByLabelText(/phone/i), '555-123-4567');
    await userEvent.selectOptions(screen.getByLabelText(/can drive/i), 'yes');
    await userEvent.type(screen.getByLabelText(/capacity/i), '3');
    await userEvent.type(screen.getByLabelText(/location/i), 'Mesa Court');
    await userEvent.selectOptions(screen.getByLabelText(/afterevent week/i), 'Fall Week 1');
    
    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: /add signup/i }));
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Jane Smith',
        phone: '555-123-4567',
        canDrive: 'yes',
        capacity: '3',
        location: 'Mesa Court',
        aftereventWeek: 'Fall Week 1',
        submittedAt: expect.any(String),
      });
    });
  });

  it('shows validation error for missing required fields', async () => {
    render(<CarpoolForm {...defaultProps} />);
    // Try to submit without filling required fields
    await userEvent.click(screen.getByRole('button', { name: /add signup/i }));
    await waitFor(() => {
      screen.debug();
      expect(screen.getByTestId('error-message')).toHaveTextContent(/please fill in all required fields/i);
    });
  });

  it('shows validation error for invalid capacity when user can drive', async () => {
    render(<CarpoolForm {...defaultProps} />);
    // Fill out form but with invalid capacity
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/phone/i), '555-123-4567');
    await userEvent.selectOptions(screen.getByLabelText(/can drive/i), 'yes');
    await userEvent.type(screen.getByLabelText(/capacity/i), 'invalid');
    await userEvent.type(screen.getByLabelText(/location/i), 'Middle Earth');
    await userEvent.selectOptions(screen.getByLabelText(/afterevent week/i), 'Fall Week 1');
    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: /add signup/i }));
    await waitFor(() => {
      screen.debug();
      expect(screen.getByTestId('error-message')).toHaveTextContent(/please enter a valid capacity for drivers/i);
    });
  });

  it('shows loading state when loading prop is true', () => {
    render(<CarpoolForm {...defaultProps} loading={true} />);
    
    expect(screen.getByRole('button', { name: /adding/i })).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows success message after successful submission', async () => {
    mockOnSubmit.mockResolvedValueOnce(undefined);
    
    render(<CarpoolForm {...defaultProps} />);
    
    // Fill out the form
    await userEvent.type(screen.getByLabelText(/name/i), 'Jane Smith');
    await userEvent.type(screen.getByLabelText(/phone/i), '555-123-4567');
    await userEvent.selectOptions(screen.getByLabelText(/can drive/i), 'no');
    await userEvent.type(screen.getByLabelText(/location/i), 'Mesa Court');
    await userEvent.selectOptions(screen.getByLabelText(/afterevent week/i), 'Fall Week 1');
    
    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: /add signup/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/signup saved/i)).toBeInTheDocument();
    });
  });

  it('shows error message when onSubmit throws an error', async () => {
    const errorMessage = 'Failed to save signup';
    mockOnSubmit.mockRejectedValueOnce(new Error(errorMessage));
    
    render(<CarpoolForm {...defaultProps} />);
    
    // Fill out the form
    await userEvent.type(screen.getByLabelText(/name/i), 'Jane Smith');
    await userEvent.type(screen.getByLabelText(/phone/i), '555-123-4567');
    await userEvent.selectOptions(screen.getByLabelText(/can drive/i), 'no');
    await userEvent.type(screen.getByLabelText(/location/i), 'Mesa Court');
    await userEvent.selectOptions(screen.getByLabelText(/afterevent week/i), 'Fall Week 1');
    
    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: /add signup/i }));
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('resets form after successful submission', async () => {
    mockOnSubmit.mockResolvedValueOnce(undefined);
    
    render(<CarpoolForm {...defaultProps} />);
    
    // Fill out the form
    await userEvent.type(screen.getByLabelText(/name/i), 'Jane Smith');
    await userEvent.type(screen.getByLabelText(/phone/i), '555-123-4567');
    await userEvent.selectOptions(screen.getByLabelText(/can drive/i), 'no');
    await userEvent.type(screen.getByLabelText(/location/i), 'Mesa Court');
    await userEvent.selectOptions(screen.getByLabelText(/afterevent week/i), 'Fall Week 1');
    
    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: /add signup/i }));
    
    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toHaveValue('');
      expect(screen.getByLabelText(/phone/i)).toHaveValue('');
      expect(screen.getByLabelText(/location/i)).toHaveValue('');
    });
  });

  it('updates form when initialValues change', async () => {
    const { rerender } = render(<CarpoolForm {...defaultProps} />);
    
    // Initially empty
    expect(screen.getByLabelText(/name/i)).toHaveValue('');
    
    // Update with initial values
    const initialValues = {
      name: 'John Doe',
      phone: '123-456-7890',
      canDrive: 'no' as const,
      location: 'Middle Earth',
      aftereventWeek: 'Fall Week 1',
    };
    
    rerender(<CarpoolForm {...defaultProps} initialValues={initialValues} />);
    
    expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/phone/i)).toHaveValue('123-456-7890');
  });
}); 