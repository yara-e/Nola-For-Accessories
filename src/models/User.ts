import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
  },
  {
    timestamps: true, // Handles createdAt and updatedAt automatically
  }
);

// Hash password automatically before saving
UserSchema.pre('save', async function () {
  // If password wasn't modified, skip hashing
  if (!this.isModified('password')) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// Helper method for secure password checking
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Prevent Next.js HMR compilation crashes
// if (process.env.NODE_ENV === 'development' && mongoose.models.User) {
//   delete mongoose.models.User;
// }

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);