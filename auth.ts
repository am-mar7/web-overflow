import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import api from "./lib/api";
import { ActionResponse } from "./Types/global";
import { IAccountDoc } from "./models/account.model";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Google],
  callbacks: {
    session: async ({ session, token }) => {
      session.user.id = token.sub! as string;
      return session;
    },
    jwt: async ({ token, account }) => {
      if(account){
        const {data , success} = await api.accounts.getByProvider(
          account.type === "credentials" ?
          token.email! : account.providerAccountId
        ) as ActionResponse<IAccountDoc>
        if (!success || !data) 
          return token;
        
        const userId = data.userId;
        if(userId) token.sub = userId.toString();
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
      const { success } = await api.auth.oAuthSignIn({
        user: userInfo ,
        provider: account!.provider as "google" | "github",
        providerAccountId: account!.providerAccountId,
      }) as ActionResponse;

      return success;
    },
  },
});
