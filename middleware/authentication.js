import { refreshTokens, verifyToken } from "./jwt.js";

export const authenticateUser = (model) => {
  return async (req, res, next) => {
    const token = req.headers["x-token"];
    if (token) {
      try {
        const { user } = verifyToken(token);
        req.user = user;
      } catch (err) {
        const refreshToken = req.headers["x-refresh-token"];
        const newTokens = await refreshTokens(token, refreshToken, model);
        if (newTokens.token && newTokens.refreshToken) {
          res.set(
            "Access-Control-Expose-Headers",
            "x-token",
            "x-refresh-token"
          );
          res.set("x-token", newTokens.token);
          res.set("x-refresh-token", newTokens.refreshToken);
        }
        req.user = newTokens.user;
      }
    }
    next();
  };
};
