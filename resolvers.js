import bcrypt from "bcrypt";
import { generateTokens } from "./middleware/jwt.js";
import { PubSub } from "graphql-subscriptions";
import { isAuthenticated } from "./middleware/authPermissions.js";

export const pubSub = new PubSub();

const BOARD_ADDED = "BOARD_ADDED";

export default {
  Subscription: {
    boardAdded: {
      subscribe: () => pubSub.asyncIterator(BOARD_ADDED),
    },
  },

  Query: {
    allUsers: async (parent, args, { models }) => models.User.findAll(),

    me: async (parent, _, { models, user }) => {
      if (user) {
        return models.User.findOne({ where: { email: user.email } });
      }
      throw new Error("Authorization denied");
    },

    userBoards: async (parent, { owner }, { models }) => {
      models.Board.findAll({ where: { owner } });
    },

    userSuggestions: async (parent, { creatorId }, { models }) => {
      models.Suggestion.findAll({ where: { creatorId } });
    },
  },

  Mutation: {
    register: async (parent, args, { models }) => {
      const user = args.input;
      user.password = await bcrypt.hash(user.password, 12);
      return await models.User.create(user);
    },

    login: async (parent, { email, password }, { models, SECRET }) => {
      const user = await models.User.findOne({ where: { email } });
      if (!user) throw new Error("Invalid Credentials");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid Credentials");

      const [token, refreshToken] = generateTokens(user);
      return { token, refreshToken };
    },

    refreshToken: async (parent, { token, refreshToken }, models) => {
      refreshToken(token, refreshToken, models);
    },

    updateUser: async (parent, args, { models }) => {
      const { username, email } = args.input;
      const user = await models.User.update({ username }, { where: { email } });
      return user;
    },
    deleteUser: async (parent, args, { models }) =>
      await models.User.destroy({ where: args }),

    createBoard: isAuthenticated.createResolver(
      async (parent, args, { models }) => {
        return await models.Board.create({ ...args.input });
      }
    ),

    createSuggestion: async (parent, args, { models }) => {
      const boardAdded = await models.Suggestion.create({ ...args.input });
      pubSub.publish(BOARD_ADDED, { boardAdded });
      return boardAdded;
    },
  },
  Board: {
    owner: async (board, _, { models }) => {
      return await models.User.findOne({ where: { id: board.owner } });
    },
  },

  Suggestion: {
    creator: async (suggestion, _, { models }) => {
      return await models.User.findOne({ where: { id: suggestion.creatorId } });
    },

    board: async (suggestion, _, { models }) => {
      return await models.Board.findOne({ where: { id: suggestion.boardId } });
    },
  },

  User: {
    boards: async (user, _, { models }) => {
      return await models.Board.findAll({ where: { owner: user.id } });
    },
    suggestions: async (user, _, { models }) => {
      return await models.Suggestion.findAll({ where: { creatorId: user.id } });
    },
  },
};
