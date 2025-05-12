const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");
const User = require("./models/User");

// MongoDB連線
mongoose.connect("mongodb://localhost:27017/mygraphql");

// GraphQL schema
const typeDefs = gql`
    type User {
        id: ID!
        name: String
        age: Int
        email: String
    }

    type Query {
        users: [User]
        user(id: ID!): User
    }

    type Mutation {
        addUser(name: String!, age: Int!, email: String!): User
    }
`;

// Resolver
const resolvers = {
    Query: {
        users: async () => User.find(),
        user: async (_, { id }) => User.findById(id),
    },
    Mutation: {
        addUser: (_, { name, age, email }) => User.create({ name, age, email }),
    },
}

// 啟動 Server
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});