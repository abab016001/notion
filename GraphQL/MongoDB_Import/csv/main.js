const mongoose = require("mongoose");
const fs = require("fs");
const csv = require("csv-parser"); // 用來解析 CSV 檔案

// 定義 User Schema
const userSchema = new mongoose.Schema({
    name: String, 
    age: Number,
    email: { type: String, unique: true }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

// 連接到 MongoDB
mongoose.connect("mongodb://localhost:27017/mygrahql");

const users = [];

mongoose.connection.once("open", async () => {
    console.log("已連接到 MongoDB");

    // 讀到 CSV 檔案並解析資料
    fs.createReadStream("./asset/user.csv")
        .pipe(csv())
        .on("data", (row) => {
            users.push({
                name: row.name,
                age: parseInt(row.age),
                email: row.email
            });
        })
        .on("end", async () => {
            console.log("CSV 讀取完畢");

            try {
                // 批量插入資料
                await User.insertMany(users);
                console.log("CSV 資料已寫入資料庫");
            } catch (err) {
                console.error("資料庫寫入失敗: ", err.message);
            } finally {
                mongoose.connection.close();
            }
        });

});