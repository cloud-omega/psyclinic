import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import User from './user';

interface AppointmentAttributes {
  id: string;
  psychologistId: string;
  patientId: string;
  startTime: Date;
  endTime: Date;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt?: Date;
  updatedAt?: Date;
}

interface AppointmentCreationAttributes extends Omit<AppointmentAttributes, 'id'> {}

class Appointment extends Model<AppointmentAttributes, AppointmentCreationAttributes> implements AppointmentAttributes {
  public id!: string;
  public psychologistId!: string;
  public patientId!: string;
  public startTime!: Date;
  public endTime!: Date;
  public status!: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  public notes?: string;
  public paymentStatus!: 'pending' | 'paid' | 'refunded';
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Appointment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    psychologistId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    patientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'completed', 'cancelled', 'no-show'),
      allowNull: false,
      defaultValue: 'scheduled'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'refunded'),
      allowNull: false,
      defaultValue: 'pending'
    }
  },
  {
    sequelize,
    modelName: 'Appointment',
    tableName: 'appointments'
  }
);

// Define associations
Appointment.belongsTo(User, { as: 'psychologist', foreignKey: 'psychologistId' });
Appointment.belongsTo(User, { as: 'patient', foreignKey: 'patientId' });

export default Appointment;