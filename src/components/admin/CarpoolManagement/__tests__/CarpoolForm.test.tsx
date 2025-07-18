import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CarpoolForm from '../CarpoolForm';

// Only test what jsdom can reliably support: rendering and keyboard accessibility

describe('CarpoolForm', () => {
  it('renders all required fields and controls', () => {
    render(<CarpoolForm />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /grade\/year.*\*/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/afterevent week/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /location.*\*/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Yes')).toBeInTheDocument();
    expect(screen.getByLabelText('No')).toBeInTheDocument();
    expect(screen.getByLabelText('Self Drive')).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add carpool signup/i })).toBeInTheDocument();
  });

  it('is keyboard accessible for all main fields', async () => {
    render(<CarpoolForm />);
    const user = userEvent.setup();
    await user.tab(); // name
    expect(screen.getByLabelText(/name/i)).toHaveFocus();
    await user.tab(); // phone
    expect(screen.getByLabelText(/phone/i)).toHaveFocus();
    await user.tab(); // grade select
    expect(screen.getByRole('combobox', { name: /grade\/year.*\*/i })).toHaveFocus();
    await user.tab(); // afterevent week
    expect(screen.getByLabelText(/afterevent week/i)).toHaveFocus();
    await user.tab(); // location select
    expect(screen.getByRole('combobox', { name: /location.*\*/i })).toHaveFocus();
    await user.tab(); // can drive radio (first radio)
    expect(screen.getByLabelText('Yes')).toBeInTheDocument();
    await user.tab(); // notes
    expect(screen.getByLabelText(/notes/i)).toHaveFocus();
    await user.tab(); // submit button
    expect(screen.getByRole('button', { name: /add carpool signup/i })).toHaveFocus();
  });
}); 