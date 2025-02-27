import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import User from './user';

interface MessageAttributes {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MessageCreationAttributes extends Omit<MessageAttributes, 'id'> {}

class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
  public id!: string;
  public senderId!: string;
  public receiverId!: string;
  public content!: string;
  public read!: boolean;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Message.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    receiverId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'Message',
    tableName: 'messages'
  }
);

// Define associations
Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
Message.belongsTo(User, { as: 'receiver', foreignKey: 'receiverId' });

export default Message;