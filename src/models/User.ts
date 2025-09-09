import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  clerkId: string; // Clerk user ID
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  clerkId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret.__v;
      return ret;
    }
  }
});

// Ensure unique index on clerkId
UserSchema.index({ clerkId: 1 }, { unique: true });

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;