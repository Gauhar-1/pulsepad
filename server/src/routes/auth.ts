import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { asyncHandler } from '../utils/asyncHandler';
import { env } from '../config/env';
import { authenticate, signToken, type AuthUser, type UserRole } from '../middleware/auth';
import { connectToDatabase } from '../lib/mongodb';
import Employee from '../models/Employee';
import Client from '../models/Client';

const router = Router();
const googleClient = new OAuth2Client(env.googleClientId, env.googleClientSecret);

const allowedRoles: UserRole[] = ['admin', 'employee', 'client'];

router.post(
  '/google',
  asyncHandler(async (req, res) => {
    const { credential, role } = req.body as { credential?: string; role?: UserRole };

    if (!credential || !role) {
      return res.status(400).json({ message: 'Missing Google credential or role selection.' });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role selection.' });
    }

    if(!env.googleClientId || !env.googleClientSecret) {
      return res.status(500).json({ message: 'Google client ID or secret is not set.' });
    }

    await connectToDatabase();

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: env.googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.sub) {
      return res.status(401).json({ message: 'Unable to verify Google token.' });
    }

    const normalizedEmail = payload.email.toLowerCase();
    let user: AuthUser | null = null;

    if (role === 'admin') {
      const admin = await Employee.findOne({
        email: normalizedEmail,
        role: 'admin',
        status: 'ACTIVE',
      }).exec();
      if (!admin) {
        return res.status(401).json({ message: 'You are not authorized to log in as an admin.' });
      }
      if (!admin.googleId) {
        admin.googleId = payload.sub;
        await admin.save();
      }
      user = {
        sub: admin._id,
        email: admin.email,
        name: admin.name,
        picture: payload.picture,
        avatarUrl: payload.picture,
        role: 'admin',
      };
    } else if (role === 'employee') {
      const employee = await Employee.findOne({
        email: normalizedEmail,
        role: 'employee',
        status: 'ACTIVE',
      }).exec();
      if (!employee) {
        return res.status(401).json({ message: 'You are not authorized to log in as an employee.' });
      }
      if (!employee.googleId) {
        employee.googleId = payload.sub;
        await employee.save();
      }
      user = {
        sub: employee._id,
        email: employee.email,
        name: employee.name,
        picture: payload.picture,
        avatarUrl: payload.picture,
        role: 'employee',
      };
    } else if (role === 'client') {
      let client = await Client.findOne({ email: normalizedEmail }).exec();
      if (!client) {
        client = await Client.create({
          _id: `client-${Date.now()}`,
          name: payload.name || normalizedEmail,
          email: normalizedEmail,
          status: 'ACTIVE',
        });
      }
      if (client.status !== 'ACTIVE') {
        return res.status(403).json({ message: 'Your client account is inactive. Contact support.' });
      }
      user = {
        sub: client._id,
        email: client.email,
        name: client.name,
        picture: payload.picture,
        avatarUrl: payload.picture,
        role: 'client',
      };
    }

    if (!user) {
      return res.status(400).json({ message: 'Unable to complete login.' });
    }

    const token = signToken(user);

    res.json({
      token,
      user,
    });
  }),
);

router.get(
  '/verify',
  authenticate,
  asyncHandler(async (req, res) => {
    return res.json({ user: req.user });
  }),
);

export default router;

