import express from 'passport';
import passport from 'passport';
import { body, validationResult } from 'express-validator';
import mercadopago from 'mercadopago';

// Import models
import Payment from '../models/payment';
import Appointment from '../models/appointment';

const router = express.Router();

// Auth middleware
const auth = passport.authenticate('jwt', { session: false });

// Initialize Mercado Pago
mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN || ''
});

// Create a payment for an appointment
router.post('/', auth, [
  body('appointmentId').notEmpty().withMessage('Appointment ID is required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('currency').isIn(['ARS', 'BRL', 'CLP', 'MXN', 'COP', 'PEN', 'UYU']).withMessage('Invalid currency')
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { appointmentId, amount, currency } = req.body;
    const userId = req.user.id;
    
    // Find the appointment
    const appointment = await Appointment.findByPk(appointmentId);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check if the user is authorized to create this payment
    if (appointment.patientId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Create Mercado Pago preference
    const preference = {
      items: [
        {
          title: `Appointment on ${new Date(appointment.startTime).toLocaleDateString()}`,
          quantity: 1,
          currency_id: currency,
          unit_price: amount
        }
      ],
      back_urls: {
        success: `${process.env.FRONTEND_URL}/payments/success`,
        failure: `${process.env.FRONTEND_URL}/payments/failure`,
        pending: `${process.env.FRONTEND_URL}/payments/pending`
      },
      auto_return: 'approved',
      external_reference: appointmentId
    };
    
    const response = await mercadopago.preferences.create(preference);
    
    // Create payment record
    const payment = await Payment.create({
      appointmentId,
      amount,
      currency,
      status: 'pending',
      paymentMethod: 'mercado_pago',
      preferenceId: response.body.id
    });
    
    res.json({
      id: payment.id,
      preferenceId: response.body.id,
      initPoint: response.body.init_point
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mercado Pago webhook
router.post('/webhook', async (req, res) => {
  try {
    const { type, data } = req.body;
    
    if (type === 'payment') {
      const paymentId = data.id;
      
      // Get payment details from Mercado Pago
      const mpPayment = await mercadopago.payment.get(paymentId);
      const appointmentId = mpPayment.body.external_reference;
      const status = mpPayment.body.status;
      
      // Update payment status
      const payment = await Payment.findOne({
        where: { appointmentId }
      });
      
      if (payment) {
        let paymentStatus;
        
        if (status === 'approved') {
          paymentStatus = 'paid';
        } else if (status === 'refunded') {
          paymentStatus = 'refunded';
        } else {
          paymentStatus = 'pending';
        }
        
        await payment.update({
          status: paymentStatus,
          transactionId: paymentId,
          receiptUrl: mpPayment.body.transaction_details?.external_resource_url
        });
        
        // Update appointment payment status
        await Appointment.update(
          { paymentStatus },
          { where: { id: appointmentId } }
        );
      }
    }
    
    res.status(200).end();
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).end();
  }
});

// Get payment history for the current user
router.get('/history', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    let payments;
    
    if (userRole === 'psychologist') {
      // Get payments for appointments where the user is the psychologist
      payments = await Payment.findAll({
        include: [
          {
            model: Appointment,
            where: { psychologistId: userId },
            required: true
          }
        ],
        order: [['createdAt', 'DESC']]
      });
    } else if (userRole === 'patient') {
      // Get payments for appointments where the user is the patient
      payments = await Payment.findAll({
        include: [
          {
            model: Appointment,
            where: { patientId: userId },
            required: true
          }
        ],
        order: [['createdAt', 'DESC']]
      });
    } else {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;