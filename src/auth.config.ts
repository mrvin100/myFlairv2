import type { NextAuthConfig, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from '@/lib/utils';
import { signInSchema } from '@/schemas';
import { getUserByEmail } from '@/data/user';

const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const parsedCredentials = signInSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          try {
            const user = await getUserByEmail(email);

            if (!user?.password) return null;

            if (compare(password, user.password)) {
              return {
                id: user.id,
                email: user.email,
                name: `${user.firstName} ${user.lastName}`, 
                image: user.image,
                role: user.role, 
              } as User;
            }
          } catch (error) {
            console.error("Authorization error:", error);
          }
        }
        return null;
      },
    }),
  ],
};

export default authConfig;
