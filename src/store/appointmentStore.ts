import { create } from 'zustand';
import { Appointment } from '../types';
import axios from 'axios';

interface AppointmentState {
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;
}

interface AppointmentStore extends AppointmentState {
  fetchAppointments: () => Promise<void>;
  createAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateAppointment: (id: string, updates: Partial<Appointment>) => Promise<void>;
  cancelAppointment: (id: string) => Promise<void>;
}

const useAppointmentStore = create<AppointmentStore>((set, get) => ({
  appointments: [],
  isLoading: false,
  error: null,

  fetchAppointments: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('/api/appointments');
      set({ appointments: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch appointments', 
        isLoading: false 
      });
    }
  },

  createAppointment: async (appointment) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('/api/appointments', appointment);
      set({ 
        appointments: [...get().appointments, response.data],
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create appointment', 
        isLoading: false 
      });
    }
  },

  updateAppointment: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`/api/appointments/${id}`, updates);
      set({ 
        appointments: get().appointments.map(app => 
          app.id === id ? { ...app, ...response.data } : app
        ),
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update appointment', 
        isLoading: false 
      });
    }
  },

  cancelAppointment: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`/api/appointments/${id}/cancel`);
      set({ 
        appointments: get().appointments.map(app => 
          app.id === id ? { ...app, status: 'cancelled' } : app
        ),
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to cancel appointment', 
        isLoading: false 
      });
    }
  }
}));

export default useAppointmentStore;