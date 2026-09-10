import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SettingsForm } from './SettingsForm';

describe('SettingsForm', () => {
  it('renders all form fields and labels', () => {
    render(<SettingsForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByText(/notification frequency/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/daily/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/weekly/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/never/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save settings/i })).toBeInTheDocument();
  });

  it('shows validation errors for invalid input', async () => {
    const user = userEvent.setup();
    render(<SettingsForm onSubmit={vi.fn()} />);

    const submitButton = screen.getByRole('button', { name: /save settings/i });
    
    // Clear name and trigger validation
    const nameInput = screen.getByLabelText(/full name/i);
    await user.clear(nameInput);
    await user.click(submitButton);

    expect(await screen.findByText(/full name must be at least 2 characters/i)).toBeInTheDocument();
    expect(await screen.findByText(/invalid email format/i)).toBeInTheDocument();
  });

  it('calls onSubmit with correct data when form is valid', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<SettingsForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.click(screen.getByLabelText(/weekly/i));
    await user.click(screen.getByRole('button', { name: /save settings/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        fullName: 'John Doe',
        email: 'john@example.com',
        notificationFrequency: 'weekly',
      });
    });
  });

  it('associates error messages with inputs via aria-describedby', async () => {
    const user = userEvent.setup();
    render(<SettingsForm onSubmit={vi.fn()} />);

    const submitButton = screen.getByRole('button', { name: /save settings/i });
    await user.click(submitButton);

    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);

    await waitFor(() => {
      expect(nameInput).toHaveAttribute('aria-describedby', 'fullName-error');
      expect(emailInput).toHaveAttribute('aria-describedby', 'email-error');
    });

    expect(screen.getByText(/full name must be at least 2 characters/i)).toHaveAttribute('id', 'fullName-error');
    expect(screen.getByText(/invalid email format/i)).toHaveAttribute('id', 'email-error');
  });

  it('sets aria-invalid correctly on error', async () => {
    const user = userEvent.setup();
    render(<SettingsForm onSubmit={vi.fn()} />);

    const nameInput = screen.getByLabelText(/full name/i);
    expect(nameInput).toHaveAttribute('aria-invalid', 'false');

    const submitButton = screen.getByRole('button', { name: /save settings/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    });
  });
});
