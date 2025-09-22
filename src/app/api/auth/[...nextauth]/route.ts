import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const client = new MongoClient(process.env.MONGODB_URI!);
        await client.connect();
        const db = client.db(process.env.MONGODB_DB_NAME);
        
        const user = await db.collection('users').findOne({ email: credentials.email });
        if (!user) { client.close(); return null; }
        
        const isValid = await bcrypt.compare(credentials.password, user.password);
        client.close();
        
        if (!isValid) return null;
        return { id: user._id.toString(), email: user.email, name: user.fullName, role: user.role };
      }
    })
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/auth/login', signUp: '/auth/signup' }
});

export { handler as GET, handler as POST };

