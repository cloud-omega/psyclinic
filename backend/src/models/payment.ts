import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Appointment from './appointment';

interface PaymentAttributes {
  id: string;
  appointmentId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentMethod: string;
  transactionId?: string;
  preferenceId?: string;
  receiptUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PaymentCreationAttributes extends Omit<PaymentAttributes, 'id'> {}

class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public id!: string;
  public appointmentId!: string;
  public amount!: number;
  public currency!: string;
  public status!: 'pending' | 'paid' | 'refunded' | 'failed';
  public paymentMethod!: string;
  public transactionId?: string;
  public preferenceId?: string;
  public receiptUrl?: string;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Payment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    appointmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'appointments',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'refunded', 'failed'),
      allowNull: false,
      defaultValue: 'pending'
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    preferenceId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    receiptUrl: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Payment',
    tableName: 'payments'
  }
);

// Define associations
Payment.belongsTo(Appointment, { foreignKey: 'appointmentId' });
Appointment.hasOne(Payment, { foreignKey: 'appointmentId' });

export default Payment;