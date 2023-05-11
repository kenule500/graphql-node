const createResolver = (resolver) => {
  const baseResolver = resolver;
  baseResolver.createResolver = (childResolver) => {
    const newResolver = async (parent, args, context) => {
      await resolver(parent, args, context);
      return childResolver(parent, args, context);
    };

    return createResolver(newResolver);
  };

  return baseResolver;
};

export const isAuthenticated = createResolver((parent, args, context) => {
  if (!context.user) throw new Error("Not Authenticated");
});

export const isAdmin = isAuthenticated.createResolver(
  (parent, args, context) => {
    if (!context.user.role === "admin")
      throw new Error("Requires admin access");
  }
);

// const bannedUsername = isAuthenticated.createResolver(
//   (parent, args, context) => {
//     if (!context.user.username === "don") throw new Error("Banned username");
//   }
// );

// Alternative permmissions
// import { createResolver } from "graphql-resolvers";
// import { ForbiddenError } from "apollo-server";

// // Define custom permission check functions based on your application's logic
// const isAdmin = (user) => user.role === "admin";
// const isEditor = (user) => user.role === "editor";
// const isLoggedin = () => user;

// export const withLoggedinPermission = createResolver(
//   (parent, args, { user }) => {
//     if (!isLoggedin(user)) {
//       throw new ForbiddenError(
//         "You are not authorized to perform this operation."
//       );
//     }
//   }
// );

// export const withAdminPermission = createResolver((parent, args, { user }) => {
//   if (!isAdmin(user)) {
//     throw new ForbiddenError(
//       "You are not authorized to perform this operation."
//     );
//   }
// });

// export const withEditorPermission = createResolver((parent, args, { user }) => {
//   if (!isEditor(user)) {
//     throw new ForbiddenError(
//       "You are not authorized to perform this operation."
//     );
//   }
// });

// global error handling

// const formatError = (error) => {
//   let customError = {
//     statusCode: error.extensions?.exception?.statusCode || 500,
//     message: error.message || "Something went wrong. Please try again later.",
//   };

//   if (error.originalError.name === "ValidationError") {
//     customError.message = Object.values(error.originalError.errors)
//       .map((item) => item.message)
//       .join(",");
//     customError.statusCode = 400;
//   }

//   if (error.originalError.code && error.originalError.code === 11000) {
//     customError.message = `Duplicate value entered for ${Object.keys(
//       error.originalError.keyValue
//     )} field. Please choose another value.`;
//     customError.statusCode = 400;
//   }

//   if (error.originalError.name === "CastError") {
//     customError.message = `No item found with id: ${error.originalError.value}`;
//     customError.statusCode = 404;
//   }

//   return customError;
// };

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   formatError,
// });
