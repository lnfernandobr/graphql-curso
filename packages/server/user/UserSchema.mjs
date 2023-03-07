import mongoose from "mongoose";
export const UserTypeDefs = `
  type Query {
    loggedUser: User
    login(email: String!, password: String!): String
  }
  
  type Mutation {
    createUser(name: String!, email: String!, password: String!): User
  }
    
  type User {
    _id: ID!
    name: String!
    email: String!
  }
`;

export const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  createdAt: Date,
});

export const UsersCollection = mongoose.model("User", userSchema);
