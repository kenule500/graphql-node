import { gql } from "apollo-server";

export const typeDefs = gql`
  type Subscription {
    boardAdded: Board!
  }

  type Suggestion {
    id: Int!
    text: String!
    creator: User!
    board: Board!
    createdAt: String!
    updatedAt: String!
  }

  type Board {
    id: Int!
    name: String!
    suggestions: [Suggestion]!
    owner: User!
    createdAt: String!
    updatedAt: String!
  }
  type User {
    id: Int!
    username: String!
    email: String!
    password: String!
    role: Role!
    boards: [Board!]!
    suggestions: [Suggestion!]!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    refreshToken: String!
  }

  enum Role {
    admin
    user
  }

  type Query {
    me: User!
    allUsers: [User!]!
    userBoards(owner: Int!): [Board!]!
    userSuggestions(creatorId: Int!): [Suggestion!]!
  }

  input registerInput {
    username: String!
    email: String!
    password: String!
  }

  type registerOuput {
    username: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }
  type UpdateUserOuput {
    username: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }
  input UpdateUserInput {
    username: String!
    email: String!
    password: String!
  }

  input CreateUBoardInput {
    name: String!
    owner: Int!
  }
  input CreateUSuggestionInput {
    text: String!
    boardId: Int!
    creatorId: Int!
  }

  type Mutation {
    register(input: registerInput!): registerOuput!
    login(email: String!, password: String!): String!
    updateUser(input: UpdateUserInput!): [Int!]!
    deleteUser(email: String!): Int!

    createBoard(input: CreateUBoardInput!): Board!
    createSuggestion(input: CreateUSuggestionInput): Suggestion!

    refreshToken(token: String!, refreshToken: String!): AuthPayload!
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;
