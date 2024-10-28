import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';

import { prisma } from '@/lib/prisma';
import authConfig from '@/auth.config';
import { getUserByEmail } from '@/data/user';
import { stripe } from './lib/stripe';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  callbacks: {

    async session({ session }) {
      if (!session) return;

  
      session.user = await getUserByEmail(session.user.email);

      return session;
    },
  },
  pages: {
    signIn: '/auth/sign-in',
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  events: {
    createUser: async (message) => {
      const userId = message.user.id;
      const email = message.user.email;

      if (!userId || !email) {
          return;
      }
      const StripeCustomer = await stripe.customers.create({
        email
      })
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          stripeCustomerId: StripeCustomer.id,
        }
      })
    }

  },
  ...authConfig,
});
