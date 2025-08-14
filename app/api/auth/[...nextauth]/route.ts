import NextAuth, { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@/app/generated/prisma";
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

const prisma = new PrismaClient();

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

        // Chercher la boutique avec admin
        const boutique = await prisma.boutique.findUnique({
          where: { nom_boutique: credentials.nom_boutique },
        });

        if (!boutique) {
          throw new Error("Boutique introuvable");
        }

        // Vérifier le mot de passe hashé
        const isValid = await bcrypt.compare(
          credentials.password,
          boutique.password
        );
        if (!isValid) {
          throw new Error("Mot de passe incorrect");
        }

        return {
          id: boutique.id.toString(),
          name: boutique.nom_boutique,
          admin: Boolean(boutique.admin),
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 jours
    updateAge: 24 * 60 * 60, // rafraîchit tous les 24h
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.boutiqueId = user.id; // id de la boutique
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
      // Rediriger vers la page d'accueil après déconnexion
      if (url.includes("/logout")) {
        return baseUrl;
      }
      return url;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
