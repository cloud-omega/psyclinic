import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../ui/Button';
import Input from '../ui/Input';
import useAppointmentStore from '../../store/appointmentStore';
import { format } from 'date-fns';

const appointmentSchema = z.object({
  psychologistId: z.string().min(1, 'Please select a psychologist'),
  patientId: z.string().min(1, 'Please select a patient'),
  date: z.string().min(1, 'Please select a date'),
  startTime: z.string().min(1, 'Please select a start time'),
  duration: z.number().min(30, 'Minimum duration is 30 minutes').max(120, 'Maximum duration is 120 minutes'),
  notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  onSuccess?: () => void;
  psychologistId?: string;
  patientId?: string;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ 
  onSuccess,
  psychologistId,
  patientId
}) => {
  const { createAppointment, isLoading, error } = useAppointmentStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      psychologistId: psychologistId || '',
      patientId: patientId || '',
      duration: 60,
    }
  });

  const onSubmit = async (data: AppointmentFormValues) => {
    // Calculate end time based on start time and duration
    const [hours, minutes] = data.startTime.split(':').map(Number);
    const startDate = new Date(`${data.date}T${data.startTime}`);
    const endDate = new Date(startDate.getTime() + data.duration * 60000);
    
    await createAppointment({
      psychologistId: data.psychologistId,
      patientId: data.patientId,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      status: 'scheduled',
      paymentStatus: 'pending',
      notes: data.notes,
    });
    
    reset();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Schedule New Appointment</h2>
      
      {error && (
        <div className="p-3 mb-4 text-sm text-red-600 bg-red-100 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {!psychologistId && (
          <div>
            <Input
              {...register('psychologistId')}
              label="Psychologist"
              placeholder="Select psychologist"
              fullWidth
              error={errors.psychologistId?.message}
            />
          </div>
        )}
        
        {!patientId && (
          <div>
            <Input
              {...register('patientId')}
              label="Patient"
              placeholder="Select patient"
              fullWidth
              error={errors.patientId?.message}
            />
          </div>
        )}
        
        <div>
          <Input
            {...register('date')}
            type="date"
            label="Date"
            min={format(new Date(), 'yyyy-MM-dd')}
            fullWidth
            error={errors.date?.message}
          />
        </div>
        
        <div>
          <Input
            {...register('startTime')}
            type="time"
            label="Start Time"
            fullWidth
            error={errors.startTime?.message}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration (minutes)
          </label>
          <select
            {...register('duration', { valueAsNumber: true })}
            className="block w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-transparent focus:outline-none focus:ring-2"
          >
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>60 minutes</option>
            <option value={90}>90 minutes</option>
            <option value={120}>120 minutes</option>
          </select>
          {errors.duration && (
            <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (optional)
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className="block w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-transparent focus:outline-none focus:ring-2"
            placeholder="Add any notes or special instructions"
          />
        </div>
        
        <div className="pt-4">
          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
          >
            Schedule Appointment
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;