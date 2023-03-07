import { UsersCollection } from "./UserSchema.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET = "123";

export const UserResolvers = {
  Query: {
    loggedUser(root, { userId }, { user }) {
      if (!user) {
        return null;
      }
      return user;
    },
    async login(root, { email, password }) {
      const formattedEmail = email.toLowerCase().trim();

      const userDb = await UsersCollection.findOne({
        email: formattedEmail,
      });

      if (!userDb) {
        throw new Error("Usuário não existe.");
      }

      const passwordMatch = await bcrypt.compare(password, userDb.password);
      if (!passwordMatch) {
        throw new Error("Senha incorreta.");
      }

      return jwt.sign({ userId: userDb._id }, SECRET);
    },
  },
  Mutation: {
    async createUser(root, { name, email, password }) {
      const formattedEmail = email.toLowerCase().trim();

      const userAlreadyExists = await UsersCollection.findOne({
        email: formattedEmail,
      });

      if (userAlreadyExists) {
        throw new Error("Usuário já existe.");
      }

      const user = new UsersCollection({
        name,
        email: formattedEmail,
        password: await bcrypt.hash(password, 10),
        createdAt: new Date(),
      });

      await user.save();
      return user;
    },
  },
};
