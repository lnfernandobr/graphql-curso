import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { UsersCollection, UserTypeDefs } from "./user/UserSchema.mjs";
import { UserResolvers } from "./user/UserResolvers.mjs";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const URL = "mongodb://localhost/graphql";

mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongo is running...");
  });

const server = new ApolloServer({
  typeDefs: UserTypeDefs,
  resolvers: UserResolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  async context({ req }) {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace("Bearer", "").trim();
    if (!token) {
      return {};
    }
    try {
      const decoded = jwt.verify(token, "123");
      const { userId } = decoded || {};
      const user = await UsersCollection.findById(userId);
      return { user };
    } catch (error) {
      return {};
    }
  },
});

console.log(`🚀  Server ready at: ${url}`);
