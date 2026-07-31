import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import './UserSettingsForm.css';

const userSettingsSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9]+$/, 'Username must be alphanumeric'),
  email: z.string().email('Invalid email address'),
  bio: z.string().max(160, 'Bio must be at most 160 characters').optional(),
  notifications: z.boolean().default(false),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[0-9]/, 'Password must include a number')
    .regex(/[^a-zA-Z0-9]/, 'Password must include a special character'),
  twoFactor: z.boolean().default(false),
});

type UserSettingsValues = z.infer<typeof userSettingsSchema>;

export const UserSettingsForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserSettingsValues>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: {
      notifications: false,
      twoFactor: false,
    },
  });

  const onSubmit = async (data: UserSettingsValues) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Form submitted:', data);
    alert('Settings saved successfully!');
  };

  return (
    <form className="user-settings-form" onSubmit={handleSubmit(onSubmit)}>
      <h2>User Settings</h2>

      <section>
        <h3>Basic Information</h3>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input id="username" {...register('username')} />
          {errors.username && <p className="error">{errors.username.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" {...register('email')} />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>
      </section>

      <section>
        <h3>Profile</h3>
        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea id="bio" {...register('bio')} />
          {errors.bio && <p className="error">{errors.bio.message}</p>}
        </div>

        <div className="form-group checkbox">
          <label>
            <input type="checkbox" {...register('notifications')} />
            Enable Notifications
          </label>
        </div>
      </section>

      <section>
        <h3>Security</h3>
        <div className="form-group">
          <label htmlFor="password">New Password</label>
          <input id="password" type="password" {...register('password')} />
          {errors.password && <p className="error">{errors.password.message}</p>}
        </div>

        <div className="form-group checkbox">
          <label>
            <input type="checkbox" {...register('twoFactor')} />
            Enable 2FA
          </label>
        </div>
      </section>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  );
};
