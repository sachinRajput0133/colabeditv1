import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../../lib/mongodb";
import dbConnect from "@lib/db";
import User from "@models/User";
import bcrypt from "bcryptjs";
import { CONFIG } from "../../../../config";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: CONFIG.GOOGLE_ID,
      clientSecret: CONFIG.GOOGLE_SECRET,
    }),
    GitHubProvider({
      clientId: CONFIG.GITHUB_ID,
      clientSecret: CONFIG.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🚀 ~ authorize ~ credentials:", credentials)

        console.log("this is credentiallllll")
        await dbConnect();
        const user = await User.findOne({ email: credentials.email }).select(
          "+password"
        );
        if (!user) {
          throw new Error("No user found with this email");
        }
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) {
          throw new Error("Invalid password");
        }
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        };
        //   return {
        //   id: "67cc10edc39445aa024d2c3a",
        //   name: "sa",
        //   email: "admin@yopmail.com ",
        //   role: "owner",
        //   // image: user.image,
        // };
      },
    }),
  ],
  // adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("this is callbacl jwttt")
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("🚀 ~ this is call back  ~ session:", session);
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    // error: "/login",
  },
  // basePath: "/api/auth",
  secret: CONFIG.NEXTAUTH_SECRET,
  url: CONFIG.FETCH_URL,
  // site: CONFIG.FETCH_URL,
  // allowDangerousEmailAccountLinking: true, // Enable account linking
  debug:true
};

export default NextAuth(authOptions);
