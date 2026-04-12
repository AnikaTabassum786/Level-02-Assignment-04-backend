import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { oAuthProxy } from "better-auth/plugins";
// If your Prisma file is located elsewhere, you can change the path



export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
      baseURL: process.env.APP_URL,
    trustedOrigins:[process.env.APP_URL!],
    user:{
       additionalFields:{
        role:{
          type:"string",
          defaultValue:"CUSTOMER",
          required:false
        },
        phone:{
            type:"string",
            required:false
           }
       }
    },
    emailAndPassword: { 
    enabled: true, 
  }, 
    socialProviders: {
        google: { 
            prompt: "select_account consent", 
            accessType: "offline", 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },


advanced: {
    cookies: {
      session_token: {
        name: "session_token", // Force this exact name
        attributes: {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          partitioned: true,
        },
      },
      state: {
        name: "session_token", // Force this exact name
        attributes: {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          partitioned: true,
        },
      },
    },
  },

  plugins: [oAuthProxy()],



});