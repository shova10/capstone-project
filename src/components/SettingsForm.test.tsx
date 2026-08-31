import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SettingsForm } from './SettingsForm';

describe('SettingsForm', () => {
  it('renders all form fields', () => {
    render(<SettingsForm />);
    
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/preferred language/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subscribe to newsletter/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/light/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dark/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/system/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save settings/i })).toBeInTheDocument();
  });

  it('shows validation errors for invalid input', async () => {
    render(<SettingsForm />);
    
    const submitButton = screen.getByRole('button', { name: /save settings/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/username must be at least 3 characters/i)).toBeInTheDocument();
    expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument();
  });

  it('shows error for long username', async () => {
    render(<SettingsForm />);
    
    const usernameInput = screen.getByLabelText(/username/i);
    fireEvent.change(usernameInput, { target: { value: 'a'.repeat(21) } });
    
    const submitButton = screen.getByRole('button', { name: /save settings/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/username must be at most 20 characters/i)).toBeInTheDocument();
  });

  it('submits the form with valid data', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<SettingsForm />);
    
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'johndoe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/bio/i), { target: { value: 'Hello world' } });
    fireEvent.change(screen.getByLabelText(/preferred language/i), { target: { value: 'fr' } });
    fireEvent.click(screen.getByLabelText(/subscribe to newsletter/i));
    fireEvent.click(screen.getByLabelText(/dark/i));

    const submitButton = screen.getByRole('button', { name: /save settings/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Form Submitted:', expect.objectContaining({
        username: 'johndoe',
        email: 'john@example.com',
        bio: 'Hello world',
        language: 'fr',
        newsletter: true,
        theme: 'dark',
      }));
    });

    expect(window.alert).toHaveBeenCalledWith('Settings saved successfully!');
  });
});
