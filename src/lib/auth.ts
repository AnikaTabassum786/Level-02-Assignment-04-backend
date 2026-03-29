import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
// If your Prisma file is located elsewhere, you can change the path



export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
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


    //Ban
//   hooks: {
//   before: async (ctx) => {
//     const path = (ctx as any).path;

//     if (path === "/sign-in/email") {
//       const body = ctx.body as { email?: string } | undefined;

//       if (!body?.email) return ctx;

//       const existingUser = await prisma.user.findUnique({
//         where: { email: body.email },
//       });

//       if (existingUser?.isBanned) {
//         throw new Error("Your account has been banned");
//       }
//     }

//     return ctx;
//   },
// },



});