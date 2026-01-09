import "dotenv/config";
import express from "express";
import passport from "passport";
import "./google";

const app = express();

app.use(passport.initialize());

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req: express.Request & { user?: any }, res) => {
    const user = req.user as any;

    res.json({
      token: user.token,
      user: user.profile
    });
  }
);

app.listen(5001, () => {
  console.log("🔐 Auth service running on :5001");
});
