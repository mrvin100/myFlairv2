import NextAuth, { Session, DefaultSession } from 'next-auth';
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
  adapter: PrismaAdapter(prisma) as any,
  callbacks: {
    async session({ session }): Promise<Session | DefaultSession> {
      if (!session?.user?.email) return session;
      const user = await getUserByEmail(session.user.email);
      if (user) session.user = { ...session.user, ...user } as unknown as typeof session.user;

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
      const { id: userId, email } = message.user;

      if (!userId || !email) return;
      const StripeCustomer = await stripe.customers.create({ email });
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: StripeCustomer.id },
      });
    },
  },
  ...authConfig,
});