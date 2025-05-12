const { ApolloServer, gql } = require('apollo-server-express');
const mongoose = require('mongoose');
const express = require('express');

// 連接到 MongoDB
mongoose.connect('mongodb://localhost:27017/gqldb');

// 資料結構定義
const Schema = mongoose.Schema;
const ItemSchema = new Schema({
    accountNumber: String,
    amount: Number,
    currencyCode: String,
    iban: String
});

const Item = mongoose.model('Item', ItemSchema);

// 設定 GraphQL schema
const typeDefs = gql`
    type Item {
        id: ID!
        accountNumber: String!
        amount: Float!
        currencyCode: String!
        iban: String!
    }

    type Query {
        items: [Item]
    }

    type Mutation {
        addItem(accountNumber: String, amount: Float, currencyCode: String, iban: String): Item
    }
`;

const resolvers = {
    Query: {
        items: async () => Item.find(),
    },
    Mutation: {
        addItem: async (_, { accountNumber, amount, currencyCode, iban }) => {
            const newItem = new Item({ accountNumber, amount, currencyCode, iban });
            await newItem.save();
            return newItem;
        }
    }
};

async function startServer() {
    // 建立 Apollo Server
    const server = new ApolloServer({ typeDefs, resolvers });
    const app = express();

    // 必須先 await server.start() 先啟動 Apllo Server
    await server.start();

    // 然後才能套用中介軟體
    server.applyMiddleware({ app });

    app.listen(3000, () => console.log('Server running on port 3000'));
}

startServer();