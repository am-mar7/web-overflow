import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import api from "./lib/api";
import { ActionResponse } from "./Types/global";
import { IAccountDoc } from "./models/account.model";
import Credentials from "next-auth/providers/credentials";
import { SignInSchema } from "./lib/validation";
import bcrypt from "bcryptjs";
import { IUserDoc } from "./models/user.model";
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Google,
    Credentials({
      async authorize(credentials) {
        const validated = SignInSchema.safeParse(credentials);
        if (validated.success) {
          const { email, password } = validated.data;

          const { data: account } = (await api.accounts.getByProvider(
            email
          )) as ActionResponse<IAccountDoc>;
          if (!account) return null;

          const { data: user } = (await api.users.getById(
            account.userId.toString()
          )) as ActionResponse<IUserDoc>;
          if (!user) return null;

          const isValidPassword = await bcrypt.compare(
            password,
            account.password!
          );

          if (isValidPassword) {
            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              image: user.image,
            };
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      session.user.id = token.sub! as string;
      return session;
    },
    jwt: async ({ token, account }) => {
      if (account) {
        const { data, success } = (await api.accounts.getByProvider(
          account.type === "credentials"
            ? token.email!
            : account.providerAccountId
        )) as ActionResponse<IAccountDoc>;
        if (!success || !data) return token;

        const userId = data.userId;
        if (userId) token.sub = userId.toString();
      }
      return token;
    },
    signIn: async ({ user, account }) => {
      if (account?.type === "credentials") return true;
      if (!user && !account) return false;

      const userInfo = {
        name: user.name!,
        email: user.email!,
        image: user.image!,
      };
      const { success } = (await api.auth.oAuthSignIn({
        user: userInfo,
        provider: account!.provider as "google" | "github",
        providerAccountId: account!.providerAccountId,
      })) as ActionResponse;

      return success;
    },
  },
});
