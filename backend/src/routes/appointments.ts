import express from 'express';
import passport from 'passport';
import { body, validationResult } from 'express-validator';

// Import appointment model (to be created)
import Appointment from '../models/appointment';

const router = express.Router();

// Auth middleware
const auth = passport.authenticate('jwt', { session: false });

// Validation middleware
const validateAppointment = [
  body('psychologistId').notEmpty().withMessage('Psychologist ID is required'),
  body('patientId').notEmpty().withMessage('Patient ID is required'),
  body('startTime').isISO8601().withMessage('Start time must be a valid date'),
  body('endTime').isISO8601().withMessage('End time must be a valid date')
];

// Get all appointments for the current user
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    let appointments;
    
    if (userRole === 'psychologist') {
      appointments = await Appointment.findAll({
        where: { psychologistId: userId },
        order: [['startTime', 'ASC']]
      });
    } else if (userRole === 'patient') {
      appointments = await Appointment.findAll({
        where: { patientId: userId },
        order: [['startTime', 'ASC']]
      });
    } else {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new appointment
router.post('/', auth, validateAppointment, async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { psychologistId, patientId, startTime, endTime, notes } = req.body;
    
    // Check if the user is authorized to create this appointment
    const userId = req.user.id;
    const userRole = req.user.role;
    
    if (userRole === 'psychologist' && psychologistId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    if (userRole === 'patient' && patientId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Create the appointment
    const appointment = await Appointment.create({
      psychologistId,
      patientId,
      startTime,
      endTime,
      status: 'scheduled',
      paymentStatus: 'pending',
      notes
    });
    
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an appointment
router.put('/:id', auth, async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    // Find the appointment
    const appointment = await Appointment.findByPk(appointmentId);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check if the user is authorized to update this appointment
    if (userRole === 'psychologist' && appointment.psychologistId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    if (userRole === 'patient' && appointment.patientId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Update the appointment
    const updatedAppointment = await appointment.update(req.body);
    
    res.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel an appointment
router.post('/:id/cancel', auth, async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    // Find the appointment
    const appointment = await Appointment.findByPk(appointmentId);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check if the user is authorized to cancel this appointment
    if (userRole === 'psychologist' && appointment.psychologistId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    if (userRole === 'patient' && appointment.patientId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Cancel the appointment
    await appointment.update({ status: 'cancelled' });
    
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;