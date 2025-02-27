import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import useAppointmentStore from '../../store/appointmentStore';
import Button from '../ui/Button';
import { Calendar, Clock, User, DollarSign, FileText } from 'lucide-react';
import { Appointment } from '../../types';

const AppointmentList: React.FC = () => {
  const { appointments, fetchAppointments, cancelAppointment, isLoading, error } = useAppointmentStore();
  const [filter, setFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);
  
  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.startTime);
    const now = new Date();
    
    if (filter === 'upcoming') {
      return appointmentDate > now && appointment.status !== 'cancelled';
    } else if (filter === 'past') {
      return appointmentDate < now || appointment.status === 'completed' || appointment.status === 'no-show';
    }
    return true;
  });
  
  const handleCancel = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      await cancelAppointment(id);
    }
  };
  
  const getStatusBadge = (status: Appointment['status']) => {
    const statusStyles = {
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      'no-show': 'bg-yellow-100 text-yellow-800',
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  
  const getPaymentBadge = (status: Appointment['paymentStatus']) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  
  if (isLoading && appointments.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded-md">
        Error loading appointments: {error}
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Appointments</h2>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant={filter === 'upcoming' ? 'primary' : 'outline'}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming
            </Button>
            <Button 
              size="sm" 
              variant={filter === 'past' ? 'primary' : 'outline'}
              onClick={() => setFilter('past')}
            >
              Past
            </Button>
            <Button 
              size="sm" 
              variant={filter === 'all' ? 'primary' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All
            </Button>
          </div>
        </div>
      </div>
      
      {filteredAppointments.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No appointments found.
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-2">
                    <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="font-medium">
                      {format(new Date(appointment.startTime), 'EEEE, MMMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    <Clock className="w-5 h-5 text-gray-500 mr-2" />
                    <span>
                      {format(new Date(appointment.startTime), 'h:mm a')} - {format(new Date(appointment.endTime), 'h:mm a')}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    <User className="w-5 h-5 text-gray-500 mr-2" />
                    <span>Patient ID: {appointment.patientId}</span>
                  </div>
                  {appointment.notes && (
                    <div className="flex items-start mt-2">
                      <FileText className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                      <span className="text-gray-600">{appointment.notes}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex space-x-2">
                    {getStatusBadge(appointment.status)}
                    {getPaymentBadge(appointment.paymentStatus)}
                  </div>
                  
                  {appointment.status === 'scheduled' && new Date(appointment.startTime) > new Date() && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {/* Navigate to edit page */}}
                      >
                        Reschedule
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleCancel(appointment.id)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentList;