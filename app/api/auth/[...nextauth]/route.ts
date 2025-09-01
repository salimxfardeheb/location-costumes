import NextAuth, { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
//import { PrismaClient } from "@/app/generated/prisma";
import { db } from "@/lib/firebase/connect";
import { collection, query, where, getDocs } from "firebase/firestore";
import bcrypt from "bcrypt";

declare module "next-auth" {
  interface Session {
    user: {
      boutiqueId: string;
      admin: boolean;
      name?: string | null;
    };
  }
  interface User {
    id: string;
    admin: boolean;
    name?: string | null;
  }
}

//const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        nom_boutique: {
          label: "Nom d'utilisateur",
          type: "text",
          placeholder: "admin",
        },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.nom_boutique || !credentials?.password) {
          throw new Error("Champs manquants");
        }
        /**const boutique = await prisma.boutique.findUnique({
          where: { nom_boutique: credentials.nom_boutique },
        });*/

        const boutiqueRef = query(
          collection(db, "shop"),
          where("nom_boutique", "==", credentials.nom_boutique)
        );
        const snapshot = await getDocs(boutiqueRef);

        if (snapshot.empty) {
          throw new Error("Boutique introuvable");
        }

        const doc = snapshot.docs[0];
        const boutique = doc.data();

        const isValid = await bcrypt.compare(
          credentials.password,
          boutique.password
        );
        if (!isValid) {
          throw new Error("Mot de passe incorrect");
        }

        return {
          id: doc.id,
          name: boutique.nom_boutique,
          admin: Boolean(boutique.admin),
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.boutiqueId = user.id;
        token.nom_boutique = user.name;
        token.admin = user.admin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          boutiqueId: String(token.boutiqueId),
          admin: Boolean(token.admin),
          name: token.nom_boutique as string | undefined,
        };
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.includes("/logout")) {
        return baseUrl;
      }
      return url;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
