import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import './SettingsForm.css';

const settingsSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must be at most 20 characters'),
  email: z.string().email('Invalid email address'),
  bio: z.string().max(160, 'Bio must be at most 160 characters').optional(),
  language: z.enum(['en', 'es', 'fr']),
  newsletter: z.boolean().default(false),
  theme: z.enum(['light', 'dark', 'system']),
});

type SettingsValues = z.infer<typeof settingsSchema>;

export const SettingsForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      username: '',
      email: '',
      bio: '',
      language: 'en',
      newsletter: false,
      theme: 'system',
    },
  });

  const onSubmit = (data: SettingsValues) => {
    console.log('Form Submitted:', data);
    alert('Settings saved successfully!');
  };

  return (
    <div className="settings-container">
      <h2>Account Settings</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="settings-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            {...register('username')}
            className={errors.username ? 'error' : ''}
          />
          {errors.username && <span className="error-message">{errors.username.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio (Optional)</label>
          <textarea
            id="bio"
            {...register('bio')}
            className={errors.bio ? 'error' : ''}
            rows={3}
          />
          {errors.bio && <span className="error-message">{errors.bio.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="language">Preferred Language</label>
          <select id="language" {...register('language')} className={errors.language ? 'error' : ''}>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
          {errors.language && <span className="error-message">{errors.language.message}</span>}
        </div>

        <div className="form-group checkbox">
          <label>
            <input type="checkbox" {...register('newsletter')} />
            Subscribe to newsletter
          </label>
        </div>

        <div className="form-group radio-group">
          <label>Theme Preference</label>
          <div className="radio-options">
            <label>
              <input type="radio" value="light" {...register('theme')} />
              Light
            </label>
            <label>
              <input type="radio" value="dark" {...register('theme')} />
              Dark
            </label>
            <label>
              <input type="radio" value="system" {...register('theme')} />
              System
            </label>
          </div>
          {errors.theme && <span className="error-message">{errors.theme.message}</span>}
        </div>

        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};
