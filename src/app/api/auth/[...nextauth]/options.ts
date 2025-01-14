import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import  connect  from '@/app/dbConfig/connect';
import User from "@/app/models/UsersModel"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any): Promise<any> {
        
        await connect()
        try {
          const user = await User.findOne( { email: credentials.identifier });
          if (!user) {
            throw new Error('No user found with this email');
          }
          console.log("  user.password",  user.password,credentials.password)
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error('Incorrect password');
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },

      
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      
      if (user) {
        token._id = user._id?.toString(); 
  
        
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // Allow only URLs from your domain
      if (url.startsWith(baseUrl)) {
        return url;
      } else {
        return baseUrl;
      }
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
      }
      return session;
    },
  },
  jwt:{
    // maxAge: 60
  },
  session: {
    strategy: 'jwt',
    // maxAge:60
  },

  
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/sign-in',
    // signOut:'/sign-in'
  },
};
