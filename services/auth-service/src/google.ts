// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       callbackURL: "/auth/google/callback"
//     },
//     async (_, __, profile, done) => {
//       // Later: upsert user in Postgres
//       done(null, profile);
//     }
//   )
// );



import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { db } from "@gigmatch/db";
import { users } from "@gigmatch/db/src/schema/users";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:5001/auth/google/callback"
    },
    async (_, __, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value!;
        const name = profile.displayName;

        // 🔐 CHECK IF USER EXISTS
        const existing = await db
          .select()
          .from(users)
          .where(eq(users.email, email));

        let user;

        if (existing.length === 0) {
          // 🆕 CREATE USER
          const created = await db
            .insert(users)
            .values({
              name,
              email,
              role: "freelancer" // default
            })
            .returning();

          user = created[0];
        } else {
          user = existing[0];
        }

        // 🎟️ ISSUE JWT
        const token = jwt.sign(
          {
            userId: user.id,
            role: user.role
          },
          process.env.JWT_SECRET!,
          { expiresIn: "15m" }
        );

        done(null, {
          token,
          profile: user
        });
      } catch (err) {
        done(err, undefined);
      }
    }
  )
);
