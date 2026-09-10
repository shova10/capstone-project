import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  fullName: z.string().min(2, { message: 'Full Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email format' }),
  notificationFrequency: z.enum(['daily', 'weekly', 'never'], {
    errorMap: () => ({ message: 'Please select a notification frequency' }),
  }),
});

type FormData = z.infer<typeof schema>;

interface SettingsFormProps {
  onSubmit: (data: FormData) => void;
}

export const SettingsForm: React.FC<SettingsFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      notificationFrequency: 'daily',
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data))} noValidate>
      <div>
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          type="text"
          {...register('fullName')}
          aria-invalid={errors.fullName ? 'true' : 'false'}
          aria-describedby={errors.fullName ? 'fullName-error' : undefined}
        />
        {errors.fullName && (
          <span id="fullName-error" role="alert" style={{ color: 'red' }}>
            {errors.fullName.message}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email')}
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <span id="email-error" role="alert" style={{ color: 'red' }}>
            {errors.email.message}
          </span>
        )}
      </div>

      <fieldset>
        <legend>Notification Frequency</legend>
        <div>
          <input
            type="radio"
            id="daily"
            value="daily"
            {...register('notificationFrequency')}
          />
          <label htmlFor="daily">Daily</label>
        </div>
        <div>
          <input
            type="radio"
            id="weekly"
            value="weekly"
            {...register('notificationFrequency')}
          />
          <label htmlFor="weekly">Weekly</label>
        </div>
        <div>
          <input
            type="radio"
            id="never"
            value="never"
            {...register('notificationFrequency')}
          />
          <label htmlFor="never">Never</label>
        </div>
        {errors.notificationFrequency && (
          <span id="notificationFrequency-error" role="alert" style={{ color: 'red' }}>
            {errors.notificationFrequency.message}
          </span>
        )}
      </fieldset>

      <button type="submit">Save Settings</button>
    </form>
  );
};
