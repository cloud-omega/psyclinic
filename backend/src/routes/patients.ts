import express from 'express';
import passport from 'passport';
import { body, validationResult } from 'express-validator';

// Import user model
import User from '../models/user';

const router = express.Router();

// Auth middleware
const auth = passport.authenticate('jwt', { session: false });

// Get all patients (for psychologists only)
router.get('/', auth, async (req, res) => {
  try {
    const userRole = req.user.role;
    
    if (userRole !== 'psychologist' && userRole !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const patients = await User.findAll({
      where: { role: 'patient' },
      attributes: { exclude: ['password', 'googleId', 'facebookId', 'linkedinId'] }
    });
    
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get patient by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const patientId = req.params.id;
    const userRole = req.user.role;
    
    if (userRole !== 'psychologist' && userRole !== 'admin' && req.user.id !== patientId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const patient = await User.findOne({
      where: { id: patientId, role: 'patient' },
      attributes: { exclude: ['password', 'googleId', 'facebookId', 'linkedinId'] }
    });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update patient profile
router.put('/:id', auth, async (req, res) => {
  try {
    const patientId = req.params.id;
    const userRole = req.user.role;
    
    // Only allow users to update their own profile or admins
    if (req.user.id !== patientId && userRole !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const patient = await User.findOne({
      where: { id: patientId, role: 'patient' }
    });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Update allowed fields
    const { name, profilePicture, phoneNumber, dateOfBirth, emergencyContact } = req.body;
    
    const updatedPatient = await patient.update({
      name: name || patient.name,
      profilePicture: profilePicture || patient.profilePicture,
      phoneNumber: phoneNumber || patient.phoneNumber,
      dateOfBirth: dateOfBirth || patient.dateOfBirth,
      emergencyContact: emergencyContact || patient.emergencyContact
    });
    
    // Remove sensitive fields
    const patientData = updatedPatient.toJSON();
    delete patientData.password;
    delete patientData.googleId;
    delete patientData.facebookId;
    delete patientData.linkedinId;
    
    res.json(patientData);
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;