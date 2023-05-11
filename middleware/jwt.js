import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import _ from "lodash";

export const generateTokens = async (user) => {
  const createToken = jwt.sign(
    { user: _.pick(user, ["id", "username", "email", "role"]) },
    process.env.PRIVATE_KEY,
    {
      expiresIn: "20m",
    }
  );

  const createRefreshToken = jwt.sign(
    { user: _.pick(user, ["id", "username", "email", "role"]) },
    process.env.PRIVATE_KEY,
    {
      expiresIn: "7d",
    }
  );

  return Promise.all([createRefreshToken, createToken]);
};

export const refreshTokens = async (token, refreshTokens, models) => {
  let userId = -1;

  try {
    const {
      user: { id },
    } = jwt.verify(refreshTokens, process.env.PRIVATE_KEY);
    userId = id;
  } catch (error) {
    return {};
  }

  const user = await models.User.findOne({ where: { id: userId }, raw: true });
  const [newToken, newRefreshToken] = await generateTokens(user);

  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user,
  };
};

export const verifyToken = (token) => {
  try {
    const user = jwt.verify(token, process.env.PRIVATE_KEY);
    return user;
  } catch (error) {
    return null;
  }
};
