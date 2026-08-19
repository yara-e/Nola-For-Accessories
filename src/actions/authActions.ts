'use server';

import { connectDB } from '@/lib/db';
import { User } from '@/models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const JWT_SECRET = process.env.JWT_SECRET || 'nola-secret-key-2026';

/**
 * 1. ADMIN LOGIN
 */
export async function adminLogin(nameInput: string, passwordInput: string) {
  try {
    await connectDB();

    if (!nameInput || !passwordInput) {
      return { success: false, error: 'Name and password are required' };
    }

    // Case-insensitive lookup
    const user = await User.findOne({
      name: { $regex: new RegExp(`^${nameInput.trim()}$`, 'i') },
    });

    if (!user) {
      return { success: false, error: 'Invalid username or password' };
    }

    // Verify password using schema method or bcrypt directly
    const isValid = await bcrypt.compare(passwordInput, user.password);
    if (!isValid) {
      return { success: false, error: 'Invalid username or password' };
    }

    // Sign JWT Token
    const token = jwt.sign(
      { userId: user._id.toString(), name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Store in secure HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return { success: true, userId: user._id.toString(), name: user.name };
  } catch (error) {
    console.error('Error during admin login:', error);
    return { success: false, error: 'Login failed due to a server error.' };
  }
}

/**
 * 2. GET ADMIN SESSION
 */
export async function getAdminSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      name: string;
    };
    return decoded;
  } catch {
    return null;
  }
}

/**
 * 3. RESET ADMIN PASSWORD
 */
export async function resetAdminPassword(
  oldPasswordInput: string,
  newPasswordInput: string
) {
  try {
    await connectDB();

    const session = await getAdminSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const user = await User.findById(session.userId);
    if (!user) {
      return { success: false, error: 'Admin user not found' };
    }

    // Verify old password
    const isOldPasswordValid = await bcrypt.compare(
      oldPasswordInput,
      user.password
    );
    if (!isOldPasswordValid) {
      return { success: false, error: 'Current password is incorrect' };
    }

    // Pass the raw plain password directly!
    // The Mongoose pre('save') hook in User.ts will hash it automatically once.
    user.password = newPasswordInput;
    await user.save();

    return { success: true, message: 'Password updated successfully' };
  } catch (error) {
    console.error('Error resetting password:', error);
    return { success: false, error: 'Failed to reset password.' };
  }
}

/**
 * 4. ADMIN LOGOUT
 */
export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
  redirect('/admin/login');
}