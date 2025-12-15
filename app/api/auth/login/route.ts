import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const handler = NextAuth({
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      async authorize(credentials) {
        // ADMIN ONLY
        if (
          credentials?.email === "admin@mail.com" &&
          credentials.password === "admin123"
        ) {
          return {
            id: "1",
            name: "Admin",
            email: "admin@mail.com",
            role: "admin",
          };
        }

        return null; // user biasa TIDAK BISA LOGIN
      },
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = "admin";
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role as string;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
