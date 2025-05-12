import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(express.json());

// 連接到 MongoDB
mongoose.connect("mongodb://localhost:27017/rest-react-db");

// 資料結構定義
const Schema = mongoose.Schema;
const ItemSchema = new Schema({
    name: String, 
    description: String
});

const Item = mongoose.model("Item", ItemSchema);

// 設定 REST API 路由
app.get('/api/items', async (req, res) => {
    //console.log("get", req);
    const items = await Item.find();
    res.json(items);
})

app.post('/api/items', async (req, res) => {
    const newItem = new Item(req.body);
    console.log(req.body);
    await newItem.save();
    res.json(newItem);
});

app.listen(3000, () => console.log('Server running on port 3000'));