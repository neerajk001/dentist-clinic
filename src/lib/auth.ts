import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { supabase } from './db';
import { authConfig } from './auth.config';

// Combine the edge-safe config with node-specific providers
const authOptions: NextAuthConfig = {
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', credentials.email)
            .single();

          // Test user fallback if DB fails or no user found (optional, good for dev)
          if (!user && credentials.email === 'doctor@example.com' && credentials.password === 'password') {
            return {
              id: '1',
              name: 'Dr. Smith',
              email: 'doctor@example.com',
              role: 'doctor',
            };
          }

          if (!user || error) {
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password as string, user.password);

          if (!isValid) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          // Fallback specific for dev environment or critical failure
          return null;
        }
      },
    }),
  ],
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);