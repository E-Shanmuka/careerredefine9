import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

interface QueryFormData {
  subject: string;
  message: string;
  course?: string;
  phone?: string;
  name?: string;
  email?: string;
}

interface QueryFormProps {
  courseId?: string;
  courseName?: string;
  defaultSubject?: string;
  onSuccess?: () => void;
  className?: string;
}

const QueryForm: React.FC<QueryFormProps> = ({ courseId, courseName, defaultSubject, onSuccess, className = '' }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QueryFormData>({
    defaultValues: {
      name: (user as any)?.name || '',
      email: (user as any)?.email || '',
    }
  });

  const onSubmit: SubmitHandler<QueryFormData> = async (data) => {
    try {
      setIsSubmitting(true);
      setSubmitError('');
      
      const payload = {
        ...data,
        ...(courseId && { course: courseId }),
      };

      await api.post('/api/v1/queries', payload);
      
      setSubmitSuccess(true);
      reset();
      if (onSuccess) onSuccess();
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || 'Failed to submit query. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
      <h2 className="text-xl font-semibold mb-4">Have a Question?</h2>
      
      {submitSuccess && (
        <div className="mb-4 w-full max-w-sm">
          <div className="rounded-xl border border-green-200 shadow-sm bg-white">
            <div className="p-4 flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700 text-lg">✓</div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Query sent successfully</p>
                <p className="text-sm text-gray-600 mt-1">
                  Thanks! Your message was sent to careerRedefine. We\'ll get back to you shortly. An admin has also been notified.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {submitError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {submitError}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {courseName && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Course</label>
            <input
              type="text"
              value={courseName}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-200 bg-gray-50 text-gray-700 shadow-sm"
            />
          </div>
        )}
        {/* Always show Name and Email; prefill from user if available */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Your Name *
          </label>
          <input
            type="text"
            id="name"
            defaultValue={(user as any)?.name || ''}
            {...register('name', { required: 'Name is required' })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : ''
            }`}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email *
          </label>
          <input
            type="email"
            id="email"
            defaultValue={(user as any)?.email || ''}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : ''
            }`}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone (Optional)
          </label>
          <input
            type="tel"
            id="phone"
            {...register('phone')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            defaultValue={defaultSubject || (courseName ? `Query about ${courseName}` : '')}
            {...register('subject', { required: 'Subject is required' })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.subject ? 'border-red-500' : ''
            }`}
            disabled={isSubmitting}
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Your Message *
          </label>
          <textarea
            id="message"
            rows={4}
            {...register('message', { required: 'Message is required' })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.message ? 'border-red-500' : ''
            }`}
            disabled={isSubmitting}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
          )}
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Query'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QueryForm;
