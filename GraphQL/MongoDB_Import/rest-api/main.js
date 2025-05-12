const express = require('express');
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');

const app = express();

// 連接到 MongoDB
mongoose.connect('mongodb://localhost:27017/restdb');

// 資料結構定義
const Schema = mongoose.Schema;
const ItemSchema = new Schema({
    email: String,
    userName: String,
    password: String,
    url: String,
    ip: String,
    mac: String,
    avatar: String
});

const Item = mongoose.model("Item", ItemSchema);

// 設定 REST API 路由
app.get('/api/items', async (req, res) => {
    const items = await Item.find();
    res.json(items);
});

app.post('/api/items', async (req, res) => {
    const data = {
        email: faker.internet.email(),
        name: faker.internet.username(),
        password: faker.internet.password(),
        url: faker.internet.url(),
        ip: faker.internet.ip(),
        mac: faker.internet.mac(),
        avatar: faker.image.avatar()
    };
    const newItem = new Item(data);
    await newItem.save();
    res.json(newItem);
});

app.listen(3000, () => console.log('Server running on port 3000'));