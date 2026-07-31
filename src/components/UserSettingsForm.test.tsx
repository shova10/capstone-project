import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { UserSettingsForm } from './UserSettingsForm';

describe('UserSettingsForm', () => {
  it('renders all form fields', () => {
    render(<UserSettingsForm />);
    
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/enable notifications/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/enable 2fa/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save settings/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    render(<UserSettingsForm />);
    
    fireEvent.click(screen.getByRole('button', { name: /save settings/i }));

    expect(await screen.findByText(/username must be at least 3 characters/i)).toBeInTheDocument();
    expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument();
    expect(await screen.findByText(/password must be at least 8 characters/i)).toBeInTheDocument();
  });

  it('shows error for invalid username (non-alphanumeric)', async () => {
    render(<UserSettingsForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/username/i), 'user!');
    fireEvent.click(screen.getByRole('button', { name: /save settings/i }));

    expect(await screen.findByText(/username must be alphanumeric/i)).toBeInTheDocument();
  });

  it('shows error for weak password', async () => {
    render(<UserSettingsForm />);
    const user = userEvent.setup();

    const passwordInput = screen.getByLabelText(/new password/i);
    const saveButton = screen.getByRole('button', { name: /save settings/i });

    // Test missing number
    await user.type(passwordInput, 'password!');
    fireEvent.click(saveButton);
    expect(await screen.findByText(/password must include a number/i)).toBeInTheDocument();

    // Test missing special character
    await user.clear(passwordInput);
    await user.type(passwordInput, 'password123');
    fireEvent.click(saveButton);
    expect(await screen.findByText(/password must include a special character/i)).toBeInTheDocument();
  });

  it('submits the form with valid data', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<UserSettingsForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/username/i), 'johndoe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/bio/i), 'This is my bio.');
    await user.click(screen.getByLabelText(/enable notifications/i));
    await user.type(screen.getByLabelText(/new password/i), 'Password123!');
    await user.click(screen.getByLabelText(/enable 2fa/i));

    fireEvent.click(screen.getByRole('button', { name: /save settings/i }));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Settings saved successfully!');
    }, { timeout: 3000 });

    alertMock.mockRestore();
  });
});
