import bcrypt from 'bcryptjs';
import { User } from '../models/User';

export const ensureBootstrapAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return;
  }

  const existingUser = await User.findOne({ email: adminEmail });

  if (existingUser) {
    if (existingUser.role === 'admin') {
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    existingUser.role = 'admin';
    existingUser.password = hashedPassword;
    existingUser.verified = true;
    await existingUser.save();

    console.log(`🔐 Existing user upgraded to admin: ${adminEmail}`);
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await User.create({
    name: process.env.ADMIN_NAME || 'Admin User',
    email: adminEmail,
    phone: process.env.ADMIN_PHONE || '0000000000',
    password: hashedPassword,
    farmSize: 0,
    location: {
      state: 'Admin',
      district: 'Admin',
      coordinates: {
        latitude: 0,
        longitude: 0,
      },
    },
    soilType: 'N/A',
    waterSource: 'N/A',
    role: 'admin',
    crops: [],
    points: 0,
    verified: true,
  });

  console.log(`🔐 Bootstrap admin created: ${adminEmail}`);
};